"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
                Aegis
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-black/90 hover:text-blue-300 transition-colors">
                About us
              </Link>
              <Link href="/" className="text-black/90 hover:text-blue-300 transition-colors">
                sign-up
              </Link>
              <Link href="/" className="text-black/90 hover:text-blue-300 transition-colors">
                Log-in
              </Link>
            </div>
            

        
         </div>
        </div>
      </nav>
      <div className='pt-16'>
        YOUR BEST AGENT
      </div>
      
      </>
  )}

  export default Navbar;