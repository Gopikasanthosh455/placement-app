'use client'
import { collectionGroup, getDocs } from 'firebase/firestore';
import { auth, database } from '@/config.firebase.js';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '../Loading';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

interface Project {
    id: string;
    studentId?: string;
    name: string;
    description: string;
    url?: string
    start_date: string
    end_date: string
  }

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white hover:bg-gray-200 rounded-lg shadow-md p-6 w-full max-w-sm mx-auto">
      <h3 className="text-lg text-black font-semibold mb-2">{project.name}</h3>
      <hr className='border border-gray-800'/>
      <p className="text-gray-700 mb-4 mt-4">Description: <span className='font-bold text-lg'>{project.description}</span></p>
      <p className="text-gray-700 mb-4">Project URL: {project.url}</p>
      <p className="text-gray-700 mb-4">Start Date: {project.start_date}</p>
      <p className="text-gray-700 mb-4">End Date: {project.end_date}</p>
      <p className="text-sm italic text-gray-400 mb-4">Click here to view Student Profile</p>
    </div>
  );
};

interface ProjectListProps {
  projects: Project[];
}

const ProjectsList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-6">
      {projects.map((project, index) => (
        <Link href={`/student/${project.studentId}`} key={index}>
          <div>
            <ProjectCard project={project} />
          </div>
        </Link>
      ))}
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  const [project, setProject] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        setLoading(true);
        const projectsCollectionRef = collectionGroup(database, 'projects');
        const querySnapshot = await getDocs(projectsCollectionRef);

        const projectsData = querySnapshot.docs
          .map(doc => {
            // Get the parent document reference (student) of the project
            const studentRef = doc.ref.parent.parent;
            if (studentRef) {
              // Extract the student ID from the parent document reference
              return { id: doc.id, studentId: studentRef.id, ...doc.data() };
            }
            return null; // Return null if parent document reference is null
          })
          .filter(projectData => projectData !== null)
          .map(projectData => projectData as Project);
        
        setProject(projectsData);
        console.log(projectsData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Projects data:', error);
      }
    };

    if (user){
      fetchJobsData();
    } else {
      router.push('/login')
    }
  }, [user]);

  const handleSearch = async (searchQuery: string = '') => {
    try {
      setLoading(true);
      const jobsCollectionRef = collectionGroup(database, 'projects');
      const querySnapshot = await getDocs(jobsCollectionRef);
      const searchData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  
      // Filter jobs locally based on search query
      const filteredProjects = searchData.filter(project => {
        return project.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
  
      setProject(filteredProjects);
      setLoading(false);
    } catch (error) {
      console.error('Error searching for Projects:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-800 min-h-screen flex flex-col">
      {loading && <LoadingSpinner />}
      <div className="mb-10 mx-10">
        <label className='text-gray-200 mx-1'>Search by title:</label>
        <input
          type="text"
          placeholder="Search by project name"
          onChange={(e) => handleSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800 w-full"
        />
      </div>
      <div className="flex-grow">
        <ProjectsList projects={project} />
      </div>
    </div>
  );
};

export default ProjectsPage;
