'use client'
import { doc, getDoc, query, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, database } from '@/config.firebase.js';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from './Loading';
import { useAuthState } from 'react-firebase-hooks/auth';

interface ProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  institution: string;
  role: string;
}

interface StudentProfileData {
  projects: Project[];
  internships: Internship[];
  education: Education[];
  skills: Skills[];
}

interface Skills{
  id: string;
  skill: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  url?: string
  start_date: string
  end_date: string
}

interface Internship {
  id: string;
  company: string;
  position: string;
  url?: string;
  start_date: string;
  end_date: string;
}

interface Education {
  id: string;
  college: string;
  degree: string;
  department: string;
  current_semester: string;
  current_year: string;
  start_date: string;
  end_date: string;
}

const fetchStudentProfileData = async (uid: string) => {
  try {
    // Fetch projects data
    const projectsQuery = query(collection(database, `students/${uid}/projects`));
    const projectsSnapshot = await getDocs(projectsQuery);
    const projects: Project[] = projectsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }) as Project);

    // Fetch internships data
    const internshipsQuery = query(collection(database, `students/${uid}/internships`));
    const internshipsSnapshot = await getDocs(internshipsQuery);
    const internships: Internship[] = internshipsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }) as Internship);

    // Fetch education data
    const educationQuery = query(collection(database, `students/${uid}/education`));
    const educationSnapshot = await getDocs(educationQuery);
    const education: Education[] = educationSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }) as Education);

    // Fetch skills data
    const skillsQuery = query(collection(database, `students/${uid}/skills`));
    const skillsSnapshot = await getDocs(skillsQuery);
    const skills: Skills[] = skillsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }) as Skills);

    // Combine all fetched data
    const studentProfileData: StudentProfileData = {
      projects,
      internships,
      education,
      skills,
    };

    return studentProfileData;
  } catch (error) {
    console.error('Error fetching student profile data:', error);
    return null;
  }
};


