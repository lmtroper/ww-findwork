"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ClipLoader } from 'react-spinners';
import ProtectedRoute from "../components/ProtectedRoute";
import { Bakbak_One } from "next/font/google";
import { retrieveUserPreferences, retrieveUserResume } from "../helpers/retrieve_data"
import { getCachedData, parsePostings } from "../helpers/parse_data";
import { assignUtility } from "../helpers/utility_score";
import { auth, db } from '../../../firebase';
import { onAuthStateChanged } from "firebase/auth";

const bakbakOne = Bakbak_One({ subsets: ["latin"], weight: "400" });

const sampleJobs = [
  {
    title: "Software Engineer",
    company: "Google",
    location: "Waterloo, ON",
    url: "https://www.google.com",
  },
  {
    title: "Software Engineer",
    company: "Google",
    location: "Waterloo, ON",
    url: "https://www.google.com",
  },
  {
    title: "Software Engineer",
    company: "Google",
    location: "Waterloo, ON",
    url: "https://www.google.com",
  },
  {
    title: "Software Engineer",
    company: "Google",
    location: "Waterloo, ON",
    url: "https://www.google.com",
  },
  {
    title: "Software Engineer",
    company: "Google",
    location: "Waterloo, ON",
    url: "https://www.google.com",
  },
  {
    title: "Software Engineer",
    company: "Google",
    location: "Waterloo, ON",
    url: "https://www.google.com",
  },
  {
    title: "Software Engineer",
    company: "Google",
    location: "Waterloo, ON",
    url: "https://www.google.com",
  },
];

const Page = () => {
  const [jobs, setJobs] = useState([]);
  const [jobData, setJobData] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [resume, setResume] = useState("python, javascript, react, financial")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCachedData("ijmmbpioejdfnlbghgeonddkajmjccpm")
    .then((data) => {
      const jobResults = parsePostings(data)
      setJobData(jobResults);
      console.log(jobResults)
    })
    .catch((error) => {
      console.error("Failed to get cached data:", error);
    });
  }, [])

  useEffect(() => {
    
    const fetchPreferences = async () => {
      const user = auth.currentUser;
      console.log(`user: ${user}`)
      const userPreferences = await retrieveUserPreferences(user.uid);
      setPreferences(userPreferences);
      console.log(userPreferences)
    };

    const getPreferences = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated:", user);
        fetchPreferences(user);
      } else {
        console.log("No authenticated user found.");
      }
    });

    return () => getPreferences();
    
  }, []);

  useEffect(() => {
    // Check if all data is loaded
    if (jobData !== null && preferences !== null && resume !== "") {
      setLoading(false)
      var jobDataUtility = assignUtility(jobData, preferences, resume)
      setJobs(jobDataUtility)

    }
  }, [jobData, preferences, resume]);

  if (loading) {
    return (
      <div className="spinner-container">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="absolute top-[100px] flex flex-col items-center justify-center pr-20">
        <div className="w-[1000px] text-[#063C5C] font-medium">
          <Link
            href="/questionnaire3"
            className="flex underline cursor-pointer mb-5"
          >
            Back
          </Link>
        </div>
        <div className="max-w-[650px]">
          <div
            className={`${bakbakOne.className} font-bold text-3xl mb-8 w-full text-center`}
          >
            Your Results!
          </div>
          <div className="mb-10 max-w-[650px] font-light text-sm text-center">
            Here are your results based on your questionnaire! Click on any of
            them to open them in a new tab or shortlist them to check out later.
          </div>
        </div>
        <div className="w-[1000px] mb-20">
          {jobs.map((job, index) => (
            <Job key={index} job={job} />
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;

const Job = ({ job }) => {
  return (
    <div className="flex w-full justify-between items-center pt-5 pb-3 border-b-[1px] border-b-black">
      <div>
        <div>
          <Link href={job.url} target="_blank" className="cursor-pointer">
            <div className="text-[16px] text-black font-semibold underline mb-2">
              {job.jobTitle}
            </div>
          </Link>
        </div>
        <div className="flex">
        <div className="text-[14px] text-black">
          {job.company + " - " + job.mappedRegion}
        </div>
        </div>
      </div>
      <div className="flex">
        <Image
          src="/thumbs-up.png"
          className="mr-3 cursor-pointer"
          width={40}
          height={40}
        />
        <Image
          src="/thumbs-down.png"
          className="mr-3 cursor-pointer"
          width={40}
          height={40}
        />
        <Link href={job.url} target="_blank" className="cursor-pointer">
          <Image src="/link.png" alt="link" width={40} height={40} />
        </Link>
      </div>
    </div>
  );
};
