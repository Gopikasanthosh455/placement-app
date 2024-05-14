import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { database } from '@/config.firebase.js';
import LoadingSpinner from '../Loading';

interface Education {
  college: string;
  degree: string;
  department: string;
  current_semester: string;
  current_year: string;
  start_date: string;
  end_date: string;
}

const EducationDetails: React.FC<{ uid: string }> = ({ uid }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Education>({
    college: '',
    degree: '',
    department: '',
    current_semester: '',
    current_year: '',
    start_date: '',
    end_date: '',
  });
  
  const handleAddEducation = async () => {
    try {
      setLoading(true)
      await addDoc(collection(database, `students/${uid}/education`), formData);
      // Reset the form data after submission
      setFormData({
        college: '',
        degree: '',
        department: '',
        current_semester: '',
        current_year: '',
        start_date: '',
        end_date: '',
      });
      setLoading(false)
    } catch (error) {
      console.error('Error adding education details:', error);
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
        <h2 className="text-xl text-black font-semibold mb-4">Add Education</h2>
        <input
          type="text"
          name="college"
          placeholder="College Name"
          value={formData.college}
          onChange={handleChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
        />
        <input
          type="text"
          name="degree"
          placeholder="Degree"
          value={formData.degree}
          onChange={handleChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
        />
        <input
          type="text"
          name="current_semester"
          placeholder="Current Semester"
          value={formData.current_semester}
          onChange={handleChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
        />
        <input
          type="text"
          name="current_year"
          placeholder="Current Year"
          value={formData.current_year}
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
          onClick={handleAddEducation}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
        >
          Add Education
        </button>
      </div>
    </div>
  );
};

export default EducationDetails;
