'use client'

import { signOut } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth, database } from "@/config.firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";

interface ProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  institution: string;
  role: string;
}

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login')
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchProfileData = async () => {
        try {
          const profileDocRef = doc(database, 'users', user.uid);
          const profileDocSnapshot = await getDoc(profileDocRef);
          if (profileDocSnapshot.exists()) {
            const profileData = profileDocSnapshot.data() as ProfileData;
            setProfileData(profileData);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchProfileData();
    }
  }, [user]);


  return (
    <nav className="flex items-center justify-around bg-gray-800 text-white p-4">
      {/* PlacementApp logo or text */}
      <div>
        <Link href="/">
          <h2 className="text-xl font-bold">PlacementApp</h2>
        </Link>
      </div>

      <div className="flex flex-row">
        <Link href="/dashboard">
          <h2 className="text-lg mx-4">Dashboard</h2>
        </Link>
        <Link href="/jobs">
          <h2 className="text-lg mx-4">Jobs</h2>
        </Link>
        <Link href="/projects">
          <h2 className="text-lg mx-4">Projects</h2>
        </Link>
        <Link href="/profile">
          <h2 className="text-lg mx-4">Profile</h2>
        </Link>
      </div>

      {/* Profile picture circle with dropdown */}
      {profileData && (
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          onMouseEnter={() => setDropdownOpen(true)}
          className="focus:outline-none"
        >
          {/* Placeholder profile picture */}
          <div className="flex flex-row">
            <img
              src="https://placehold.co/600"
              alt="Profile"
              className="w-8 h-8 rounded-full m-2"
            />
            
              <h2 className="mt-3 mx-2">{profileData.firstName}</h2>
          </div>
        </button>
        {dropdownOpen && (
          <div className="absolute top-10 right-0 bg-white shadow-lg rounded-md mt-2">
            <ul className="py-1">
              {/* Profile */}
              <li>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push('/profile');
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 focus:outline-none"
                >
                  Profile
                </button>
              </li>
              {/* Sign out */}
              <li>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 focus:outline-none"
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      )}
    </nav>
  );
}