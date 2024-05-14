import { DocumentData } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import NewJob from "@/components/forms/newJob";
import JobsPage from "@/components/cards/jobsCards";
import RecuiterJobsPage from "../cards/recruiterJobsCard";
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
            onClick={() => setActiveComponent("new-job")}
          >
            New Job
          </button>
        </li>
        <li className="mb-4">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setActiveComponent("post-job")}
          >
            View Posted Jobs
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
      case "new-job":
        return <NewJob uid={uid}/>;
      case "post-job":
        return <RecuiterJobsPage recruiterID={uid} />;
      case "settings":
        return <Settings userId={uid} />;
      default:
        return <JobsPage />;
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

export default function RecruiterDashboard({ data, uid }: UserData) {
  const [activeComponent, setActiveComponent] = useState<string>("post-job");

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
