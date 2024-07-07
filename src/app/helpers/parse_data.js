export function getCachedData(extensionId) {
  return new Promise((resolve, reject) => {
    if (!chrome.runtime) {
      reject("chrome.runtime is not available");
      return;
    }

    chrome.runtime.sendMessage(
      extensionId,
      { action: "getCachedData" },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      }
    );
  });
}


export const stopwords = [
    "a", "about", "and", "achievements", "abilities", "across", "always", "and", "an", "as", "at", "be", "been", "being",
    "by", "clients", "conduct", "develop", "developing", "duties", "driven", "experience", "for", "from", "goals", "growth", "have", 
    "highly", "in", "is", "it", "knowledge", "management", "meet", "most", "need", "objectives", "on", "our", 
    "out", "over", "of", "partners", "perform", "professional", "projects", "proven", "real-time", "recognize", 
    "research", "results", "role", "skills", "sourcing", "speaking", "specific", "supporting", "team", "the",
    "to", "understanding", "up", "we", "while", "with", "work"
];

export function removeStopwords(text, stopwords) {
    const words = text.split(/\s+/);
    const filteredWords = words.filter(word => !stopwords.includes(word.toLowerCase()));
    return filteredWords.join(' ');
}

export function extractText(input) {
    // Remove all text between angle brackets, this removes html text like <li> and <br>
    const regex = /<[^>]*>/g;
    const cleanedInput = input.replace(regex, '');
  
    // Remove extra whitespace and newlines
    const cleanedText = cleanedInput.replace(/\s+/g, ' ').trim();
  
    return cleanedText;
}

export function parsePostings(data) {
    var jobList = []
    Object.keys(data).forEach(key => {
        if (key.toLowerCase().includes('job') && key !== "VIEWED_JOBS") {
            var jobDetails = {}
            var jobId = data[key]["jobId"];
            var jobPostingInfo = data[key].pageData?.["Job Posting Information"];
            var postingListData = data[key]["postingListData"];
            
            if (jobPostingInfo) { 

                var company = postingListData["company"] || ""
                var responsibilities = jobPostingInfo["Job Responsibilities"] || ""
                var summary = jobPostingInfo["Job Summary"] || ""
                var skills = jobPostingInfo["Required Skills"] || ""
                var jobDescription = responsibilities + "\n" + summary + "\n" + skills
                jobDescription = extractText(jobDescription)
                jobDescription = removeStopwords(jobDescription, stopwords)

                var compensation = jobPostingInfo["Compensation and Benefits"] || "0";
                var formattedCompensation = formatCompensation(compensation);
                var jobTitle = jobPostingInfo["Job Title"] || "N/A";
                var targetedDegrees = jobPostingInfo["Targeted Degrees and Disciplines"] || "N/A";
                var formattedTargetedDegrees = extractThemesFromPrograms(targetedDegrees); // Pass targetedDegrees
                var region = jobPostingInfo["Region"]
                var mappedRegion = mapRegion(region) || "N/A"
                
                jobDetails.jobId = jobId
                jobDetails.company = company
                jobDetails.jobTitle = jobTitle
                jobDetails.jobDescription = jobDescription
                jobDetails.compensation = formattedCompensation
                jobDetails.targetedDegrees = formattedTargetedDegrees
                jobDetails.mappedRegion = mappedRegion
                jobList.push(jobDetails)
                // console.log(`Job Id: ${jobId}, Job Title: ${jobTitle}, Job Description: ${jobDescription}, Compensation: ${formattedCompensation},
                //     Targeted Degrees and Disciplines: ${formattedTargetedDegrees}, Region: ${mappedRegion}`);
            } else {
                console.log(`IGNORE THIS POSTING`);
            }
        }
    });
    return jobList
}

export function formatCompensation(compensation) {
    const regex = /\$(\d{1,3}(?:,\d{3})*)\b/g;
    const matches = compensation.match(regex);

    if (!matches || matches.length === 0) {
        return 0;
    }

    const numbers = matches.map(match => {
        return match.replace(/\$|,/g, '');
    });

    const numericValues = numbers.map(numStr => parseFloat(numStr));

    const sum = numericValues.reduce((total, val) => total + val, 0);
    let meanSalary = sum / numericValues.length;

    if (meanSalary >= 200 && meanSalary < 30000) {
        meanSalary = meanSalary * 12 / 52 / 37.5; // Assume monthly rate
    } else if (meanSalary >= 30000) {
        meanSalary = meanSalary / 52 / 37.5; // Assume yearly rate
    }

    return meanSalary;
}


function extractThemesFromPrograms(htmlContent) {
    const themes = [];
    const regex = /- Theme - (.+?)\s*<br>/g;
    let match;

    while ((match = regex.exec(htmlContent)) !== null) {
        themes.push(match[1].trim());
    }

    return themes;
}

function mapRegion(region) {
    var gtaRegions = ["Toronto", "York", "Halton", "Durham", "Peel"]
    if(region) {
        if(gtaRegions.some(theme => region.includes(theme))) {
            return "Greater Toronto Area"
        }
        else if(region.includes("ON")) {
            return "Ontario"
        }
        else if(region.includes("QC")) {
            return "Quebec"
        }
        else if(region.includes("USA")) {
            return "United States of America"
        }
        else {
            return region
        }
    }
    else {
        return undefined
    }

}
