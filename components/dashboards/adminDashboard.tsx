'use client'

import Navbar from "@/components/Navbar"
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { database } from '@/config.firebase.js';
import Settings from "../Settings";

interface UserData {
    data: DocumentData,
    uid: string
  }

export default function AdminDashboard({ data, uid }: UserData) {
    const [totalJobs, setTotalJobs] = useState<number>(0);
    const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalRecruiters, setTotalRecruiters] = useState<number>(0);
  const [totalAdmins, setTotalAdmins] = useState<number>(0);
  const [averageStudentsPerJob, setAverageStudentsPerJob] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total number of jobs
        const jobsCollectionRef = collection(database, 'jobs');
        const jobsSnapshot = await getDocs(jobsCollectionRef);
        const totalJobsCount = jobsSnapshot.size;
        setTotalJobs(totalJobsCount);

        let totalStudents = 0;
        jobsSnapshot.forEach(jobDoc => {
          const jobData = jobDoc.data();
          if (jobData.applied) {
            totalStudents += jobData.applied.length;
          }
        });
        const averageStudents = totalStudents / totalJobsCount;
        setAverageStudentsPerJob(averageStudents);

        // Fetch total number of students
        const studentsQuery = query(collection(database, 'users'), where('role', '==', 'student'));
        const studentsSnapshot = await getDocs(studentsQuery);
        const totalStudentsCount = studentsSnapshot.size;
        setTotalStudents(totalStudentsCount);

        const recruitersQuery = query(collection(database, 'users'), where('role', '==', 'recruiter'));
        const recruitersSnapshot = await getDocs(recruitersQuery);
        const totalRecruitersCount = recruitersSnapshot.size;
        setTotalRecruiters(totalRecruitersCount);

        const adminsQuery = query(collection(database, 'users'), where('role', '==', 'admin'));
        const adminsSnapshot = await getDocs(adminsQuery);
        const totalAdminsCount = adminsSnapshot.size;
        setTotalAdmins(totalAdminsCount);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

    return (
        <main className="bg-gray-400">            
            <Navbar />
            <div className="">
              <h2 className="m-4 pl-8 pt-8 text-2xl text-black">Placement Stats</h2>
              <div className="flex justify-center gap-8 p-10">
                  <div className="bg-gray-200 p-6 rounded-md shadow-md">
                      <h2 className="text-3xl font-bold text-gray-800">Total Jobs</h2>
                      <p className="text-5xl font-bold text-gray-900">{totalJobs}</p>
                  </div>
                  <div className="bg-gray-200 p-6 rounded-md shadow-md">
                      <h2 className="text-3xl font-bold text-gray-800">Total Students</h2>
                      <p className="text-5xl font-bold text-gray-900">{totalStudents}</p>
                  </div>
                  <div className="bg-gray-200 p-6 rounded-md shadow-md">
                      <h2 className="text-3xl font-bold text-gray-800">Total Recruiters</h2>
                      <p className="text-5xl font-bold text-gray-900">{totalRecruiters}</p>
                  </div>
                  <div className="bg-gray-200 p-6 rounded-md shadow-md">
                      <h2 className="text-3xl font-bold text-gray-800">Total Admins</h2>
                      <p className="text-5xl font-bold text-gray-900">{totalAdmins}</p>
                  </div>
                  <div className="bg-gray-200 p-6 rounded-md shadow-md">
                      <h2 className="text-3xl font-bold text-gray-800">Average applications per Job</h2>
                      <p className="text-5xl font-bold text-gray-900">{averageStudentsPerJob}</p>
                  </div>
              </div>
              <div className="">
              </div>
            </div>
            <Settings userId={uid} />
        </main>
    )
}