'use client'
import Navbar from "@/components/Navbar"
import { useState, useEffect } from "react";
import { DocumentData, doc, getDoc } from 'firebase/firestore';
import { auth, database } from '@/config.firebase.js';
import { JobCard } from "@/components/cards/jobsCards";
import { useAuthState } from "react-firebase-hooks/auth";
import ApplyButton from "@/components/buttons/ApplyButton";
import RecuiterButton from "@/components/buttons/RecuiterButton";
import AdminButton from "@/components/buttons/AdminButton";
import Link from "next/link";

interface Job {
  uid: string;
  title: string;
  companyName: string;
  details: string;
  industry: string;
  ctc: string;
  openings: number;
  skills: string[];
  dueDate: string;
}

export default function Job({ params }: {
        params: {
            uid: string
        }
    }) {

    const [job, setJob] = useState<Job>();
    const [role, setRole] = useState<string>('');
    const [userID, setUserID] = useState<string>('');
    const [user, loading, error] = useAuthState(auth)

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const jobDocRef = doc(database, 'jobs', params.uid);
                const jobDocSnapshot = await getDoc(jobDocRef);
                if (jobDocSnapshot.exists()) {
                    const jobData = jobDocSnapshot.data() as Job;
                    setJob(jobData);
                } else {
                    console.error('No such document exists');
                }
            } catch (error) {
                console.error('Error fetching job data:', error);
            }
        };

        
        const fetchUserData = async () => {
            try {
                if(user){
                    setUserID(user.uid)
                    const jobDocRef = doc(database, 'users', user.uid);
                    const jobDocSnapshot = await getDoc(jobDocRef);
                    if (jobDocSnapshot.exists()) {
                        const jobData = jobDocSnapshot.data() as DocumentData;
                        setRole(jobData.role);
                    } else {
                        console.error('No such document exists');
                    }
                }
            } catch (error) {
                console.error('Error fetching User data:', error);
            }
        };

        fetchJobData();
        fetchUserData();
    }, [params.uid, user]);

    if (!job) {
        return null; 
    }

    return (
        <main>
            <Navbar />
            <div className="min-h-screen bg-gray-900 p-10 flex flex-col justify-center items-center">
                <JobCard job={job} />
                    <div className="p-4">
                        {role === 'recruiter' ? (
                            <RecuiterButton jobId={params.uid} />
                            ) : role === 'admin' ? (
                            <AdminButton jobId={params.uid} />
                            ) : role === 'student' ? (
                            <ApplyButton jobId={params.uid} userId={userID} />
                        ) : <div><Link href={'/login'} className="text-blue-600">Login</Link> to Apply</div>}
                    </div>
            </div>
        </main>
    );
}
