"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/navbar';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { Sparkles, RotateCw } from 'lucide-react';

// Define proper types for the user and error
type User = {
  accountId: string;
  fullName: string;
  // Add other user properties as needed
};

// Error type interface
interface ApiError {
  message: string;
  [key: string]: unknown;
}

export default  function ResponsePractice() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  //  const currentUser = await getCurrentUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/sign-in');
        } else {
          setCurrentUser({
            accountId: user.accountId,
            fullName: user.fullName || 'User' // Provide default value
          })
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

    } catch (err: unknown) {
      console.error("Error:", err);
      
      const apiError = err as ApiError;
      setError(apiError.message || 'An unknown error occurred');
      
      if (apiError.message?.includes('Unauthorized')) {
        router.push('/sign-in');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            Practice makes perfect. Try different discriminatory scenarios to build your confidence.
          </p>
        </div>
       
      
      <div className="container mx-auto py-24 px-4 relative z-10">
       
        <Card className="max-w-3xl mx-auto bg-[#0C1E4D]/80 border border-blue-500/30 backdrop-blur-sm shadow-xl text-blue-100">
          <CardHeader className="border-b border-blue-500/20 bg-[#0C1E4D]/90">
            <div className="flex items-center gap-2">
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles size={20} className="text-blue-300" />
                Response Practice
              </CardTitle>
            </div>
            <CardDescription className="text-blue-300/80">
              Practice responding to discriminatory comments with AI guidance
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 pb-4 space-y-6">
              <div className="space-y-3">
                <label htmlFor="prompt" className="block text-sm font-medium text-blue-300">
                  Enter a comment you would like to practice responding to:
                </label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., 'Women shouldn't be in leadership roles...'"
                  className="min-h-[120px] bg-[#081635]/80 border-blue-500/30 text-blue-100 placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/20"
                  required
                />
              </div>

              {aiResponse && (
                <div className="space-y-3">
                  <label htmlFor="response" className="block text-sm font-medium text-blue-300">
                    Suggested Response
                  </label>
                  <div className="relative">
                    <Textarea
                      id="response"
                      value={aiResponse}
                      readOnly
                      className="min-h-[180px] bg-[#081635]/60 border-blue-500/30 text-blue-100"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-blue-300/50">
                      AI-generated suggestion
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-400 text-sm py-2 px-3 bg-red-900/30 rounded-md">
                  {error}
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t border-blue-500/20 bg-[#0C1E4D]/90">
              <Button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none"
              >
                {isLoading ? (
                  <>
                    <RotateCw size={18} className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="mr-2" />
                    Generate Response
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

       
      </div>
    </div>
  );
}