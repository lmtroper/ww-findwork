# FindWork - Intelligent Decision Support System (IDSS)

FindWork is an Intelligent Decision Support System (IDSS) designed to simplify the job search process on WaterlooWorks by helping students quickly identify the most relevant job postings. It aims to reduce the time spent on reviewing and shortlisting jobs by presenting users with opportunities that match their preferences.

## Table of Contents
- [Video Demo](#video-demo)
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Model Description](#model-description)
- [Data Processing](#data-processing)

## Video Demo


## Overview
With 1500+ job postings in each typical WaterlooWorks cycle, finding relevant jobs can be overwhelming. FindWork helps users:
- Filter jobs based on factors like role type, salary, location, level, skills, and work term ratings.
- Save time by ranking job postings according to personal preferences using a utility-based model.

## Features
- Real-time job posting data collected using a WaterlooWorks scraper.
- Customizable job ranking based on user preferences and resume similarity.
- Frontend interface with Next.js for a responsive user experience.
- Backend in JavaScript with Firestore for secure data storage and retrieval.

## Tech Stack
- **Frontend**: Next.js
- **Backend**: JavaScript
- **Database**: Firestore (Firebase)

## Installation
To run FindWork locally:
1. Clone this repository.
   ```
   git clone https://github.com/yourusername/FindWork.git
    ```
2. Navigate to the project directory.
   ```
   cd FindWork
   ```
3. Install the required dependencies.
  ```
   npm install
   ```
4. Run the app locally.
    ```
   npm run dev
   ```
5. Access the application at http://localhost:3000.

## Usage
1. **Sign Up**: Register and sign in using Firebase authentication.
2. **Set Preferences**: Customize your job search by setting job preferences, skills, and uploading a resume.
3. **Find Jobs**: The IDSS model ranks and displays relevant job postings based on your criteria.
4. **Shortlist & Save**: Save jobs that align with your preferences for easy application access.

## Model Description
The ranking model uses a linear combination of factors to score each job posting, considering:
- **Location**: Whether the job location matches the user’s preference.
- **Job Level**: Entry, junior, or senior level.
- **Skills Match**: Ratio of required job skills that match the user’s skillset.
- **Compensation**: Standardized and scaled hourly salary.
- **Rating**: Company ratings based on previous work terms.
- **Similarity**: Cosine similarity between job description and user’s resume.

## Data Processing
1. **Parsing**: Job data is scraped and parsed to clean and standardize fields.
2. **Scoring**: Missing data is handled with default scores, allowing flexibility in ranking.
3. **Real-Time Updates**: Data is live and automatically refreshed to provide the most up-to-date job postings.



