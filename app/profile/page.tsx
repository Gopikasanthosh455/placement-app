'use client'

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/config.firebase.js";
import { useEffect,useState } from "react";
import UserProfile from "@/components/UserProfile";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/Loading";

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter()

  useEffect(() => {
    // Check if user is fetched and loading is false
    if (!loading && user) {
      // Set a timeout to show the profile after 1000 milliseconds (1 second)
      const timeoutId = setTimeout(() => {
        setShowProfile(true);
      }, 1000);

      // Clear the timeout if the component unmounts or if the user changes
      return () => clearTimeout(timeoutId);
    }
  }, [user, loading]);

  if (loading) {
    // Render a loading indicator while the user is being fetched
    return <LoadingSpinner />;
  }

  if(!user){
    router.push('/login')
    return;
  }

  // Render the UserProfile component only when showProfile is true
  return (
    <main>
      <Navbar />
      {showProfile && <UserProfile uid={user.uid} />}
    </main>
  );
}
