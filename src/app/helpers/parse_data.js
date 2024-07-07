

export function parsePostings(data) {
    Object.keys(data).forEach(key => {
        if (key.toLowerCase().includes('job') && key !== "VIEWED_JOBS") {
            var jobId = data[key]["jobId"];
            var jobPostingInfo = data[key].pageData?.["Job Posting Information"];
            
            if (jobPostingInfo) {
                var compensation = jobPostingInfo["Compensation and Benefits"] || "0";
                var formattedCompensation = formatCompensation(compensation);
                var jobTitle = jobPostingInfo["Job Title"] || "N/A";
                var targetedDegrees = jobPostingInfo["Targeted Degrees and Disciplines"] || "N/A";
                var formattedTargetedDegrees = extractThemesFromPrograms(targetedDegrees); // Pass targetedDegrees
                var region = jobPostingInfo["Region"]
                var mappedRegion = mapRegion(region) || "N/A"

                console.log(`Job Id: ${jobId}`);
                console.log(`Job Title: ${jobTitle}, Compensation: ${formattedCompensation},
                    Targeted Degrees and Disciplines: ${formattedTargetedDegrees}`);
                console.log(`Region: ${mappedRegion}`)
            } else {
                console.log(`Job Title: N/A, Compensation: 0`);
            }
        }
    });
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
