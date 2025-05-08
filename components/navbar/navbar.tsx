"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { createSessionClient } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOutUser } from '@/lib/actions/user.actions';
import { Button } from '../ui/button';
import Logoutform from '../logoutform';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // Try to create session client - will throw error if no session exists
        const client = await getCurrentUser();
        
        // If we get here, we have a valid session
        setIsLoggedIn(true);
      } catch (error) {
        // No valid session exists
        setIsLoggedIn(false);
      }
    };

    checkUserSession();
  }, []);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/70 backdrop-blur-xl shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 py-3">
            
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold ">
                Eqihelper
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-black/90 hover:text-gray-100 transition-colors">
                About us
              </Link>
              <Link href="/" className="text-black/90 hover:text-gray-100 transition-colors">
                Pricing
              </Link>
              
              {isLoggedIn ? (
                <>
                 <Logoutform />
                </>
              ) : (
                <>
                  <Link href="/sign-up" className="text-black/90 hover:text-gray-100 transition-colors">
                    Sign-up
                  </Link>
                  <Link href="/sign-in" className="text-black/90 hover:text-gray-100 transition-colors">
                    Log-in
                  </Link>
                </>
              )}
              
              
            </div>
            
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        
         </div>
        </div>
        </nav>
        {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-lg flex flex-col">
          <div className="flex-1 px-4 pt-20 pb-6 flex flex-col">
            <div className="space-y-6 flex-1">
            <Link 
                href="/" 
                className="block text-xl text-white/90 hover:text-white transition-colors py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About us
              </Link>
              <Link 
                href="/" 
                className="block text-xl text-white/90 hover:text-white transition-colors py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/sign-up" 
                className="block text-xl text-white/90 hover:text-white transition-colors py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign-up
              </Link>
              <Link 
                href="/sign-in" 
                className="block text-xl text-white/90 hover:text-white transition-colors py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log-in
              </Link>
              
            </div>           
          </div>
        </div>
      )}
      
      
      
      </>
  )}

  export default Navbar;