"use client";
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { ID, Client, Databases, Query, Models, RealtimeResponseEvent } from 'appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';

type Message = {
  $id: string;
  message: string;
  userId: string;
  username: string;
  timestamp: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingMessage, setIsDeletingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

  const [client] = useState(new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId));

  const [databases] = useState(new Databases(client));


    useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/sign-in');
        } else {
          setCurrentUser(user);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        router.push('/');
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          window.location.href = '/sign-in';
          return;
        }
        setCurrentUser(user);

        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.chatCollectionId, 
          [Query.orderDesc('timestamp'), Query.limit(50)]
        );
        
       
        const fetchedMessages = response.documents.map(doc => ({
          $id: doc.$id,
          message: doc.message,
          userId: doc.userId,
          username: doc.username,
          timestamp: doc.timestamp
        } as Message));
        
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error loading chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.chatCollectionId, 
        ID.unique(),
        {
          message: newMessage,
          userId: currentUser.accountId,
          username: currentUser.fullName,
          timestamp: new Date().toISOString(),
        }
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!currentUser) return;
    
    try {
      setIsDeletingMessage(messageId);
      
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.chatCollectionId,
        messageId
      );

      setMessages(prev => prev.filter(msg => msg.$id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. You might not have permission to delete this message.');
    } finally {
      setIsDeletingMessage(null);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    
    try {
      const unsubscribe = client.subscribe(
        `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.chatCollectionId}.documents`,
        (response: RealtimeResponseEvent<Message>) => {
          if (response.events.includes(`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.chatCollectionId}.documents.*.create`)) {
            const newMessage = response.payload as Message;
            setMessages(prev => [newMessage, ...prev]);
          }

          if (response.events.includes(`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.chatCollectionId}.documents.*.delete`)) {
            const deletedMessageId = response.payload.$id;
            setMessages(prev => prev.filter(msg => msg.$id !== deletedMessageId));
          }
        }
      );

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up real-time updates:', error);
      return () => {};
    }
  }, [currentUser, client, appwriteConfig.databaseId, appwriteConfig.chatCollectionId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    
    <div>
        <Navbar {...currentUser}/>
    <div className="container mx-auto py-30">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Chat Room</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-y-auto mb-4 space-y-2 flex flex-col-reverse">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500">No messages yet. Be the first to chat!</p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.$id}
                  className={`flex ${message.userId === currentUser?.accountId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`relative max-w-xs p-3 rounded-lg ${
                      message.userId === currentUser?.accountId 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="font-semibold">{message.username}</div>
                    <div>{message.message}</div>
                    <div className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                    
                   
                    {message.userId === currentUser?.accountId && (
                      <button
                        onClick={() => handleDeleteMessage(message.$id)}
                        disabled={isDeletingMessage === message.$id}
                        className={`absolute top-1 right-1 p-1 rounded-full 
                          ${message.userId === currentUser?.accountId 
                            ? 'text-white hover:bg-blue-600' 
                            : 'text-gray-600 hover:bg-gray-300'} 
                          transition-colors`}
                        aria-label="Delete message"
                      >
                        {isDeletingMessage === message.$id ? (
                          <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
    </div>
  );
}