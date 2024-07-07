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

export async function retrieveUserResume(email) {
    const collectionRef = collection(db, "users");
    const snapshot = await collectionRef.where("email", "==", email).get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }
    let userResume = "";
    snapshot.forEach((doc) => {
        const data = doc.data;
        userResume = data.resume
    })

    return userResume
}
