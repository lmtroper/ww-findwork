"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Circle from "@/app/components/Circle";
import ProtectedRoute from "../components/ProtectedRoute";
import { Bakbak_One } from "next/font/google";
import Image from "next/image";
import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
const bakbakOne = Bakbak_One({ subsets: ["latin"], weight: "400" });

const AddSkillModal = ({ isOpen, onClose, onAddSkill }) => {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      onAddSkill(newSkill);
      setNewSkill("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div
          className={`${bakbakOne.className} font-bold text-xl mb-4 text-center`}
        >
          Add a New Skill
        </div>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Enter skill"
        />
        <div className="modal-buttons">
          <button onClick={onClose}>Close</button>
          <button onClick={handleAddSkill}>Add Skill</button>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        .modal input {
          width: 75%;
          padding: 10px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .modal-buttons {
          display: flex;
          justify-content: space-around;
        }
        .modal-buttons button {
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          background: #063c5c;
          color: white;
          cursor: pointer;
          transition: background 0.3s;
        }
        .modal-buttons button:hover {
          background: #0a4f76;
        }
      `}</style>
    </div>
  );
};

const Page = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const user = auth.currentUser;
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSelectedSkills(userData.skills);
          setSkills(userData.frontend_skills);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const getUserSkills = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated:", user);
        fetchUserSkills(user);
      } else {
        console.log("No authenticated user found.");
      }
    });

    return () => getUserSkills();
  }, []);

  const postSkills = () => {
    const updateUserSkills = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          skills: selectedSkills,
          frontend_skills: skills,
        });
      }
    };

    if (selectedSkills.length > 0) {
      updateUserSkills();
    }
  };

  const handleAddSkill = (newSkill) => {
    setSkills([...skills, newSkill]);
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
            Which of these skills would you like to leverage in your next
            professional experience? Select the ones that best align with your
            career aspirations and goals.
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
          onClick={() => setIsModalOpen(true)} // Open the modal
        >
          <Image src="/add.png" alt="upload" width={25} height={25} />
          <div className="ml-2">Add additional skills</div>
        </label>
        <button id="resume-upload" style={{ display: "none" }} />
        <Link href="questionnaire3">
          <button className="signin-button w-[640px]" onClick={postSkills}>
            Next
          </button>
        </Link>
      </div>
      <AddSkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSkill={handleAddSkill}
      />
    </ProtectedRoute>
  );
};

export default Page;
