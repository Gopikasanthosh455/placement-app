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
  skills: string[];
  dueDate: string;
}

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white hover:bg-gray-200 rounded-lg shadow-md p-6 w-full max-w-sm mx-auto">
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
        <Link href={`/jobs/${job.uid}`} key={index}>
          <div>
            <JobCard job={job} />
          </div>
        </Link>
      ))}
    </div>
  );
};

interface NotificationJobsPageProps {
    uid: string;
  }

  const NotificationJobsPage: React.FC<NotificationJobsPageProps> = ({ uid }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
      const fetchJobsData = async () => {
          try {
              setLoading(true);
              const skillsQuery = query(collection(database, `students/${uid}/skills`));
              const skillsSnapshot = await getDocs(skillsQuery);
              const skillsData: string[] = skillsSnapshot.docs.map(doc => doc.data().skill as string);
  
              const jobsCollectionRef = collection(database, 'jobs');
              const querySnapshot = await getDocs(jobsCollectionRef);
              const jobsData = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Job));
              
              // Filter jobs locally based on skills
              const filteredJobs = jobsData.filter(job =>
                skillsData.some(query =>
                    job.skills.some(skill =>
                        skill.toLowerCase().includes(query.toLowerCase())
                    )
                )
              );

              setJobs(filteredJobs);
              setLoading(false);
          } catch (error) {
              console.error('Error fetching jobs data:', error);
              setLoading(false); // Set loading to false in case of error
          }
      };
  
      fetchJobsData();
  }, [uid]);

  return (
    <div className="container mx-auto p-8 bg-gray-800 min-h-screen flex flex-col">
      {loading && <LoadingSpinner />}
      <div className="flex-grow">
        <JobsList jobs={jobs} />
      </div>
    </div>
  );
};

export default NotificationJobsPage;
