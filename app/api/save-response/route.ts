import { appwriteConfig } from '@/lib/appwrite/config';

import { NextResponse } from 'next/server';

import { Client, Databases, ID } from 'node-appwrite';



const client = new Client()

 .setEndpoint(appwriteConfig.endpointUrl)

 .setProject(appwriteConfig.projectId);



const databases = new Databases(client);



export async function POST(req: Request) {

 try {

 const { prompt, response, userId } = await req.json();



 if (!prompt || !response || !userId) {

 return NextResponse.json(

 { error: "Missing required fields" },

{ status: 400 }

 );

}



 const result = await databases.createDocument(

 process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
 process.env.NEXT_PUBLIC_RESPONSES_COLLECTION!,

 ID.unique(),

{ prompt, response, userId }

 );



 return NextResponse.json({ success: true, documentId: result.$id });

 } catch (error) {

 console.error("Save Error:", error);

 return NextResponse.json(

{ error: "Failed to save response" },

 { status: 500 }

 );

}

}