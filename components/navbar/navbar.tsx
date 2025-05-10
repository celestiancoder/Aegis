"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, MessageSquare, Shield, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { signOutUser } from '@/lib/actions/user.actions';

const Navbar = ({ fullName }: { fullName: string }) => {
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
        setIsLoggedIn(!!client);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkUserSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setIsLoggedIn(false);
      router.push('/sign-in');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B1940]/90 backdrop-blur-xl shadow-lg border-b border-blue-500/20'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AEGIS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {isLoggedIn ? (
                <>
                  <Link 
                    href="/practice" 
                    className="flex items-center text-blue-300 hover:text-white transition-colors"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Practice
                  </Link>
                  <Link 
                    href="/chat" 
                    className="flex items-center text-blue-300 hover:text-white transition-colors"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </Link>
                  <div className="flex items-center space-x-4 ml-4">
                    <span className="text-blue-300 flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {fullName}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center text-blue-300 hover:text-red-400 transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    href="/sign-up" 
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    Sign Up
                  </Link>
                  <Link 
                    href="/sign-in" 
                    className="px-4 py-2 rounded-md border border-blue-400/30 text-blue-300 hover:bg-blue-500/10 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-blue-300 hover:text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#0B1940]/95 backdrop-blur-lg pt-16">
          <div className="px-6 py-4 space-y-6">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/practice" 
                  className="flex items-center px-4 py-3 rounded-lg bg-[#0C1E4D]/50 text-white hover:bg-blue-500/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  Practice
                </Link>
                <Link 
                  href="/chat" 
                  className="flex items-center px-4 py-3 rounded-lg bg-[#0C1E4D]/50 text-white hover:bg-blue-500/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MessageSquare className="mr-3 h-5 w-5" />
                  Chat
                </Link>
                <div className="pt-4 border-t border-blue-500/20">
                  <div className="flex items-center px-4 py-3 text-blue-300">
                    <User className="mr-3 h-5 w-5" />
                    {fullName}
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/sign-up" 
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center hover:from-blue-600 hover:to-purple-700 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link 
                  href="/sign-in" 
                  className="block px-4 py-3 rounded-lg border border-blue-400/30 text-blue-300 text-center hover:bg-blue-500/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;