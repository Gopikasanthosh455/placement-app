'use client'
import { useState, useEffect } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { database } from '@/config.firebase.js';

interface ApplyButtonProps {
  jobId: string;
}

const AdminButton: React.FC<ApplyButtonProps> = ({ jobId }) => {
    const [numberOfApplications, setNumberOfApplications] = useState(0)

  useEffect(() => {
    const checkIfApplied = async () => {
      try {
        const jobDocRef = doc(database, 'jobs', jobId);
        const jobDocSnapshot = await getDoc(jobDocRef);
        if (jobDocSnapshot.exists()) {
          const jobData = jobDocSnapshot.data();
          if (jobData.applied && jobData.applied.length >= 1) {
            setNumberOfApplications(jobData.applied.length);
          }
        }
      } catch (error) {
        console.error('Error checking if applied:', error);
      }
    };

    checkIfApplied();
  }, [jobId]);

  

  return (
    <div>
      <button
        className={'bg-blue-500 text-white py-2 px-4 mx-4 rounded hover:bg-blue-600 focus:outline-none'}
      >
        Applications: {numberOfApplications}
      </button>
      <button
        className={'bg-blue-500 text-white py-2 px-4 mx-4 rounded hover:bg-blue-600 focus:outline-none'}
      >
        Download as Excel
      </button>
    </div>
  );
};

export default AdminButton;
