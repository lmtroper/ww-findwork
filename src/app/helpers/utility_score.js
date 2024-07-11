import { textCosineSimilarity } from "./cosine_similarity";
import { skillScore } from "./skills_score";

export function assignUtility(jobData, userPreferences, skills, resume) {
    console.log(`Resume: ${resume}`);
    if (jobData.length === 0) {
        console.error("jobData is empty");
        return [];
    }

    // Step 1: Calculate max compensation
    const maxCompensation = jobData.reduce((max, job) => {
        return job.compensation > max ? job.compensation : max;
    }, jobData[0].compensation);

    // Step 2: Calculate max cosine similarity
    const maxCosineSimilarity = jobData.reduce((max, job) => {
        const similarity = textCosineSimilarity(job.jobDescription, resume);
        return similarity > max ? similarity : max;
    }, textCosineSimilarity(jobData[0].jobDescription, resume));

    // Step 3: Map job data and calculate scaled cosine similarity and utility score
    const jobDataUtility = jobData.map(job => {
        const jobDescription = job.jobDescription;
        const cosineSimilarity = textCosineSimilarity(jobDescription, resume);
        const scaledCosineSimilarity = 4 * (cosineSimilarity / maxCosineSimilarity); // Scale cosine similarity
 
        const locationScore = (userPreferences.locationWeight / 10) * (userPreferences.locationPreference.includes(job.mappedRegion) ? 1 : 0);
        const workTermRatingScore = (userPreferences.workTermRatingWeight / 10) * job.averageWorkTermRating
        const salaryScore = ((userPreferences.salaryWeight / 10) * (job.compensation / maxCompensation + (userPreferences.salaryPreference / maxCompensation)));
        const programScore = (userPreferences.programWeight / 10) * 
                    (job.targetedDegrees.some(deg => 
                        userPreferences.programPreference.includes(deg)) ? 1 : 0);
        const skScore = skillScore(skills, jobDescription);

        // Calculate utility score using scaled cosine similarity and other scores
        const utilityScore = locationScore + workTermRatingScore + salaryScore + programScore + scaledCosineSimilarity + skScore;
        const scaledUtilityScore = (utilityScore / (10)).toFixed(2)
        const url = `https://waterlooworks.uwaterloo.ca/myAccount/graduating/jobs.htm?ck_jobid=${job.jobId}`;
        console.log(`Job ID: ${job.jobId}, Utility Score: ${utilityScore.toFixed(2)}, Cosine Similarity: ${scaledCosineSimilarity}, Location Score: ${locationScore}, Salary Score: ${salaryScore.toFixed(2)}, Program Score: ${programScore}, Skill Score: ${skScore}, WTR Score: ${workTermRatingScore}`);

        return { ...job, utilityScore, scaledUtilityScore, url };
    });

    // Step 4: Sort jobDataUtility by utilityScore descending
    jobDataUtility.sort((a, b) => b.utilityScore - a.utilityScore);

    return jobDataUtility;
}
