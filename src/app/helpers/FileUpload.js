import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase";

export const uploadFile = async (file, uid) => {
  const storageRef = ref(storage, `resumes/${uid}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

export const readFile = async (fileURL) => {
  const response = await fetch(fileURL);
  console.log(response)
  return response
};