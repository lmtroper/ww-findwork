export function skillScore(skills, jobDescription) {
    let score = 0;
    const jobDescriptionArray = jobDescription.toLowerCase().split(" ");
    
    for (const skill of skills) {
        if (jobDescriptionArray.includes(skill.toLowerCase())) {
            score += 1;
        }
    }
    
    // Normalize the skills score
    return skills.length > 0 ? (score * 2)/ (skills.length) : 0;
}