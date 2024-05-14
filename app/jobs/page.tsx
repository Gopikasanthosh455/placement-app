'use client'

import Navbar from "@/components/Navbar";
import JobsPage from "@/components/cards/jobsCards";

export default function Jobs() {
    return (
      <main>
        <Navbar />
        <div className="container mx-auto py-8 bg-gray-200">
          <h1 className="text-3xl text-black text-center font-semibold">Posted jobs</h1>
        </div>
        <JobsPage />
      </main>
    );
  }