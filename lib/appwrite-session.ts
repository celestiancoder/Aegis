import { Client, Account, Databases } from 'node-appwrite';
import { cookies } from 'next/headers';
import { appwriteConfig } from './appwrite/config';


export const getAppwriteSession = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('appwrite-session');
  return sessionCookie?.value;
};

export const getAppwriteClient = async () => {
  const session = await getAppwriteSession();

  if (!session) {
    throw new Error('No active session');
  }

  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setSession(session);

  const account = new Account(client);
  const user = await account.get();

  return {
    account,
    databases: new Databases(client),
    userId: user.$id
  };
};