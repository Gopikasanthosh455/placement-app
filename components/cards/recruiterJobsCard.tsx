import { collection, getDocs, query, where } from 'firebase/firestore';
import { database } from '@/config.firebase.js';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '../Loading';

interface Job {
  uid: string;
  title: string;
  companyName: string;
  details: string;
  industry: string;
  ctc: string;
  openings: number;
  skills: string[]
  dueDate: string;
}

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white hover:bg-gray-200 hover:border hover:border-gray-800 rounded-lg shadow-md p-6 w-full max-w-sm mx-auto">
      <h3 className="text-lg text-black font-semibold mb-2">{job.title}</h3>
      <hr className='border border-gray-800'/>
      <p className="text-gray-700 mb-4 mt-4">Company: <span className='font-bold text-lg'>{job.companyName}</span></p>
      <p className="text-gray-700 mb-4">{job.details}</p>
      <p className="text-gray-700 mb-4">Industry: {job.industry}</p>
      <p className="text-gray-700 mb-4">Expected CTC: {job.ctc}</p>
      <p className="text-gray-700 mb-4">Vacancies: {job.openings}</p>
      <p className="text-gray-700 mb-4">Skills Required: {job.skills.join(', ')}</p>
      <hr className='border border-gray-800'/>
      <p className="text-gray-700 mb-4 mt-4">Last Date for Application Submission:<br/>{job.dueDate}</p>
    </div>
  );
};

interface JobsListProps {
  jobs: Job[];
}

const JobsList: React.FC<JobsListProps> = ({ jobs }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <Link href={`/jobs/${job.uid}`} key={index}> {/* Link to individual job */}
          <div>
            <JobCard job={job} />
          </div>
        </Link>
      ))}
    </div>
  );
};

interface JobsPageProps {
  recruiterID: string;
}

const RecuiterJobsPage: React.FC<JobsPageProps> = ({ recruiterID }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchJobsData = async () => {
      setLoading(true); // Set loading to true when fetching data
      try {
        const jobsCollectionRef = collection(database, 'jobs');
        const jobsQuery = query(jobsCollectionRef, where('recruiter', '==', recruiterID));
        const jobsSnapshot = await getDocs(jobsQuery);
        const jobsData: Job[] = jobsSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Job));
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs by recruiter:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchJobsData();
  }, [recruiterID]);

  return (
    <div className="container mx-auto p-8 bg-gray-200 min-h-screen">
      {loading && <LoadingSpinner />}
      <JobsList jobs={jobs} />
    </div>
  );
};

export default RecuiterJobsPage;
