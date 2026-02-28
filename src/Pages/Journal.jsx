import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import GridLines from '../Components/GridLines';
import Doodle1 from '../Components/Doodles/Doodle1';
import Doodle2 from '../Components/Doodles/Doodle2';
import Doodle3 from '../Components/Doodles/Doodle3';
import { Link } from 'react-router-dom';
import axios from "axios"
import toast from 'react-hot-toast';
export default function Journal(){
    const [file, setFile] = useState(null);
    const [notes, setNotes] = useState('');
    const [loading,setLoading] = useState(false)
     const token = localStorage.getItem("token");
    // Custom toolbar with image & video options
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [
                {
                    color: [
                        '#000000', // black
                        '#4B5563', // gray
                        '#F472B6', // pink
                        '#F9A8D4', // light pink
                        '#FBBF24', // warm yellow
                        '#34D399', // mint green
                        '#60A5FA', // soft blue
                        '#A78BFA', // lavender
                        '#FFFFFF'  // white
                    ]
                },
                {
                    background: [
                        '#FFFFFF', // white
                        '#FCE7F3', // blush background
                        '#FEF3C7', // pale yellow
                        '#D1FAE5', // mint background
                        '#DBEAFE', // light blue
                        '#EDE9FE', // lavender background
                        '#F3F4F6'  // light gray
                    ]
                }
            ],
            ['link', 'image', 'video'],

        ],
    };
   const uploadCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Journal_media");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dlke9irsu/auto/upload",
      formData
    );

    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!notes && !file) {
      toast.error("Add notes or upload a media file first!");
      return;
    }

    setLoading(true);

    try {
      let media = null;

      if (file) {
        const uploaded = await uploadCloudinary(file);
        media = { url: uploaded.secure_url, type: uploaded.resource_type === 'image' ? 'image' : 'video' };
      }

      const res = await axios.post(
        "http://localhost:8990/journal/add",
        { content: notes, media: media ? [media] : [] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Journal saved successfully!");
      console.log(res.data)
      setNotes('');
      setFile(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to save journal!");
    } finally {
      setLoading(false);
    }
  };
    return (
        <div className="relative min-h-screen bg-blue-300 p-6">
            {/* Grid background */}
        
            <Doodle1/>
            <Doodle3/>

            
            <div className="relative max-w-3xl mx-auto bg-white/80 rounded-xl shadow-lg p-6 z-10">
           <div className="flex items-center justify-between mb-6">
  <h1
    className="text-3xl font-bold text-gray-800"
    style={{ fontFamily: 'Patrick Hand, cursive' }}
  >
    Journal
  </h1>

  <Link
    to="/journals"
    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition font-semibold"
    style={{ fontFamily: 'Patrick Hand, cursive' }}
  >
    View Journals
  </Link>
</div>
 
                <ReactQuill
                    value={notes}
                    onChange={setNotes}
                    modules={modules}
                    placeholder="Write your journal entry..."
                    className="bg-white rounded-md shadow-sm md:h-[400px]"
                />
                <div className="flex gap-4 mt-15">
                    <button className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition font-"
                        style={{ fontFamily: 'Patrick Hand, cursive' }}
                        onClick={(e)=>{handleSubmit(e)}}>
                       {loading ? "Saving" : "Save"} 
                    </button>
                    <Link
                        style={{ fontFamily: 'Patrick Hand, cursive' }}
                        to="/home"
                        className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition text-center"
                    >
                        Back to Home page
                    </Link>
                    <button className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition font-"
                    onChange={(e) => setFile(e.target.files[0])}
                        style={{ fontFamily: 'Patrick Hand, cursive' }}>
                        <label>
                            Upload Media
                            <input type="file" accept="image/*,video/*" className='hidden' />
                        </label>


                    </button>

                </div>

            </div>
        </div>
    );
}