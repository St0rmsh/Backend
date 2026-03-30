import { useState } from "react";
import { uploadVideo } from "../services/ytapi.service";
import { Input, Button } from "../components/UI/Index";

export const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file || !title) return alert("Missing fields");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);

    try {
      await uploadVideo(formData, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        }
      });

      alert("Upload Success 🚀");
      setFile(null);
      setTitle("");
      setProgress(0);

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">

      <h1 className="text-2xl font-bold">Upload Video</h1>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setFile(e.dataTransfer.files[0]);
        }}
        className="border-2 border-dashed p-10 text-center rounded-xl cursor-pointer"
      >
        {file ? file.name : "Drag & Drop Video Here"}
      </div>

      <Input
        placeholder="Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {progress > 0 && (
        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="bg-green-500 h-2"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <Button onClick={handleUpload}>
        Upload
      </Button>

    </div>
  );
};
