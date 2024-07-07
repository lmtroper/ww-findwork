"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Circle from "@/app/components/Circle";
import ProtectedRoute from "../components/ProtectedRoute";
import { Bakbak_One } from "next/font/google";
import { Slider, Checkbox, Col, Row, Select } from "antd";
import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const bakbakOne = Bakbak_One({ subsets: ["latin"], weight: "400" });

const Page = () => {
  const [salary, setSalary] = useState();
  const [salaryImportance, setSalaryImportance] = useState(5);
  const [program, setProgram] = useState("");
  const [programImportance, setProgramImportance] = useState(5);
  const [jobLevels, setJobLevels] = useState([]);
  const [jobLevelImportance, setJobLevelImportance] = useState(5);
  const [locations, setLocations] = useState([]);
  const [locationImportance, setLocationImportance] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setJobLevels(data.jobLevel);
          setJobLevelImportance(data.jobLevelWeight);
          setLocations(data.locationPreference);
          setLocationImportance(data.locationWeight);
          setProgram(data.programPreference);
          setProgramImportance(data.programWeight);
          setSalary(100 - data.salaryPreference); // Invert the salary slider value
          setSalaryImportance(data.salaryWeight);
        }
      }
      setLoading(false);
    };
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated:", user);
        fetchUserPreferences(user);
      } else {
        console.log("No authenticated user found.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const postPerferences = () => {
    const updateUserQuestainnare = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          jobLevel: jobLevels,
          jobLevelWeight: jobLevelImportance,
          locationPreference: locations,
          locationWeight: locationImportance,
          programPreference: program,
          programWeight: programImportance,
          salaryPreference: 100 - salary,
          salaryWeight: salaryImportance,
        });
      }
    };

    updateUserQuestainnare();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-[1000px] absolute top-[50px] flex flex-col items-center justify-center pr-20">
        <div className="max-w-[800px]">
          <div className="flex justify-between items-center mb-16">
            <div className="text-[#063C5C] font-medium">
              <Link
                href="/questionnaire2"
                className="flex underline cursor-pointer"
              >
                Choose different skills
              </Link>
            </div>
            <div className="flex">
              <Circle number={1} active={true} />
              <Circle number={2} active={true} />
              <Circle number={3} active={true} />
            </div>
          </div>
          <div
            className={`${bakbakOne.className} font-bold text-3xl mb-8 text-center`}
          >
            Great! Answering the following questions will provide more tailored
            results.
          </div>
        </div>
        <div className="w-[1100px] flex mb-10">
          <div className="w-full">
            <div className="flex mb-16 justify-between">
              <div className="w-[500px] font-semibold text-black">
                <div className="mb-5">
                  What is the minimum hourly salary you are looking for?
                </div>
                <SalarySlider salary={salary} setSalary={setSalary} />
              </div>
              <ImportanceScale
                importance={salaryImportance}
                setImportance={setSalaryImportance}
                className="w-1/2"
              />
            </div>
            <div className="flex justify-between mb-16">
              <div className="w-[500px] font-semibold text-black">
                <div className="mb-5">
                  Do you want to apply to jobs with any program preferences?
                </div>
                <ProgramSelect program={program} setProgram={setProgram} />
              </div>
              <ImportanceScale
                importance={programImportance}
                setImportance={setProgramImportance}
                className="w-1/2"
              />
            </div>
            <div className="flex mb-16 justify-between">
              <div className="w-[500px] font-semibold text-black">
                <div className="mb-5">
                  What level of jobs are you looking for?
                </div>
                <JobLevelCheckboxes
                  jobLevels={jobLevels}
                  setJobLevels={setJobLevels}
                />
              </div>
              <ImportanceScale
                importance={jobLevelImportance}
                setImportance={setJobLevelImportance}
                className="w-1/2"
              />
            </div>
            <div className="flex justify-between">
              <div className="w-[500px] font-semibold text-black">
                <div className="mb-5">
                  Do you have any location preferences?
                </div>
                <LocationCheckboxes
                  locations={locations}
                  setLocations={setLocations}
                />
              </div>
              <ImportanceScale
                importance={locationImportance}
                setImportance={setLocationImportance}
                className="w-1/2"
              />
            </div>
          </div>
        </div>
        <Link href="/joblist">
          <button
            className="signin-button w-[500px] mb-20"
            onClick={postPerferences}
          >
            Submit
          </button>
        </Link>
      </div>
    </ProtectedRoute>
  );
};

