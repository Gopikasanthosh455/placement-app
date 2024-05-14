import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { database } from '@/config.firebase.js'
import sendNewJobEmailNotification from '@/utils/notification';
import LoadingSpinner from '../Loading';

interface NewJobForm {
  title: string;
  companyName: string;
  details: string;
  industry: string;
  ctc: string;
  openings: number;
  dueDate: string;
  skills: string[];
  recruiter: string;
}

const NewJob: React.FC<{ uid: string }> = ({ uid }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [skill, setSkill] = useState<string>('');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [formData, setFormData] = useState<NewJobForm>({
    title: '',
    companyName: '',
    details: '',
    industry: '',
    ctc: '',
    openings: 0,
    dueDate: '',
    skills: [],
    recruiter: uid
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      setLoading(true)
      const formDataWithSkills: NewJobForm = {
        ...formData,
        skills: skillsList.map(skill => skill.toLowerCase())
      };
      await addDoc(collection(database, 'jobs'), formDataWithSkills);
      const emailText = `${formData.companyName} is hiring for ${formData.title}. The have ${formData.openings} vacancies. Apply before duedate of ${formData.dueDate}`;
      await sendNewJobEmailNotification(emailText);
      setLoading(false)
    } catch(e) {
      console.error(e)
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && <LoadingSpinner />}
      <h2 className="text-2xl text-black font-semibold mb-10">New Job / Internship Form</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap">
        <div className="mb-4 w-full md:w-1/2 pr-2">
          <label htmlFor="title" className="block text-gray-700">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4 w-full md:w-1/2 pl-2">
          <label htmlFor="companyName" className="block text-gray-700">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>
        {/* Add more input fields for other form elements */}
        <div className="w-full">
          <label htmlFor="details" className="block text-gray-700">Job Details</label>
          <textarea
            id="details"
            name="details"
            rows={4}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
            value={formData.details}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        {/* Add more input fields for other form elements */}
        <div className="mb-4 w-full md:w-1/2 pr-2">
          <label htmlFor="industry" className="block text-gray-700">Industry</label>
          <input
            type="text"
            id="industry"
            name="industry"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
            value={formData.industry}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4 w-full md:w-1/2 pl-2">
          <label htmlFor="ctc" className="block text-gray-700">Expected CTC</label>
          <input
            type="text"
            id="ctc"
            name="ctc"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
            value={formData.ctc}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4 w-full md:w-1/2 pr-2">
          <label htmlFor="openings" className="block text-gray-700">Number of Openings</label>
          <input
            type="text"
            id="openings"
            name="openings"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
            value={formData.openings}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4 w-full md:w-1/2 pl-2">
          <label htmlFor="dueDate" className="block text-gray-700">Due Date for Application submission</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full">
          <div>
            <label htmlFor="skills" className="block text-gray-700">Add Skills required:</label>
            <input
              type="text"
              placeholder="Enter a skill"
              id="skills"
              name="skills"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full p-2 mr-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-800"
            />
            <div
              onClick={handleAddSkill}
              className="inline-block bg-blue-500 text-white py-1 px-2 rounded cursor-pointer hover:bg-blue-600 focus:outline-none"
            >
              Add Skill
            </div>
          </div>
          <ul className="flex flex-wrap">
            {skillsList.map((skill, index) => (
              <li key={index} className="m-1 px-2 py-1 bg-gray-200 text-gray-800 rounded-md flex items-center">
                {skill}
                <div
                  className="inline-block bg-red-500 text-white my-1 mx-2 p-1 rounded cursor-pointer hover:bg-red-600 focus:outline-none"
                  onClick={() => handleRemoveSkill(index)}
                >
                  X
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full mt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewJob;
