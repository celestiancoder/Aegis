"use client"
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { ID, Client, Databases, Query, RealtimeResponseEvent } from 'appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Trash2, Send, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';


type Message = {
  $id: string;
  message: string;
  userId: string;
  username: string;
  timestamp: string;
};


type User = {
  accountId: string;
  fullName: string;

};

export default  function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingMessage, setIsDeletingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  

const [client, setClient] = useState<Client | null>(null);
  const [databases, setDatabases] = useState<Databases | null>(null);

  useEffect(() => {
    const newClient = new Client()
      .setEndpoint(appwriteConfig.endpointUrl)
      .setProject(appwriteConfig.projectId);
    setClient(newClient);
    setDatabases(new Databases(newClient));
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/sign-in');
        } else {
          setCurrentUser({
            accountId: user.accountId,
            fullName: user.fullName || 'User'
          });
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
      if (databases) {
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
    };}

    fetchData();
  }, [databases]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    if (databases) {
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
  };}

  const handleDeleteMessage = async (messageId: string) => {
    if (!currentUser) return;
    if (databases) {
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
  };}

  useEffect(() => {
    if (!currentUser) return;
    if (client) {
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
    }}

  }, [currentUser, client]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0B1940] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1940] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-500/20 blur-2xl"></div>
        <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400/20 to-teal-300/20 blur-2xl"></div>
        <div className="absolute bottom-10 left-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 blur-2xl"></div>
      </div>
      
     {currentUser && <Navbar fullName={currentUser.fullName} />}
      <div className="max-w-3xl mx-auto mt-20 text-center">
          <p className="text-blue-300 text-2xl">
            Connect with people around the world to discuss equality challenges and share solutions.
          </p>
        </div>
      
      <div className="container mx-auto py-24 px-4 relative z-10">
        <Card className="max-w-3xl mx-auto bg-[#0C1E4D]/80 border border-blue-500/30 backdrop-blur-sm shadow-xl text-blue-100">
          <CardHeader className="border-b border-blue-500/20 bg-[#0C1E4D]/90">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Users size={20} className="text-blue-300" />
                Global Chat Room
              </CardTitle>
              <div className="text-sm text-blue-300">
                {messages.length} messages
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 pb-4">
            <div className="h-96 overflow-y-auto mb-4 space-y-3 flex flex-col-reverse custom-scrollbar">
              {messages.length === 0 ? (
                <div className="text-center text-blue-300 py-10">
                  <div className="opacity-60 mb-2">💬</div>
                  <p>No messages yet. Be the first to start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.$id}
                    className={`flex ${message.userId === currentUser?.accountId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`relative max-w-xs p-3 rounded-lg shadow-md ${
                        message.userId === currentUser?.accountId 
                          ? 'bg-gradient-to-r from-purple-600/90 to-pink-500/90 text-white' 
                          : 'bg-[#081635]/70 border border-blue-500/20 text-blue-100'
                      }`}
                    >
                      <div className={`font-semibold ${
                        message.userId === currentUser?.accountId 
                          ? 'text-blue-100' 
                          : 'text-blue-300'
                      }`}>{message.username}</div>
                      <div className="py-1">{message.message}</div>
                      <div className="text-xs opacity-70 pt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      
                      {message.userId === currentUser?.accountId && (
                        <button
                          onClick={() => handleDeleteMessage(message.$id)}
                          disabled={isDeletingMessage === message.$id}
                          className={`absolute top-1 right-1 p-1 rounded-full 
                            hover:bg-black/20
                            transition-colors`}
                          aria-label="Delete message"
                        >
                          {isDeletingMessage === message.$id ? (
                            <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin" />
                          ) : (
                            <Trash2 size={16} className="text-blue-100 opacity-70 hover:opacity-100" />
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
          
          <CardFooter className="border-t border-blue-500/20 bg-[#0C1E4D]/90">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#081635]/80 border-blue-500/30 text-blue-100 placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none"
              >
                <Send size={18} className="mr-1" />
                Send
              </Button>
            </form>
          </CardFooter>
        </Card>
        
        
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(8, 22, 53, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
}