export default Page;

const ImportanceScale = ({ importance, setImportance }) => {
  const marks = {
    1: "1",
    10: "10",
  };

  const handleChange = (value) => {
    setImportance(value);
  };

  return (
    <div className="w-[500px]">
      <div className="font-semibold text-black">
        How important is this for you?
      </div>
      <div className="w-full">
        <Slider
          min={1}
          max={10}
          marks={marks}
          step={1}
          defaultValue={importance}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

const SalarySlider = ({ salary, setSalary }) => {
  // NOTE: This is a bit hacky - the slider is "reversed" so we need
  // to be careful with how we extract the value from it

  const onChange = (newValue) => {
    setSalary(newValue);
  };

  const marks = {
    0: "$100",
    10: "$90",
    20: "$80",
    30: "$70",
    40: "$60",
    50: "$50",
    60: "$40",
    70: "$30",
    80: "$20",
    90: "$10",
    100: "$0",
  };

  const displayValue = 100 - salary;

  return (
    <Slider
      reverse
      step={1}
      value={salary}
      onChange={onChange}
      marks={marks}
      min={0}
      max={100}
      tooltip={{
        formatter: () => `$${displayValue}`, // Show the displayed value in the tooltip
      }}
    />
  );
};

const JobLevelCheckboxes = ({ jobLevels, setJobLevels }) => {
  const onChange = (checkedValues) => {
    setJobLevels(checkedValues);
    console.log("checked = ", checkedValues);
  };

  return (
    <Checkbox.Group value={jobLevels} onChange={onChange}>
      <Row gutter={[16, 16]} justify="space-between">
        <Col>
          <Checkbox value="JUN">Junior</Checkbox>
        </Col>
        <Col>
          <Checkbox value="INT">Intermediate</Checkbox>
        </Col>
        <Col>
          <Checkbox value="SEN">Senior</Checkbox>
        </Col>
      </Row>
    </Checkbox.Group>
  );
};

const LocationCheckboxes = ({ locations, setLocations }) => {
  const onChange = (checkedValues) => {
    setLocations(checkedValues);
    console.log("checked = ", checkedValues);
  };

  return (
    <Checkbox.Group
      value={locations}
      onChange={onChange}
      className="w-full flex"
    >
      <div className="flex flex-col">
        <Checkbox value="ON">Ontario</Checkbox>
        <Checkbox value="QC">Quebec</Checkbox>
        <Checkbox value="USA">United States of America</Checkbox>
      </div>
      <div className="flex flex-col">
        <Checkbox value="INT">International</Checkbox>
        <Checkbox value="WEST">Western Canada</Checkbox>
        <Checkbox value="GTA">Greater Toronto Area</Checkbox>
      </div>
    </Checkbox.Group>
  );
};

const ProgramSelect = ({ program, setProgram }) => {
  return (
    <Select
      showSearch
      style={{
        width: 200,
      }}
      placeholder="Select a Program"
      optionFilterProp="label"
      value={program || null}
      onChange={(value) => {
        setProgram(value);
      }}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase())
      }
      options={[
        {
          value: "1",
          label: "Not Identified",
        },
        {
          value: "2",
          label: "Closed",
        },
        {
          value: "3",
          label: "Communicated",
        },
        {
          value: "4",
          label: "Identified",
        },
        {
          value: "5",
          label: "Resolved",
        },
        {
          value: "6",
          label: "Cancelled",
        },
      ]}
    />
  );
};
