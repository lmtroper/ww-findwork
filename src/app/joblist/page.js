"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import ProtectedRoute from "../components/ProtectedRoute";
import { Bakbak_One } from "next/font/google";
import {
  retrieveUserPreferences,
  retrieveUserResume,
  retrieveUserSkills
} from "../helpers/retrieve_data";
import { getCachedData, parsePostings } from "../helpers/parse_data";
import { assignUtility } from "../helpers/utility_score";
import { auth, db } from "../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const bakbakOne = Bakbak_One({ subsets: ["latin"], weight: "400" });

const Page = () => {
  const [jobs, setJobs] = useState([]);
  const [jobData, setJobData] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCachedData("ijmmbpioejdfnlbghgeonddkajmjccpm")
      .then((data) => {
        const jobResults = parsePostings(data);
        setJobData(jobResults);
        console.log(jobResults);
      })
      .catch((error) => {
        console.error("Failed to get cached data:", error);
      });
  }, []);

  useEffect(() => {
    const fetchPreferences = async () => {
      const user = auth.currentUser;
      console.log(`user: ${user}`);
      const userPreferences = await retrieveUserPreferences(user.uid);
      setPreferences(userPreferences);
      console.log(userPreferences);
    };

    const fetchResume = async () => {
      const user = auth.currentUser;
      const userResume = await retrieveUserResume(user.uid);
      setResume(userResume);
    };

    const fetchSkills = async () => {
      const user = auth.currentUser;
      const userSkills = await retrieveUserSkills(user.uid);
      setSkills(userSkills);
      console.log(`Skills: ${userSkills}`)
    };

    const getData = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated:", user);
        fetchPreferences(user);
        fetchResume(user)
        fetchSkills(user)
      } else {
        console.log("No authenticated user found.");
      }
    });

    return () => getData();
  }, []);

  useEffect(() => {
    // Check if all data is loaded and none are undefined
    if (jobData !== undefined && jobData !== null &&
        preferences !== undefined && preferences !== null &&
        resume !== undefined && resume !== null && skills !== undefined && skills !== null) {
        console.log("Data loaded")
        setLoading(false);
        var jobDataUtility = assignUtility(jobData, preferences, skills, resume);
        setJobs(jobDataUtility);
    }
}, [jobData, preferences, skills, resume]);

  const handleButtonClick = () => {
    window.open("https://waterlooworks.uwaterloo.ca/myAccount/dashboard.htm", "_blank");
  };

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
          {jobData.length > 0 && (
            <div className="mb-10 max-w-[650px] font-light text-sm text-center">
              Here are your results based on your questionnaire! Click on any of
              them to open them in a new tab or shortlist them to check out
              later.
            </div>
          )}
        </div>
        {jobData.length > 0 ? (
          <div className="w-[1000px] mb-20">
            {jobs.map((job, index) => (
              <Job key={index} job={job} />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-5 max-w-[650px] text-sm">
              It looks like you haven't scraped any data on WaterlooWorks yet.
              Please head over to WaterlooWorks and scrape some data to see some
              great results here!
            </div>
            <button
              onClick={handleButtonClick}
              className="signin-button w-[250px] h-[55px] flex items-center justify-center bg-white border border-gray-300 rounded-lg"
            >
              <span className="font-small">Go to WaterlooWorks</span>
            </button>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Page;

const Job = ({ job }) => {
  const [isThumbsUpActive, setThumbsUpActive] = useState(false);
  const [isThumbsDownActive, setThumbsDownActive] = useState(false);
  const [isThumbsUpDisabled, setThumbsUpDisabled] = useState(false);
  const [isThumbsDownDisabled, setThumbsDownDisabled] = useState(false);
  const [likes, setLikes] = useState([]);
  const [disLikes, setDisLikes] = useState([]);

  useEffect(() => {
    const fetchLikesAndDislikes = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setLikes(data.likes || []);
          setDisLikes(data.dislikes || []);
        }
      }
    };

    fetchLikesAndDislikes();
  }, []);

  useEffect(() => {
    if (likes.includes(job.jobId)) {
      setThumbsUpActive(true);
      setThumbsDownDisabled(true);
    } else {
      setThumbsUpActive(false);
      setThumbsDownDisabled(false);
    }
  }, [likes, job.jobId]);

  useEffect(() => {
    if (disLikes.includes(job.jobId)) {
      setThumbsDownActive(true);
      setThumbsUpDisabled(true);
    } else {
      setThumbsDownActive(false);
      setThumbsUpDisabled(false);
    }
  }, [disLikes, job.jobId]);

  const handleLike = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      if (isThumbsUpActive) {
        await updateDoc(userRef, {
          likes: arrayRemove(job.jobId),
        });
        setLikes((prevLikes) => prevLikes.filter((id) => id !== job.jobId));
        setThumbsUpActive(false);
      } else {
        await updateDoc(userRef, {
          likes: arrayUnion(job.jobId),
        });
        setLikes((prevLikes) => [...prevLikes, job.jobId]);
        setThumbsUpActive(true);
        setThumbsDownDisabled(true);
      }
    }
  };

  const handleDisLike = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      if (isThumbsDownActive) {
        await updateDoc(userRef, {
          dislikes: arrayRemove(job.jobId),
        });
        setDisLikes((prevDisLikes) =>
          prevDisLikes.filter((id) => id !== job.jobId)
        );
        setThumbsDownActive(false);
      } else {
        await updateDoc(userRef, {
          dislikes: arrayUnion(job.jobId),
        });
        setDisLikes((prevDisLikes) => [...prevDisLikes, job.jobId]);
        setThumbsDownActive(true);
        setThumbsUpDisabled(true);
      }
    }
  };

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
        <div className="flex">
        <div className="text-[14px] text-black">
          {job.company} - {job.mappedRegion} &nbsp;&nbsp;|&nbsp;&nbsp;<b>Match Score: </b>
          <span style={{ color: job.scaledUtilityScore > 0.7 ? 'green' : (job.scaledUtilityScore >= 0.33 ? '#D5B60A' : '#FFCC00') }}>
          <b>{job.scaledUtilityScore}</b>
          </span>
          &nbsp;
        </div>
      </div>
      </div>
      </div>
      <div className="flex">
        <button
          disabled={isThumbsUpDisabled}
          onClick={handleLike}
          className={`mr-3 cursor-pointer p-2 rounded-full border-2 border-transparent ${
            isThumbsUpActive ? "bg-[#4CD137] border-[#4CD137]" : "bg-gray-200"
          } hover:bg-[#b7ecaf] ${
            isThumbsUpDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <img src="/thumbs-up.png" alt="thumbs up" width={24} height={24} />
        </button>
        <button
          disabled={isThumbsDownDisabled}
          onClick={handleDisLike}
          className={`mr-3 cursor-pointer p-2 rounded-full border-2 border-transparent ${
            isThumbsDownActive ? "bg-[#4CD137] border-[#4CD137]" : "bg-gray-200"
          } hover:bg-[#b7ecaf] ${
            isThumbsDownDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <img
            src="/thumbs-down.png"
            alt="thumbs down"
            width={24}
            height={24}
          />
        </button>
        <Link href={job.url} target="_blank" className="cursor-pointer">
          <button className="p-2 rounded-full bg-gray-200 hover:bg-[#b7ecaf]">
            <img src="/link.png" alt="link" width={24} height={24} />
          </button>
        </Link>
      </div>
    </div>
  );
};
