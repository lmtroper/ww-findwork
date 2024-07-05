"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Circle from '@/app/components/Circle'
import { Bakbak_One } from "next/font/google";
import { Slider, Checkbox, Col, Row, Select } from 'antd';

const bakbakOne = Bakbak_One({ subsets: ["latin"], weight: "400" });

const page = () => {
  return (
    <div className='max-w-[1000px] absolute top-[50px] flex flex-col items-center justify-center pr-20'>
      <div className='max-w-[800px]'>
        <div className='flex justify-between items-center mb-16'>
          <div className='text-[#063C5C] font-medium'>
            <Link href="/questionnaire2" className='flex underline cursor-pointer'>Choose different skills</Link>
          </div>
          <div className='flex'>
              <Circle number={1} active={true} />
              <Circle number={2} active={true} />
              <Circle number={3} active={true} />
          </div>
        </div>
        <div className={`${bakbakOne.className} font-bold text-3xl mb-8 text-center`}>
            Great! Answering the following questions will provide more tailored results.
          </div>
      </div>
      <div className='w-[1100px] flex mb-10'>
        <div className='w-full'>
          <div className='flex mb-16 justify-between'>
            <div className='w-[500px] font-semibold text-black'>
              <div className='mb-5'>What is the minimum hourly salary you are looking for?</div>
              <SalarySlider />
            </div>
            <ImportanceScale className='w-1/2' />
          </div>
          <div className='flex justify-between mb-16'>
            <div className='w-[500px] font-semibold text-black'>
              <div className='mb-5'>Do you want to apply to jobs with any program preferences?</div>
              <ProgramSelect />
            </div>
            <ImportanceScale className='w-1/2' />
          </div>
          <div className='flex mb-16 justify-between'>
            <div className='w-[500px] font-semibold text-black'>
              <div className='mb-5'>What level of jobs are you looking for?</div>
              <JobLevelCheckboxes />
            </div>
            <ImportanceScale className='w-1/2' />
          </div>
          <div className='flex justify-between'>
            <div className='w-[500px] font-semibold text-black'>
              <div className='mb-5'>Do you have any location preferences?</div>
              <LocationCheckboxes />
            </div>
            <ImportanceScale className='w-1/2' />
          </div>
        </div>
      </div>
    <Link href="/joblist">
        <button className='signin-button w-[500px] mb-20'>Submit</button>
    </Link>
  </div>
  )
}

export default page


const ImportanceScale = () => {
  const marks = {
    1: '1',
    10: '10'
  };

  return(
    <div className='w-[500px]'>
      <div className='font-semibold text-black'>
        How important is this for you?
      </div>
      <div className='w-full'>
        <Slider 
          min={1} 
          max={10} 
          marks={marks} 
          step={1} 
          defaultValue={5} />
      </div>
    </div>
  )
}

const SalarySlider = () => {
  // NOTE: This is a bit hacky - the slider is "reversed" so we need
  // to be careful with how we extract the value from it
  const [value, setValue] = useState(80); 
  console.log(value)

  const onChange = (newValue) => {
    setValue(newValue);
  };

  const marks = {
    0: '$100',
    10: '$90',
    20: '$80',
    30: '$70',
    40: '$60',
    50: '$50',
    60: '$40',
    70: '$30',
    80: '$20',
    90: '$10',
    100: '$0',
  };

  const displayValue = 100 - value;

  return(
    <Slider
      reverse
      step={1}
      value={value}
      onChange={onChange}
      marks={marks}
      min={0}
      max={100}
      tooltip={{
        formatter: () => `$${displayValue}`, // Show the displayed value in the tooltip
      }}
    />
  )
}

const JobLevelCheckboxes = () => {
  const onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };

  return(
    <Checkbox.Group onChange={onChange}>
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

  )
}

const LocationCheckboxes = () => {
  const onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };

  return(
    <Checkbox.Group onChange={onChange} className='w-full flex'>
      <div className='flex flex-col'>
        <Checkbox value="ON">Ontario</Checkbox>
          <Checkbox value="QC">Quebec</Checkbox>
          <Checkbox value="USA">United States of America</Checkbox>
      </div>
      <div className='flex flex-col'>
          <Checkbox value="INT">International</Checkbox>
          <Checkbox value="WEST">Western Canada</Checkbox>
          <Checkbox value="GTA">Greater Toronto Area</Checkbox>
      </div>
    </Checkbox.Group>
  )
}

const ProgramSelect = () => {
  return(
    <Select
    showSearch
    style={{
      width: 200,
    }}
    placeholder="Select a Program"
    optionFilterProp="label"
    filterSort={(optionA, optionB) =>
      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
    }
    options={[
      {
        value: '1',
        label: 'Not Identified',
      },
      {
        value: '2',
        label: 'Closed',
      },
      {
        value: '3',
        label: 'Communicated',
      },
      {
        value: '4',
        label: 'Identified',
      },
      {
        value: '5',
        label: 'Resolved',
      },
      {
        value: '6',
        label: 'Cancelled',
      },
    ]}
  />
)
}
