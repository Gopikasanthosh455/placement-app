'use client'
import { useState, useEffect } from "react";
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { database } from '@/config.firebase.js';

interface ApplyButtonProps {
  jobId: string;
  userId: string;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({ jobId, userId }) => {
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState<boolean>(false);

  useEffect(() => {
    const checkIfApplied = async () => {
      try {
        const jobDocRef = doc(database, 'jobs', jobId);
        const jobDocSnapshot = await getDoc(jobDocRef);
        if (jobDocSnapshot.exists()) {
          const jobData = jobDocSnapshot.data();
          if (jobData.applied && jobData.applied.includes(userId)) {
            setIsAlreadyApplied(true);
          }
        }
      } catch (error) {
        console.error('Error checking if applied:', error);
      }
    };

    checkIfApplied();
  }, [jobId, userId]);

  const handleApply = async () => {
    try {
      setIsApplying(true);
      setError(null);

      if (isAlreadyApplied) {
        // If already applied, do nothing
        return;
      }

      const jobDocRef = doc(database, 'jobs', jobId);
      const jobDocSnapshot = await getDoc(jobDocRef);
      if (!jobDocSnapshot.exists()) {
        throw new Error('Job not found.');
      }

      const jobData = jobDocSnapshot.data();
      const updatedApplied = jobData.applied ? [...jobData.applied, userId] : [userId];
      await updateDoc(jobDocRef, { applied: updatedApplied });

      setSuccess(true);
    } catch (error) {
      setError("Failed to apply. Please try again later.");
      console.error('Error applying to job:', error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <button
      onClick={handleApply}
      className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none ${isApplying ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isApplying || isAlreadyApplied}
    >
      {isAlreadyApplied ? 'Applied' : isApplying ? 'Applying...' : 'Apply'}
    </button>
  );
};

export default ApplyButton;
