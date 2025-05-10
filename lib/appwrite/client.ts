// lib/appwrite/client.ts
import { Client } from 'appwrite';
import { appwriteConfig } from './config';

export const getAppwriteClient = () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);
  
  
  return client;
};