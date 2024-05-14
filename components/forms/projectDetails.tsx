import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { database } from '@/config.firebase.js';
import LoadingSpinner from '../Loading';

interface Project {
  name: string;
  description: string;
  url?: string;
  start_date: string;
  end_date: string;
}

const ProjectDetails: React.FC<{ uid: string }> = ({ uid }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Project>({
    name: '',
    description: '',
    url: '',
    start_date: '',
    end_date: '',
  });

  const handleAddProject = async () => {
    try {
      setLoading(true)
      await addDoc(collection(database, `students/${uid}/projects`), formData);
      // Reset the form data after submission
      setFormData({
        name: '',
        description: '',
        url: '',
        start_date: '',
        end_date: '',
      });
      setLoading(false)
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {loading && <LoadingSpinner />}
      <h1 className="text-3xl text-black font-semibold mb-8">Student Details</h1>

      <div className="mb-8">
        <h2 className="text-xl text-black font-semibold mb-4">Add Project</h2>
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
        ></textarea>
        <input
          type="text"
          name="url"
          placeholder="Project URL"
          value={formData.url}
          onChange={handleChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
        />
        <input
          type="date"
          name="start_date"
          placeholder="Start Date"
          value={formData.start_date}
          onChange={handleChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
        />
        <input
          type="date"
          name="end_date"
          placeholder="End Date"
          value={formData.end_date}
          onChange={handleChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
        />
        <button
          onClick={handleAddProject}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
        >
          Add Project
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;
