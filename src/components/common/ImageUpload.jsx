import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import './ImageUpload.css';

export default function ImageUpload({ onChange, preview }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = e => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onChange(file);
    }
  };

  const handleFileSelect = e => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {preview ? (
          <div className="relative inline-block">
            <img src={preview} alt="preview" className="h-40 w-40 object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              <label htmlFor="image-input" className="text-indigo-600 cursor-pointer font-semibold">
                Click to upload
              </label>
              {' or drag and drop'}
            </p>
            <input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </>
        )}
      </div>
    </div>
  );
}
