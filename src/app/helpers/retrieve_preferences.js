// firebaseFunctions.js
import { db } from "../../../firebase"; // Ensure correct path to your firebaseConfig.js
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export function getUserEmail() {
    const auth = getAuth();
    const user = auth.currentUser;
    return user ? user.email : null;
}


export async function retrieveUserPreferences(email) {
    console.log(db)
    const collectionRef = collection(db, "users"); // Replace with your actual collection name
    try {
        const q = query(collectionRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
        console.log("No matching documents.");
        return null;
        }

        const userPreferences = {};

        querySnapshot.forEach((doc) => {
        const data = doc.data();
        userPreferences.displayName = data.displayName || "N/A";
        userPreferences.email = data.email || "N/A";
        userPreferences.jobLevel = data.jobLevel || [];
        userPreferences.jobLevelWeight = data.jobLevelWeight || 0;
        userPreferences.locationPreference = data.locationPreference || [];
        userPreferences.locationWeight = data.locationWeight || 0;
        userPreferences.programPreference = data.programPreference || "N/A";
        userPreferences.programWeight = data.programWeight || 0;
        userPreferences.salaryPreference = data.salaryPreference || 0;
        userPreferences.salaryWeight = data.salaryWeight || 0;
        userPreferences.skills = data.skills || "";
        });

        return userPreferences;
    } catch (error) {
        console.error("Error retrieving user preferences: ", error);
        return null;
    }
}
