"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, provider, db } from "../../../firebase"; // Adjust the path as necessary

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is already signed in:", user);

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          console.log("Creating new user document");
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName,
            salaryPreference: 20,
            salaryWeight: 5,
            skills: [],
            frontend_skills: [
              "Product",
              "Python",
              "Agile",
              "Java",
              "Project Management",
              "React",
              "Development",
              "C",
              "C++",
              "Kubernetes"
            ],
            programPreference: [],
            programWeight: 5,
            jobLevel: [],
            jobLevelWeight: 5,
            locationPreference: [],
            locationWeight: 5,
            likes: [],
            dislikes: [],
            resume_content: "",
            workterm_rating_weight: 5,
          });
          router.push("/questionnaire1");
        } else {
          console.log("User already exists");
          router.push("/joblist");
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in:", user);

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      console.log("User document:", userDoc);

      if (!userDoc.exists()) {
        console.log("Creating new user document");
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          salaryPreference: 20,
          salaryWeight: 5,
          skills: [],
          frontend_skills: [
            "Product",
            "Python",
            "Agile",
            "Java",
            "Project Management",
            "React",
            "Development",
            "C",
            "C++",
            "Kubernetes"
          ],
          programPreference: [],
          programWeight: 5,
          jobLevel: [],
          jobLevelWeight: 5,
          locationPreference: [],
          locationWeight: 5,
          likes: [],
          dislikes: [],
          resume_content: "",
          workterm_rating_weight: 5,
        });
        router.push("/questionnaire1");
      } else {
        console.log("User already exists");
        router.push("/joblist");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-10 w-full flex justify-center">
        <Image src="/full-logo.png" alt="logo" width={300} height={300} />
      </div>
      <button
        onClick={signInWithGoogle}
        className="signin-button mb-5 w-[400px] h-[55px] flex items-center justify-center bg-white border border-gray-300 rounded-lg"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 775 794"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M775 405.797C775 373.248 772.362 349.496 766.653 324.865H395.408V471.773H613.32C608.929 508.282 585.204 563.264 532.482 600.209L531.743 605.127L649.124 696.166L657.256 696.979C731.943 627.921 775 526.315 775 405.797"
            fill="#4285F4"
          />
          <path
            d="M395.408 792.866C502.167 792.866 591.792 757.676 657.256 696.979L532.482 600.209C499.093 623.521 454.279 639.796 395.408 639.796C290.845 639.796 202.099 570.741 170.463 475.294L165.826 475.688L43.772 570.256L42.1759 574.698C107.198 704.013 240.758 792.866 395.408 792.866Z"
            fill="#34A853"
          />
          <path
            d="M170.463 475.294C162.116 450.662 157.285 424.269 157.285 397C157.285 369.728 162.116 343.338 170.024 318.706L169.803 313.46L46.2193 217.373L42.1759 219.299C15.3772 272.961 0 333.222 0 397C0 460.778 15.3772 521.036 42.1759 574.698L170.463 475.294"
            fill="#FBBC05"
          />
          <path
            d="M395.408 154.201C469.656 154.201 519.74 186.31 548.298 213.143L659.891 104.059C591.356 40.2812 502.167 1.13428 395.408 1.13428C240.758 1.13428 107.198 89.9835 42.1759 219.299L170.024 318.706C202.099 223.259 290.845 154.201 395.408 154.201"
            fill="#EB4335"
          />
        </svg>
        <span className="font-medium ml-2">Sign in with Google</span>
      </button>
    </div>
  );
};

export default Login;
