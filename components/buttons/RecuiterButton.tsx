'use client'
import { useState, useEffect } from "react";
import { doc, getDoc, deleteDoc, DocumentData } from 'firebase/firestore';
import { auth, database } from '@/config.firebase.js';
import Link from "next/link";
import { useRouter } from "next/navigation";
import fetchSelectedStudentProfilesAsExcel from "@/utils/download";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingSpinner from "../Loading";


interface ApplyButtonProps {
  jobId: string;
}

interface StudentProfileLinkProps {
  studentID: string;
  index: string
}

const StudentProfileLink: React.FC<StudentProfileLinkProps> = ({ studentID, index }) => {
  return (
    <div className="text-black bg-gray-200 p-2 rounded-md hover:bg-gray-400">
      <Link href={`/student/${studentID}`}>
        <p>Student {index}</p>
      </Link>
    </div>
  );
};

const RecuiterButton: React.FC<ApplyButtonProps> = ({ jobId }) => {
  const [appliedStudents, setAppliedStudents] = useState<string[]>([]);
  const [jobs, setJobs] = useState<DocumentData>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, loading] = useAuthState(auth)
  const router = useRouter();

  const handleJobDelete = async () => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this job?');
      if (!confirmed) return;
  
      setIsDeleting(true);
      const jobDocRef = doc(database, 'jobs', jobId);

      const jobDocSnapshot = await getDoc(jobDocRef);
      if (!jobDocSnapshot.exists()) {
        throw new Error('Job not found.');
      }

      await deleteDoc(jobDocRef);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting job:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const checkIfApplied = async () => {
      try {
        const jobDocRef = doc(database, 'jobs', jobId);
        const jobDocSnapshot = await getDoc(jobDocRef);
        if (jobDocSnapshot.exists()) {
          const jobData = jobDocSnapshot.data();
          setJobs(jobData)
          if (jobData.applied) {
            const shuffledStudents = jobData.applied.sort(() => Math.random() - 0.5);
            const selectedStudents = shuffledStudents.slice(0, 5);
            setAppliedStudents(selectedStudents);
          }
        }
      } catch (error) {
        console.error('Error checking if applied:', error);
      }
    };

    checkIfApplied();
  }, [jobId, user]);

  if (!user || !jobs) return null;
  if (loading) return <LoadingSpinner />;

  const isRecruiter = user.uid === jobs.recruiter;

  if (!isRecruiter) return <></>;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center">
        Recommended Candidates:
        <div className="flex flex-col">
        {appliedStudents.map((studentID, index) => (
          <StudentProfileLink key={index} studentID={studentID} index={(index + 1).toString()} />
        ))}
        </div>
      </div>
      <button
      onClick={() => {
        fetchSelectedStudentProfilesAsExcel(appliedStudents)
      }}
        className={'bg-blue-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600 focus:outline-none'}
      >
        Download All as Excel
      </button>
      <button
      onClick={handleJobDelete}
      disabled={isDeleting}
      className={`bg-red-500 text-white py-2 px-4 mt-4 rounded hover:bg-red-600 focus:outline-none ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isDeleting ? 'Deleting...' : 'Delete Job'}
    </button>
    </div>
  );
};

export default RecuiterButton;