const UserProfile: React.FC<{ uid: string}> = ({ uid }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user] = useAuthState(auth)
  const [studentProfileData, setStudentProfileData] = useState<StudentProfileData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    institution: '',
    role: '',
  });

  const handleDeleteSkills = async (skillId: string, uid: string) => {
    try {
      setLoading(true)
      const skillDocRef = doc(database, `students/${uid}/skills`, skillId);
      await deleteDoc(skillDocRef);
      const data = await fetchStudentProfileData(uid);
    setStudentProfileData(data);
      setLoading(false)
  
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };
  
  const handleDeleteProjects = async (projectId: string, uid: string) => {
    try {
      setLoading(true)
      const skillDocRef = doc(database, `students/${uid}/projects`, projectId);
      await deleteDoc(skillDocRef);
      const data = await fetchStudentProfileData(uid);
    setStudentProfileData(data);
      setLoading(false)
  
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };
  
  const handleDeleteEducation = async (educationId: string, uid: string) => {
    try {
      setLoading(true)
      const skillDocRef = doc(database, `students/${uid}/education`, educationId);
      await deleteDoc(skillDocRef);
      const data = await fetchStudentProfileData(uid);
    setStudentProfileData(data);
      setLoading(false)
  
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };
  
  const handleDeleteInternships = async (internshipId: string, uid: string) => {
    try {
      setLoading(true)
      const skillDocRef = doc(database, `students/${uid}/internships`, internshipId);
      await deleteDoc(skillDocRef);
      const data = await fetchStudentProfileData(uid);
      setStudentProfileData(data);
      setLoading(false)
  
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        const profileDocRef = doc(database, 'users', uid);
        const profileDocSnapshot = await getDoc(profileDocRef);
        if (profileDocSnapshot.exists()) {
          const profileData = profileDocSnapshot.data() as ProfileData;
          setProfileData(profileData);
          
          if(profileData.role === "student"){
            const data = await fetchStudentProfileData(uid);
            setStudentProfileData(data);
          }
          setLoading(false);
        }
         else {
          console.error('User document not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
  
    };

    fetchProfileData();
    
  }, []);

  const renderProjects = () => {
    if (!studentProfileData) return null;
    return studentProfileData.projects.map((project, index) => (
            <div key={index} className="bg-white shadow-md p-6 mb-4 rounded-md">
            <h3 className="text-xl text-black font-semibold mb-2">{project.name}</h3>
            <p className="text-gray-700 mb-2">{project.description}</p>
            {project.url && (
            <Link href={project.url}>
                <p className="text-blue-500 hover:text-blue-700 mb-2">Link: {project.url}</p>
            </Link>
            )}
            <div className="flex justify-between">
            <p className="text-gray-600">Start Date: {project.start_date}</p>
            <p className="text-gray-600">End Date: {project.end_date}</p>
            </div>
            {user && user.uid === uid && (
              <button
                className="absolute bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                onClick={() => handleDeleteProjects(project.id, user.uid)}
              >
                Delete
              </button>
            )}
        </div>
    ));
  };

  const renderInternships = () => {
    if (!studentProfileData) return null;
    return studentProfileData.internships.map((internship, index) => (
      <div key={index} className="bg-white shadow-md p-6 mb-4 rounded-md">
        <h3 className="text-xl text-black font-semibold mb-2">{internship.company}</h3>
        <p className="text-gray-700 mb-2">{internship.position}</p>
        {internship.url && (
          <Link href={internship.url}>
            <p className="text-blue-500 hover:text-blue-700 mb-2">Link: {internship.url}</p>
          </Link>
        )}
        <div className="flex justify-between">
          <p className="text-gray-600">Start Date: {internship.start_date}</p>
          <p className="text-gray-600">End Date: {internship.end_date}</p>
        </div>
        {user && user.uid === uid && (
              <button
                className="absolute bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                onClick={() => handleDeleteInternships(internship.id, user.uid)}
              >
                Delete
              </button>
            )}
      </div>
    ));
  };

  const renderSkills = () => {
    if (!studentProfileData) return null;
    const uniqueSkills = new Set(studentProfileData.skills);
    const uniqueSkillsArray = Array.from(uniqueSkills);
    return uniqueSkillsArray.map((skill, index) => (
      <div key={index}>
        <div className="bg-white text-black shadow-md px-6 py-2 my-2 mx-2 rounded-md">
          {skill.skill}
        </div>
        {user && user.uid === uid && (
          <button
            className="absolute bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
            onClick={() => handleDeleteSkills(skill.id, user.uid)}
          >
            Delete
          </button>
        )}
      </div>
    ));
  };
  

  const renderEducation = () => {
    if (!studentProfileData) return null;
    return studentProfileData.education.map((education, index) => (
      <div key={index} className="bg-white text-black shadow-md p-6 mb-4 rounded-md">
        <h3 className="font-semibold">{education.college}</h3>
        <p>Degree: {education.degree}</p>
        <p>Dept: {education.department}</p>
        <p>Current - Semester: {education.current_semester}, Year: {education.current_year}</p>
        <div className="flex justify-between">
          <p className="text-gray-600">Start Date: {education.start_date}</p>
          <p className="text-gray-600">End Date: {education.end_date}</p>
        </div>
        {user && user.uid === uid && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                onClick={() => handleDeleteEducation(education.id, user.uid)}
              >
                Delete
              </button>
            )}
      </div>
    ));
  };

  return (
    <main className="bg-gray-900 min-h-screen">
      {loading && <LoadingSpinner />}
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <div className="bg-gray-700 shadow-lg rounded-lg overflow-hidden min-h-screen">
        <div className="px-6 py-4">
          <div className="flex items-center justify-center">
            {/* Profile photo */}
            <img
              className="h-20 w-20 rounded-full object-cover"
              src="https://via.placeholder.com/150"
              alt="Profile"
            />
          </div>
          {/* Profile data */}
          <div className="mt-4">
            <div className="flex justify-between">
              <p className="text-2xl font-semibold">{`${profileData.firstName} ${profileData.lastName}`}</p>
              <p className="text-sm text-gray-200">{profileData.role.toLocaleUpperCase()}</p>
            </div>
            <p className="text-gray-400">{profileData.email}</p>
            <p className="text-gray-400">{profileData.phoneNumber}</p>
            <p className="text-gray-400">{profileData.institution}</p>
          </div>

          {studentProfileData && (

          <div>
            
          {/* Render projects */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Projects</h2>
            {renderProjects()}
          </div>

          {/* Render internships */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Internships</h2>
            {renderInternships()}
          </div>

          {/* Render skills */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Skills</h2>
            <div className="flex flex-wrap">{renderSkills()}</div>
          </div>

          {/* Render education */}
          <div className="mt-6 mb-10">
            <h2 className="text-lg font-semibold mb-2">Education</h2>
            {renderEducation()}
          </div>
          </div>
          )}
        </div>
      </div>
    </div>
    </main>
  );
};

export default UserProfile;
