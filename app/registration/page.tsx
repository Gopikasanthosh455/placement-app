'use client'
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth, database } from '@/config.firebase.js'
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import LoadingSpinner from '@/components/Loading';

export default function Registration() {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [institution, setInstitution] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth)

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

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(email, password);

      if(!userCredential){
        router.push('/login')
        return;
      }

      await setDoc(doc(database, 'users', userCredential.user.uid), {
        firstName,
        lastName,
        phoneNumber,
        email,
        institution,
        role,
      });
      setLoading(false)
      router.push('/login')
    } catch (e: any) {
      console.error(e)
    }
  };

  return (
    <main>
      {loading && <LoadingSpinner />}
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full md:max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Registration</h2>
          <form onSubmit={handleSubmit} className="flex flex-wrap">
            <div className="mb-4 w-full md:w-1/2 pr-2">
              <label htmlFor="firstName" className="block text-gray-700">First Name<span className="text-red-600"> *</span></label>
              <input
                type="text"
                id="firstName"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
                placeholder="Eg. John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-full md:w-1/2 pl-2">
              <label htmlFor="lastName" className="block text-gray-700">Last Name<span className="text-red-600"> *</span></label>
              <input
                type="text"
                id="lastName"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
                placeholder="Eg. Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-full md:w-1/2 pr-2">
              <label htmlFor="email" className="block text-gray-700">Work Email<span className="text-red-600"> *</span></label>
              <input
                type="email"
                id="email"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
                placeholder="Eg. john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-full md:w-1/2 pl-2">
              <label htmlFor="phoneNumber" className="block text-gray-700">Phone Number<span className="text-red-600"> *</span></label>
              <input
                type="tel"
                id="phoneNumber"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
                placeholder="Eg. +91-999-999-9999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-full md:w-1/2 pr-2">
              <label htmlFor="institution" className="block text-gray-700">Institution/Organisation<span className="text-red-600"> *</span></label>
              <input
                type="text"
                id="institution"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
                placeholder="Eg. GEC Palakkad"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-full md:w-1/2 pl-2">
              <label htmlFor="role" className="block text-gray-700">Role<span className="text-red-600"> *</span></label>
              <select
                id="role"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="" disabled>Select your role</option>
                <option value="recruiter">Recruiter</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div className="mb-4 w-full md:w-1/2 pr-2">
              <label htmlFor="password" className="block text-gray-700">Password<span className="text-red-600"> *</span></label>
              <input
                type="password"
                id="password"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-full md:w-1/2 pl-2">
              <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password<span className="text-red-600"> *</span></label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
            >
              Register
            </button>
          </form>
          <div className="text-sm text-gray-700 mt-4">
            Already registered?{' '}
            <Link href="/login">
              <h3 className="text-blue-500">Login here</h3>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
