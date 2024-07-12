// firebaseFunctions.js
import { db } from "../../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection } from "firebase/firestore";

export async function retrieveUserPreferences(uid) {
    try {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            const userPreferences = {
                displayName: userData.displayName || 'N/A',
                email: userData.email || 'N/A',
                jobLevel: userData.jobLevel || [],
                jobLevelWeight: userData.jobLevelWeight || 0,
                locationPreference: userData.locationPreference || [],
                locationWeight: userData.locationWeight || 0,
                programPreference: userData.programPreference || 'N/A',
                programWeight: userData.programWeight || 0,
                salaryPreference: userData.salaryPreference || 0,
                salaryWeight: userData.salaryWeight || 0,
                workTermRatingWeight: userData.workterm_rating_weight || 8,
                programPreference: userData.programPreference || [],
                skills: userData.skills || '',
            };

            return userPreferences;
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving user preferences:', error);
        return null;
    }
}

export async function retrieveUserResume(uid) {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    if(userDoc.exists()) {
        const userData = userDoc.data()
        const userResume = userData.resume_content
        return userResume
    }
    else {
        return null
    }
}

export async function retrieveUserSkills(uid) {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    if(userDoc.exists()) {
        const userData = userDoc.data()
        const userSkills = userData.skills
        return userSkills
    }
    else {
        return null
    }
}
