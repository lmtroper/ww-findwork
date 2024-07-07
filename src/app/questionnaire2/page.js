"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Circle from "@/app/components/Circle";
import ProtectedRoute from "../components/ProtectedRoute";
import { Bakbak_One } from "next/font/google";
import Image from "next/image";
import { auth, db } from '../../../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
const bakbakOne = Bakbak_One({ subsets: ["latin"], weight: "400" });

const resumeSkills = [
  "Product",
  "Python",
  "Agile",
  "Java",
  "Project Management",
  "React",
  "Development",
];

const page = () => {
  const [username, setUsername] = useState("Sirisha");
  const [skills, setSkills] = useState(resumeSkills);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const user = auth.currentUser;

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSelectedSkills(userData.skills);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    console.log(auth.currentUser)
    fetchUserSkills();
  }, []);

  const postSkills = () => {
    const updateUserSkills = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { skills: selectedSkills });
      }
    };

    if (selectedSkills.length > 0) {
      updateUserSkills();
    }
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-[800px] absolute top-[200px] flex flex-col items-center justify-center pr-20">
        <div className="w-[800px]">
          <div className="flex justify-between items-center mb-16">
            <div className="text-[#063C5C] font-medium">
              <Link
                href="/questionnaire1"
                className="flex underline cursor-pointer"
              >
                Upload a different resume
              </Link>
            </div>
            <div className="flex">
              <Circle number={1} active={true} />
              <Circle number={2} active={true} />
              <Circle number={3} active={false} />
            </div>
          </div>
          <div
            className={`${bakbakOne.className} font-bold text-3xl mb-8 text-center`}
          >
            Based on your resume we found the following skills, which of these
            would you like to do in your next role?
          </div>
        </div>
        <div className="mb-10 max-w-[650px]">
          <div className="flex flex-wrap justify-center">
            {skills.map((skill) => (
              <div
                key={skill}
                className={`skill-tag cursor-pointer ${
                  selectedSkills.includes(skill)
                    ? "bg-[#063C5C] text-white"
                    : "text-[#063C5C]"
                }`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
        <label
          htmlFor="add-skills"
          className="mb-5 resume-upload-btn w-[640px] flex justify-center items-center"
        >
          <Image src="/add.png" alt="upload" width={25} height={25} />
          <div className="ml-2">Add additional skills</div>
        </label>
        <button id="resume-upload" style={{ display: "none" }} />
        <Link href="questionnaire3">
          <button className="signin-button w-[640px]" onClick={postSkills}>Next</button>
        </Link>
      </div>
    </ProtectedRoute>
  );
};

export default page;
