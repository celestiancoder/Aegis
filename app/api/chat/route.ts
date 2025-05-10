import { NextResponse } from 'next/server';
import { getAppwriteClient } from '@/lib/appwrite-session';
import { ID } from 'node-appwrite';

export async function POST(req: Request) {
  try {
    const { databases, userId } = await getAppwriteClient();
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const result = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      'chats',
      ID.unique(),
      {
        message,
        userId,
        timestamp: new Date().toISOString()
      }
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}