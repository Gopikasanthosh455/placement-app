import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { database } from '@/config.firebase.js';
import LoadingSpinner from '../Loading';

interface Internship {
  company: string;
  position: string;
  url?: string;
  start_date: string;
  end_date: string;
}

const InternshipDetails: React.FC<{ uid: string }> = ({ uid }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Internship>({
    company: '',
    position: '',
    url: '',
    start_date: '',
    end_date: '',
  });

  const handleAddInternship = async () => {
    try {
      setLoading(true)
      await addDoc(collection(database, `students/${uid}/internships`), formData);
      // Reset the form data after submission
      setFormData({
        company: '',
        position: '',
        url: '',
        start_date: '',
        end_date: '',
      });
      setLoading(false)
    } catch (error) {
      console.error('Error adding internship:', error);
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
        <h2 className="text-xl text-black font-semibold mb-4">Add Internship</h2>
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
        />
        <input
          type="text"
          name="url"
          placeholder="Internship URL"
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
          onClick={handleAddInternship}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
        >
          Add Internship
        </button>
      </div>
    </div>
  );
};

export default InternshipDetails;
