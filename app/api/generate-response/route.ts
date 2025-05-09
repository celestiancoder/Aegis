import { NextResponse } from 'next/server';
import { getAppwriteClient } from '@/lib/appwrite-session';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function POST(req: Request) {
  try {
    const { userId } = await getAppwriteClient();
    
    if (!userId) {
      return NextResponse.json({ error: 'Please login first' }, { status: 401 });
    }
    
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    const enhancedPrompt = `
You are AEGIS (Anti-discrimination Education and Guidance Interactive System), an AI assistant specialized in helping people respond to discriminatory comments or situations.

The following is a discriminatory comment or situation someone has encountered:
"${prompt}"

Please provide:
1. A thoughtful analysis of why this comment/situation might be considered discriminatory
2. Constructive and respectful ways to respond to this situation
3. Educational information about the impact of such comments
4. Supportive guidance for the person who experienced this

Keep your response empathetic, educational, and focused on promoting understanding.`;

    const result = await model.generateContent(enhancedPrompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error('Failed to generate response from Gemini');
    }
    
    return NextResponse.json({ response: responseText });
    
  } catch (error: any) {
    console.error('API Error:', error);
    
    let errorMessage = 'Failed to generate response from AI';
    if (error.message.includes('session') || error.code === 401) {
      errorMessage = 'Please login first';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: error.message.includes('session') || error.code === 401 ? 401 : 500 }
    );
  }
}