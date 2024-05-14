import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { database } from '@/config.firebase.js';
import LoadingSpinner from '../Loading';

interface SkillsDetailsProps {
  uid: string;
}

const SkillsDetails: React.FC<SkillsDetailsProps> = ({ uid }) => {
  const [skill, setSkill] = useState<string>('');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddSkill = () => {
    if (skill.trim() !== '') {
      setSkillsList([...skillsList, skill]);
      setSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkillsList = [...skillsList];
    updatedSkillsList.splice(index, 1);
    setSkillsList(updatedSkillsList);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true)
      // Insert each skill individually into Firestore
      await Promise.all(
        skillsList.map(async skill => {
          await addDoc(collection(database, `students/${uid}/skills`), { skill });
        })
      );
      // Reset the skills list
      setSkillsList([]);
      setLoading(false)
    } catch (error) {
      console.error('Error saving skills:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {loading && <LoadingSpinner />}
      <h1 className="text-3xl text-black font-semibold mb-8">Student Details</h1>

      <div className="mb-8">
        <h2 className="text-xl text-black font-semibold mb-4">Add Skills</h2>
        <div className="flex items-center mb-2">
          <input
            type="text"
            placeholder="Enter a skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full p-2 mr-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
          />
          <button
            onClick={handleAddSkill}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
          >
            Add Skill
          </button>
        </div>
        <ul className="flex flex-wrap">
          {skillsList.map((skill, index) => (
            <li key={index} className="m-1 px-2 py-1 bg-gray-200 text-gray-800 rounded-md flex items-center">
              {skill}
              <button
                className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                onClick={() => handleRemoveSkill(index)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
      >
        Submit Skills
      </button>
    </div>
  );
};

export default SkillsDetails;
