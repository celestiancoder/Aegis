"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { createSessionClient } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOutUser } from '@/lib/actions/user.actions';
import { Button } from '../ui/button';
import Logoutform from '../logoutform';

const Navbar = ({fullName}:{fullName:string}) => {
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
       
        const client = await getCurrentUser();
        
        
        setIsLoggedIn(true);
      } catch (error) {
        
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
            
            <Link href="/" className="flex items-center space-x-2 text-amber-600">
              <span className="text-2xl font-bold">
                Eqihelper
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              
              
              
              {isLoggedIn ? (
                <>
                <Link href="/practice" className="text-black/90 hover:text-gray-100 transition-colors">
                Practice
              </Link>
              <Link href="/chat" className="text-black/90 hover:text-gray-100 transition-colors">
                Chat
              </Link>
                 <Logoutform />
                 
                 <div>
                    <p className='text-gray-700'>|{fullName}</p>
                  </div>
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
            <div className="space-y-6 flex-1 ">
             
                {isLoggedIn ? (
                <>
                <div className='flex flex-col m'>
                <Link href="/practice" className="text-white hover:text-gray-100 transition-colors">
                Practice
              </Link>
              <Link href="/chat" className="text-white hover:text-gray-100 transition-colors mt-5">
                Chat
              </Link>
              </div>
                 <Logoutform />
                 
                 <div>
                    <p className='text-gray-700'>|{fullName}</p>
                  </div>
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
          </div>
        </div>
      )}
      
      
      
      </>
  )}

  export default Navbar;