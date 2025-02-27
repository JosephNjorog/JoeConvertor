import { IncomingForm } from "formidable";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import cloudinary from "cloudinary";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = new IncomingForm();
  form.uploadDir = "./uploads"; // Temporary folder
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    const inputFile = files.image.filepath;
    const outputFile = path.join("uploads", `${files.image.newFilename}.svg`);

    // Convert image using Potrace
    exec(`potrace -s ${inputFile} -o ${outputFile}`, async (error) => {
      if (error) return res.status(500).json({ error: "Conversion failed" });

      // Upload converted file to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(outputFile, {
        folder: "vector_files",
        resource_type: "raw",
      });

      // Clean up local files
      fs.unlinkSync(inputFile);
      fs.unlinkSync(outputFile);

      res.json({ fileUrl: uploadResponse.secure_url });
    });
  });
}
