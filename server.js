const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdf = require("pdf-parse");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(cors());

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Route for file upload and parsing
app.post("/upload", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Read uploaded PDF file
  const resumePath = `uploads/${req.file.filename}`;

  fs.readFile(resumePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error reading file" });
    }

    pdf(data)
      .then((pdfData) => {
        // Extract text from PDF data
        const text = pdfData.text;
        console.log(text);

        /* // Analyze parsed data to extract relevant information
        const extractedInfo = analyzeResume(text);
        console.log(extractedInfo); */

        fs.unlinkSync(resumePath); // Delete the uploaded file after parsing
        res.json({ message: "File uploaded and parsed successfully" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Error parsing PDF file" });
      });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
