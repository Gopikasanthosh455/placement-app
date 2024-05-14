'use client'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, database } from "@/config.firebase.js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { DocumentData, doc, getDoc } from 'firebase/firestore';
import StudentDashboard from '@/components/dashboards/studentDashboard';
import RecruiterDashboard from '@/components/dashboards/recruiterDashboard';
import AdminDashboard from '@/components/dashboards/adminDashboard';
import LoadingSpinner from "@/components/Loading";

interface UserData {
  data: DocumentData,
  uid: string
}

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [userDatas, setUserDatas] = useState<UserData>();
  const router = useRouter();
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    // Ensure user is loaded and not in loading state
    if (user && !loading) {
      // Fetch user's role and data from Firestore
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(database, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            if (userData && userData.role) {
              // Set the user's role in state
              setRole(userData.role);
              // Set the user's data in state
              const userDatas: UserData = {
                data: userData,
                uid: user.uid,
              };
              setUserDatas(userDatas);
            } else {
              console.error("User role not found in Firestore");
            }
          } else {
            console.error("User document not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchUserData();
    }
  }, [user, loading]);

  useEffect(() => {
    // If there's an error fetching user, or user is null and not in loading state
    if (error || (!user && !loading)) {
      router.push('/login'); 
    }
  }, [user, loading, error, router]);

  if(loading){
    return <LoadingSpinner />
  }

  if(!userDatas){
    return;
  }

  const renderDashboard = () => {
    switch (role) {
      case 'student':
        return <StudentDashboard data={userDatas.data} uid={userDatas.uid} />;
      case 'recruiter':
        return <RecruiterDashboard data={userDatas.data} uid={userDatas.uid}/>;
      case 'admin':
        return <AdminDashboard data={userDatas.data} uid={userDatas.uid}/>;
      default:
        return <LoadingSpinner />;
    }
  };

  return (
    <main>
      {/* Render the appropriate dashboard based on role */}
      {renderDashboard()}
    </main>
  );
}
