import React, { useState,useEffect,useRef } from 'react';
import { Search, Download, Trash2, Plus, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from "../context/AuthContext";
import { NavLink,useNavigate } from 'react-router-dom';
import DocCard from '../components/DocCard';


export default function Documents() {

    const { user ,loading} = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [uploading, setUploading] = useState(false);
    const [docs, setDocs] = useState([]);
    const fileInputRef = useRef(null); 
    const [file,setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loadingDocs, setLoadingDocs] = useState(true);

      useEffect(()=>{
        if(loading) return;
              if(!user){
                  navigate("/"); 
                  return ;
              }        
          },[ user,loading, navigate])

      useEffect(()=>{
        if(! user?.email) return;

        const fetchDocuments = async()=>{
          setLoadingDocs(true);

          try {
            const response =await fetch(`http://localhost:3000/docs/${user.email}`);
            const data =await response.json();

            if(data.success){
              setDocs(data.documents)
            }
          } catch (error) {
            console.error('Error fetching documents:', error);
          }
          finally{
            setLoadingDocs(false);
          }
        }



        fetchDocuments();

      },[user?.email, success])

  const handleFileChange = (e)=>{
    setFile(e.target.files[0]);
    setError("");
  }
  const handleFileUpload = () => {
        fileInputRef.current?.click();
    };


  const handleUpload = async(e)=>{

        e.preventDefault();

        if(!file) {
          setError("Please upload a file");
          return;
        }

        if (!description.trim()) {
                setError('Please provide a file description');
                return;
            }

        setUploading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileDescription', description);

        try {
            

            const response = await fetch(`http://localhost:3000/docs/${user.email}`,{
              method:"POST",
              body: formData,
            })

            const data = await response.json();

            if(data.success){
              setSuccess("Doc uploaded successfully");
              setFile(null);
              setDescription('');
              if (fileInputRef.current) {
              fileInputRef.current.value = '';

          }

          setTimeout(() => setSuccess(''), 3000);
            }
            else{
              setError(data.message || 'Upload failed');
            }

          

        } catch (error) {
            console.error('Error uploading file:', error);
            setError('Upload failed. Please try again.');
        }finally{
            setUploading(false);
        }

  }

  const filteredDocuments = docs.filter((doc) =>
  doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  doc.fileDescription.toLowerCase().includes(searchQuery.toLowerCase())
);


  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50">

        <input 
        ref={fileInputRef}
        type='file'
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        onChange={handleFileChange}
        className="hidden"
        />

      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Vehicle Documents</h1>
            <p className="text-gray-600 text-lg">Store your vehicle documents and access them seamlessly</p>
          </div>
          <button 
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          onClick={handleFileUpload}
            disabled={uploading}
          >
            
            <Plus size={20} />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </div>

      {file && !uploading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-xl font-bold mb-4">Upload Document</h3>
                            
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Selected File:</p>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-gray-500">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter document description..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm mb-4">{error}</p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={handleUpload}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                                >
                                    Upload
                                </button>
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setDescription('');
                                        setError('');
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
      )}


      <div className="max-w-7xl mx-auto px-8 py-8">

      {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
          </div>
      )}

      {error && !file && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
          </div>
      )}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {filteredDocuments.length} {filteredDocuments.length === 1 ? 'Document' : 'Documents'}
        </h2>
        {loadingDocs ? (
          <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading documents...</p>
          </div>
            ) : (
                <div className='flex flex-wrap gap-x-11 gap-y-7'>
                    {filteredDocuments.length === 0 ? (
                <div className="w-full text-center py-12">
                    <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">
                          {searchQuery ? 'No documents match your search' : 'No documents uploaded yet'}
                      </p>
                </div>
            ) : (
                filteredDocuments.map((doc) => (
                    <DocCard 
                        date={doc.date} 
                        name={doc.fileName} 
                        description={doc.fileDescription} 
                        size={doc.fileSize}
                    />
                ))
            )}
        
      </div>
    )}
    </div>
    </div>
    </>
  );
}