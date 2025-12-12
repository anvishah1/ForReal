import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFile = useCallback((file) => {
    setError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  // Submit to API
  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Prediction failed');
      }
      
      const result = await response.json();
      
      // Navigate to results with data
      navigate('/results', { 
        state: { 
          result,
          imagePreview: preview,
          filename: selectedFile.name
        } 
      });
      
    } catch (err) {
      setError(err.message || 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear selection
  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Upload Image
            </h1>
            <p className="text-white/50 text-lg max-w-md mx-auto">
              Drop your image below and let our AI determine if it's real or AI-generated
            </p>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative group cursor-pointer
              rounded-2xl border-2 border-dashed transition-all duration-300
              ${isDragging 
                ? 'border-purple-500 bg-purple-500/10' 
                : selectedFile 
                  ? 'border-white/20 bg-white/5' 
                  : 'border-white/10 hover:border-purple-500/50 hover:bg-white/[0.02]'
              }
            `}
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />

            {/* Content */}
            <div className="p-8 sm:p-12">
              {preview ? (
                // Image Preview
                <div className="space-y-6">
                  <div className="relative mx-auto max-w-md overflow-hidden rounded-xl">
                    {/* Glow */}
                    <div className="absolute -inset-2 bg-gradient-to-br from-purple-600/20 to-blue-500/20 rounded-2xl blur-xl opacity-60"></div>
                    
                    <img
                      src={preview}
                      alt="Preview"
                      className="relative w-full h-auto max-h-[400px] object-contain rounded-xl"
                    />
                  </div>
                  
                  {/* File info */}
                  <div className="flex items-center justify-center gap-3 text-white/60">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm truncate max-w-xs">{selectedFile?.name}</span>
                    <span className="text-xs text-white/40">
                      ({(selectedFile?.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              ) : (
                // Upload prompt
                <div className="text-center py-8">
                  <div className={`
                    w-20 h-20 mx-auto mb-6 rounded-2xl 
                    bg-gradient-to-br from-purple-600/20 to-purple-600/5 
                    border border-purple-500/20
                    flex items-center justify-center
                    transition-transform duration-300 group-hover:scale-110
                  `}>
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  
                  <h3 className="font-syne font-semibold text-xl mb-2">
                    {isDragging ? 'Drop it here!' : 'Drag & drop your image'}
                  </h3>
                  <p className="text-white/40 text-sm mb-4">
                    or click to browse from your device
                  </p>
                  <p className="text-white/30 text-xs">
                    Supports: PNG, JPG, JPEG, GIF, WebP • Max 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          {selectedFile && (
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="px-8 py-4 rounded-xl font-syne font-semibold
                  bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="group px-8 py-4 rounded-xl font-syne font-semibold
                  bg-purple-600 hover:bg-purple-700
                  transition-all duration-300 hover:-translate-y-1 
                  hover:shadow-[0_20px_40px_rgba(147,51,234,0.3)]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                  flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Analyze Image
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer accent */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
    </div>
  );
}
