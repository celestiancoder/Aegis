export const appwriteConfig={
    endpointUrl:process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId:process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
    databaseId:process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
    usersCollectionId:process.env.NEXT_PUBLIC_USERS_COLLECTION!,
    secretKey:process.env.NEXT_APPWRITE_KEY!,
    hfkey:process.env.HF_API_KEY!,
    responseCollectionId:process.env.NEXT_PUBLIC_RESPONSES_COLLECTION!,
}