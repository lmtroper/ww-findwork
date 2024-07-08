const functions = require("firebase-functions");
const admin = require("firebase-admin");
const pdfParse = require("pdf-parse");
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.extractTextFromPDF = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const { base64 } = req.body;
      const buffer = Buffer.from(base64, 'base64');
      const pdfData = await pdfParse(buffer);

      const text = pdfData.text;
      const userId = req.headers['x-user-id']; // Pass the user ID in the request headers
      const userDocRef = admin.firestore().collection("users").doc(userId);

      await userDocRef.update({ resume: text });

      return res.status(200).send({ text });
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
});
