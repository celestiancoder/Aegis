"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import { getCurrentUser } from '@/lib/actions/user.actions';

export default function ResponsePractice() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

 
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      setAiResponse(data.response);

    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
      if (err.message.includes('Unauthorized')) {
        router.push('/sign-in');
      }
    } finally {
      setIsLoading(false);
    }
  };

 

  return (
    <div>
      <Navbar {...currentUser}/>
      <div className="container mx-auto py-30">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Practice Responses</CardTitle>
            <CardDescription>
              Enter a comment you'd like to practice responding to
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="prompt" className="block text-sm font-medium">
                  Comment to Respond To
                </label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type the comment here..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              {aiResponse && (
                <div className="space-y-2">
                  <label htmlFor="response" className="block text-sm font-medium">
                    Suggested Response
                  </label>
                  <Textarea
                    id="response"
                    value={aiResponse}
                    readOnly
                    className="min-h-[150px] bg-gray-50"
                  />
                </div>
              )}

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
            </CardContent>

            <CardFooter>
              <Button className='mt-10'
                type="submit"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? "Generating..." : "Generate Response"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}