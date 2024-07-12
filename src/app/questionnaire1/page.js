"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Circle from "@/app/components/Circle";
import ProtectedRoute from "../components/ProtectedRoute";
import { auth, db, storage } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Bakbak_One } from "next/font/google";
import { uploadFile, readFile } from "../helpers/FileUpload";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import * as pdfjsLib from "pdfjs-dist/webpack";
const bakbakOne = Bakbak_One({ subsets: ["latin"], weight: "400" });

const Page = () => {
  const [username, setUsername] = useState("Sirisha");
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [resumeURL, setResumeURL] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [error, setError] = useState("");
  const [resume_Content, setResumeContent] = useState("");

  const stopwords = [
    "a",
    "about",
    "and",
    "achievements",
    "abilities",
    "across",
    "always",
    "and",
    "an",
    "as",
    "at",
    "be",
    "been",
    "being",
    "by",
    "clients",
    "conduct",
    "develop",
    "developing",
    "duties",
    "driven",
    "experience",
    "for",
    "from",
    "goals",
    "growth",
    "have",
    "highly",
    "in",
    "is",
    "it",
    "knowledge",
    "management",
    "meet",
    "most",
    "need",
    "objectives",
    "on",
    "our",
    "out",
    "over",
    "of",
    "partners",
    "perform",
    "professional",
    "projects",
    "proven",
    "real-time",
    "recognize",
    "research",
    "results",
    "role",
    "skills",
    "sourcing",
    "speaking",
    "specific",
    "supporting",
    "team",
    "the",
    "to",
    "understanding",
    "up",
    "we",
    "while",
    "with",
    "work",
  ];

  const extractTextFromPDF = async (file) => {
    const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      const pageText = strings.join(" ");

      // Split text into words, filter out stopwords, and rejoin
      const filteredText = pageText
        .split(/\s+/)
        .filter((word) => !stopwords.includes(word.toLowerCase()))
        .join(" ");

      text += filteredText;
    }

    return text.replace(/[\#\•\§\ï\/\-\:\=\+\;\'\"\?\!\.]/g, "").trim();
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    const user = auth.currentUser;
    try {
      if (file) {
        setResume(file);
        setResumeName(file.name);
        const url = URL.createObjectURL(file);
        setResumeURL(url);

        // We are not using the file in firestore at all, just keeping since I set it up and we can collect resumes.
        const urlFireStore = await uploadFile(file, user.uid);
        setFileURL(urlFireStore);
        setError("");
      } else {
        setError("Please select a file to upload.");
      }
    } catch (err) {
      setError("Error uploading file.");
    }
  };

  useEffect(() => {
    const fetchResumeContent = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setResumeContent(data.resume_content);
          setResumeName(data.resume_name);

          if (data.resume_name) {
            // Fetch the resume URL from Firestore Storage
            const storageRef = ref(
              storage,
              `resumes/${user.uid}/${data.resume_name}`
            );

            setResume(data.resume_name);
            const downloadURL = await getDownloadURL(storageRef);
            setResumeURL(downloadURL);
          }
        }
      }
    };
    const getUserName = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated:", user);
        setUsername(user.displayName);
        fetchResumeContent();
      } else {
        console.log("No authenticated user found.");
      }
    });

    return () => getUserName();
  }, []);

  useEffect(() => {}, []);

  const saveResumeToDb = async () => {
    const updateUserResumeContent = async (resumeContent) => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          resume_content: resumeContent,
          resume_name: resumeName,
        });
      }
    };

    try {
      if (resume) {
        // reading the file from firestore but also not use, but creates a small delay, so the button doesn't show any errors!
        await readFile(fileURL);
        const resumeContent = await extractTextFromPDF(resume);
        setResumeContent(resumeContent);
        updateUserResumeContent(resumeContent);
        setError("");
      } else {
        setError("No file URL available. Please upload a file first.");
      }
    } catch (err) {
      setError("Error reading file.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="w-full absolute top-[200px] max-w-[800px] flex flex-col items-center justify-center pr-20">
        <div className="max-w-[800px]">
          <div className="flex justify-end mb-16">
            <Circle number={1} active={true} />
            <Circle number={2} active={false} />
            <Circle number={3} active={false} />
          </div>
          <div
            className={`${bakbakOne.className} font-bold text-3xl mb-8 text-center`}
          >
            Welcome to FindWork on WaterlooWorks, {username}!
          </div>
          <div className="mb-16 font-light text-sm text-center">
            To get started upload your resume and continue to fill out the
            questionnaire so that we can filter through the jobs on
            WaterlooWorks and show you the ones most relevant to you. Don’t
            worry you can come back later to change this.
          </div>
        </div>
        {resume && (
          <div className="mb-5">
            <a
              href={resumeURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {typeof resume === "string" ? resume : resume?.name}
            </a>
          </div>
        )}
        <label
          htmlFor="resume-upload"
          className="mb-5 resume-upload-btn w-[640px] flex justify-center items-center"
        >
          <Image src="/upload.png" alt="upload" width={25} height={25} />
          <div className="ml-2">Click here to upload your resume</div>
        </label>
        <input
          id="resume-upload"
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={handleResumeUpload}
        />
        {error && !resume_Content && <p style={{ color: "red" }}>{error}</p>}
        <Link href={resume || resume_Content ? "questionnaire2" : "#"}>
          <button className="signin-button w-[640px]" onClick={saveResumeToDb}>
            Start questionnaire
          </button>
        </Link>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
