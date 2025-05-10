export const appwriteConfig={
    endpointUrl:process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId:process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
    databaseId:process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
    usersCollectionId:process.env.NEXT_PUBLIC_USERS_COLLECTION!,
    secretKey:process.env.NEXT_APPWRITE_KEY!,
    chatCollectionId:process.env.NEXT_PUBLIC_CHAT_COLLECTION!,
    geminikey:process.env.GEMINI_API_KEY!,
}