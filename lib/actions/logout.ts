"use server"; 
import { signOutUser } from '@/lib/actions/user.actions';

export const logoutAction = async () => {
  await signOutUser();
};