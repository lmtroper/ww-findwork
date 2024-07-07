import { textCosineSimilarity } from "./cosine_similarity";

export function assignUtility(jobData, userPreferences, resume) {
    if (jobData.length === 0) {
        console.error("jobData is empty");
        return [];
    }

    const maxCompensation = jobData.reduce((max, job) => {
        return job.compensation > max ? job.compensation : max;
    }, jobData[0].compensation);

    const jobDataUtility = jobData.map(job => {
        const jobDescription = job.jobDescription;
        const cosineSimilarity = textCosineSimilarity(jobDescription, resume);

        const locationScore = () => {
            return userPreferences.locationPreference.includes(job.mappedRegion) ? 1 : 0;
        };

        const salaryScore = () => {
            return job.compensation / maxCompensation;
        };

        const programScore = () => {
            return userPreferences.programPreference.includes(job.targetedDegrees) ? 1 : 0;
        };

        const utilityScore = (userPreferences.locationWeight / 10) * locationScore() +
            ((userPreferences.salaryWeight / 10) * (userPreferences.salaryPreference / maxCompensation)) * salaryScore() +
            (userPreferences.programWeight / 10) * programScore() +
            4 * cosineSimilarity;

        const url = `https://waterlooworks.uwaterloo.ca/myAccount/graduating/jobs.htm?ck_jobid=${job.jobId}`
        return { ...job, utilityScore, url };
    });

    jobDataUtility.sort((a,b) => a.utilityScore < b.utilityScore ? 1 : -1);
    // console.log(jobDataUtility)
    return jobDataUtility;
}
