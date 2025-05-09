"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
  };

  const getUserByEmail = async (email: string) => {
    try {
      const { databases } = await createAdminClient();
      
      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])]
      );
  
      return result.total > 0 ? parseStringify(result.documents[0]) : null;
    } catch (error) {
      handleError(error, "Failed to get user by email");
      return null;
    }
  };

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();
  
    try {
      const session = await account.createEmailToken(ID.unique(), email);
  
      return session.userId;
    } catch (error) {
      handleError(error, "Failed to send email OTP");
    }
  };

  export const verifySecret = async ({
    accountId,
    password,
  }: {
    accountId: string;
    password: string;
  }) => {
    try {
      const { account } = await createAdminClient();
  
      const session = await account.createSession(accountId, password);
  
      (await cookies()).set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
  
      return parseStringify({ sessionId: session.$id });
    } catch (error) {
      handleError(error, "Failed to verify OTP");
    }
  };

  export const createAccount = async ({
    fullName,
    email,
  }: {
    fullName: string;
    email: string;
  }) => {
    const existingUser = await getUserByEmail(email);
  
    const accountId = await sendEmailOTP({ email });
    if (!accountId) throw new Error("Failed to send an OTP");
  
    if (!existingUser) {
      const { databases } = await createAdminClient();
  
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
          fullName,
          email,
          avatar: "https://as1.ftcdn.net/v2/jpg/04/43/94/64/1000_F_443946434_tUYMsrgP1EgBJbgMaaPGFZEV3Wi8ZkUj.jpg",
          accountId,
        },
      );
    }
  
    return parseStringify({ accountId });
  };

  export const signOutUser = async () => {
    const { account } = await createSessionClient();
  
    try {
      await account.deleteSession("current");
      (await cookies()).delete("appwrite-session");
    } catch (error) {
      handleError(error, "Failed to sign out user");
    } finally {
      redirect("/sign-in");
    }
  };

export const signInUser = async ({ email }: { email: string }) => {
    try {
      const existingUser = await getUserByEmail(email);
  
      
      if (existingUser) {
        await sendEmailOTP({ email });
        return parseStringify({ accountId: existingUser.accountId });
      }
  
      return parseStringify({ accountId: null, error: "User not found" });
    } catch (error) {
      handleError(error, "Failed to sign in user");
    }
  };

  // export const getCurrentUser = async () => {
  //   const { databases, account } = await createSessionClient();
  
  //   const result = await account.get();
  
  //   const user = await databases.listDocuments(
  //     appwriteConfig.databaseId,
  //     appwriteConfig.usersCollectionId,
  //     [Query.equal("accountId", result.$id)],
  //   );
  
  //   if (user.total <= 0) return null;
  
  //   return parseStringify(user.documents[0]);
  // };

  export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();
    const userResult = await account.get();
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", userResult.$id)],
    );
    if (user.total <= 0) return null;
    return parseStringify(user.documents[0]);
  } catch (error: any) {
    if (error.message === "No session") {
      return null;
    }
    console.error("Error getting current user:", error);
    return null; 
  }
};

  