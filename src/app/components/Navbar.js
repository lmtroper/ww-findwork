"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase"; // Adjust the path as necessary

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div
      className={`${
        pathname === "/" ? "hidden" : "flex"
      } ml-10 mt-10 w-fit flex-col items-center`}
    >
      <div className="logo">
        <Link href="/">
          <img
            src="/logo.png"
            className="min-w-[80px] max-w-[80px] mx-[15px]"
          />
        </Link>
      </div>
      <div
        className={`w-full mt-10 ${
          pathname !== "/joblist" ? "active-tab" : ""
        } p-[10px] hover:bg-[#063C5C] rounded-lg hover:bg-opacity-10 transition-colors duration-300`}
      >
        <Link
          href="/questionnaire1"
          className="flex flex-col  items-center w-full h-full cursor-pointer"
        >
          <img src="/questionnaire.png" className="min-w-[40px] max-w-[40px]" />
          <div className="items-center font-medium mt-2">Questionnaire</div>
        </Link>
      </div>
      <div
        className={`w-full mt-10 ${
          pathname === "/joblist" ? "active-tab" : ""
        } p-[10px] hover:bg-[#063C5C] rounded-lg hover:bg-opacity-10 transition-colors duration-300`}
      >
        <Link
          href="/joblist"
          className="flex flex-col items-center cursor-pointer"
        >
          <img src="/results.png" className="min-w-[40px] max-w-[40px]" />
          <div className="items-center font-medium mt-2">Results</div>
        </Link>
      </div>
      <div className={`w-full mt-10 p-[10px] rounded-lg hover:bg-[#063C5C] hover:bg-opacity-10 transition-colors duration-300`}>
        <div className="flex flex-col items-center cursor-pointer">
          <button onClick={handleLogout}>
            <div className="flex flex-col items-center cursor-pointer">
              <img src="/logout.png" className="min-w-[40px] max-w-[40px]" />
              <div className="items-center font-medium mt-2">Logout</div>
            </div>
          </button>
        </div>
      </div>
      <div className="w-full mt-auto p-[10px]"></div>
    </div>
  );
};

export default Navbar;
