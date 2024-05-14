'use client'

import { useState, FormEvent } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import Link from 'next/link'; 
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/config.firebase.js';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function Login() {

  const [user] = useAuthState(auth);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)
  const router = useRouter()

  if(user){
    router.push('/dashboard')
    return;
  }

  const isValidEmail = (email: string) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      alert("Enter a valid email!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be atleast 6 characters or more!\nUse lowercase & uppercase letters, numbers, special characters($ & @ #) to make your password strong!");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(email, password);
      router.push('/dashboard')
    } catch (e: any) {
      console.error(e)
    }
  };

    return (
      <main>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded shadow-md w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Work Email<span className="text-red-600"> *</span></label>
              <input
                type="email"
                id="email"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800" // Set text color to gray
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">Password<span className="text-red-600"> *</span></label>
              <input
                type="password"
                id="password"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800" // Set text color to gray
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
              >
                Login
              </button>
            </form>
            <div className="text-sm text-gray-700 mt-4">
              New user?{' '}
              <Link href="/registration">
                <h3 className="text-blue-500">Register here</h3>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }