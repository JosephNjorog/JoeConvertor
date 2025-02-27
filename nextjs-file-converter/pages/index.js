import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function Home() {
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setConvertedFile(response.data.fileUrl);
    } catch (error) {
      console.error("Conversion failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-primary">JPEG to Vector Converter</h1>
      <p className="text-gray mt-2">Upload a JPEG image to convert it into SVG, EPS, PDF, or AI format.</p>

      <input
        type="file"
        accept="image/jpeg"
        onChange={(e) => setFile(e.target.files[0])}
        className="mt-4 p-2 border border-gray rounded bg-dark text-light"
      />

      <button
        onClick={handleUpload}
        className="mt-4 bg-primary text-light px-4 py-2 rounded"
      >
        {loading ? "Converting..." : "Convert Image"}
      </button>

      {convertedFile && (
        <div className="mt-4">
          <p className="text-light">Download your vector file:</p>
          <a href={convertedFile} download className="text-primary underline">
            Download Converted File
          </a>
        </div>
      )}
    </Layout>
  );
}
