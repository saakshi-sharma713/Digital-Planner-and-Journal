import React, { useState } from "react";
import axios from "axios";

const TextEditor = () => {
  const [file, setFile] = useState(null);

  const uploadCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Journal_media");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dlke9irsu/auto/upload",
      formData
    );

    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("File before upload:", file);

    if (!file) {
      alert("Select file first");
      return;
    }

    const url = await uploadCloudinary(file);

    const response = await axios.post(`http://localhost:8990/journal/add`,{
      
    })
    console.log("Uploaded URL:", url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button type="submit">Upload</button>
    </form>
  );
};

export default TextEditor;