import { DocumentData } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import JobsPage from "@/components/cards/jobsCards";
import ProjectDetails from "@/components/forms/projectDetails";
import SkillsDetails from "@/components/forms/skillsDetails";
import EducationDetails from "@/components/forms/educationDetails";
import InternshipDetails from "@/components/forms/internshipDetails";
import Notification from "../JobNotification";
import Settings from "../Settings";

interface SidebarProps {
  setActiveComponent: (component: string) => void;
}

const Sidebar = ({ setActiveComponent }: SidebarProps) => {
  return (
    <div className="min-h-screen w-1/3 bg-gray-200 p-4">
      <ul>
        <li className="mb-4">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setActiveComponent("view-job")}
          >
            View Jobs
          </button>
        </li>
        <li className="mb-4">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setActiveComponent("add-project-details")}
          >
            Add Projects
          </button>
        </li>
        <li className="mb-4">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setActiveComponent("add-education-details")}
          >
            Add Education
          </button>
        </li>
        <li className="mb-4">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setActiveComponent("add-skills-details")}
          >
            Add Skills
          </button>
        </li>
        <li className="mb-4">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setActiveComponent("add-internship-details")}
          >
            Add Internships
          </button>
        </li>
        <li className="mb-4">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setActiveComponent("notification")}
          >
            Notifications
          </button>
        </li>
        <li>
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setActiveComponent("settings")}
          >
            Settings
          </button>
        </li>
      </ul>
    </div>
  );
};

interface MainContentProps {
  activeComponent: string;
  uid: string
}

const MainContent = ({ activeComponent, uid }: MainContentProps) => {
  const renderComponent = () => {
    switch (activeComponent) {
      case "view-job":
        return <><h1 className="text-lg text-black font-semibold">All jobs</h1><JobsPage /></>;
      case "add-project-details":
        return <ProjectDetails uid={uid}/>;
      case "add-skills-details":
        return <SkillsDetails uid={uid}/>;
      case "add-education-details":
        return <EducationDetails uid={uid}/>;
      case "add-internship-details":
        return <InternshipDetails uid={uid}/>;
      case "notification":
        return <Notification uid={uid}/>;
      case "settings":
        return <Settings userId={uid}/>;
      default:
        return <><h1 className="text-lg text-black font-semibold">All jobs</h1><JobsPage /></>;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-white p-4">
      {renderComponent()}
    </div>
  );
};

interface UserData {
    data: DocumentData,
    uid: string
  }

export default function StudentDashboard({ data, uid }: UserData) {
  const [activeComponent, setActiveComponent] = useState<string>("view-job");

  return (
    <main className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
            <Sidebar setActiveComponent={setActiveComponent} />
            <MainContent activeComponent={activeComponent} uid={uid} />
        </div>
    </main>
  );
}
