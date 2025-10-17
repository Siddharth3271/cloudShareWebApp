import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Copy, Download, Eye, File, Globe, Grid, List, Lock, Trash, Music, Image, Video,FileText } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from 'axios';
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom";
import FileCard from "../components/FileCard";
import {apiEndPoints} from "../util/apiEndPoints"
import ConfirmationDialog from "../components/ConfirmationDialog";
import LinkShareModal from "../components/LinkShareModel";
const MyFiles=()=>{
  const [files,setFiles]=useState([]);
  const [viewMode,setViewMode]=useState("list");
  const {getToken}=useAuth();
  const navigate= useNavigate();
  const [deleteConfirmation,setDeleteConfirmation]=useState({isOpen:false,fileId:null});
  const [shareModel,setShareModel]=useState({
    isOpen:false,
    fileId:null,
    link:""
  })

  //fetching files from backend
  const fetchFiles=async()=>{
    try{
      const token=await getToken();
      const response= await axios.get(apiEndPoints.FETCH_FILES,{headers:{Authorization:`Bearer ${token}`}})
      if(response.status===200){
        console.log(response.data)
        setFiles(response.data);
      }
    }
    catch(error){
      console.log("Error fetching the files from server: ",error);
      toast.error('Error fetching the files from server: ',error.message);
    }
  }

  const getFileIcon=(file)=>{
        const extension=file.name.split('.').pop().toLowerCase();
        if(['jpg','jpeg','png','gif','svg','webp'].includes(extension)){
            return <Image size={24} className="text-orange-500"/>
        }
        if(['mp4','webm','mov','mkv','avi'].includes(extension)){
            return <Video size={24} className="text-blue-500"/>
        }
        if(['mp3','wav','ogg','m4a','flac'].includes(extension)){
            return <Music size={24} className="text-green-500"/>
        }
        if(['pdf','doc','docx','docx','rtf','xlsx','xls','pptx','ppt'].includes(extension)){
            return <FileText size={24} className="text-amber-500"/>
        }

        return <FileIcon size={24} className='text-amber-800'/>
    }

    //toggling b/w public and private for a file
    const togglePublic = async (fileToUpdate)=>{
      try{
        const token=await getToken();
        await axios.patch(apiEndPoints.TOGGLE_FILE(fileToUpdate.id),{},{headers:{Authorization:`Bearer ${token}`}})
        setFiles(files.map((file)=>file.id===fileToUpdate.id ? {...file,isPublic: !file.isPublic}:file));
      }
      catch(error){
        console.error('Error toggling file status ',error.message)
      }
    }

    //handle file download
    const handleDownload= async (file)=>{
      try{
        const token=await getToken();
        const response=await axios.get(apiEndPoints.DOWNLOAD_FILE(file.id),{},{headers:{Authorization:`Bearer ${token}`},responseType: 'blob'})

        //create a blob url and trigger download
        const url=window.URL.createObjectURL(new Blob([response.data]));
        const link=document.createElement("a");
        link.href=url;
        link.setAttribute("download",file.name)
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);  //cleaning the url
      }
      catch(error){
        console.error('Download Failed ',error);
        toast.error("Error downloading file ",error.message);
      }
    }
    //delete confirmation button closing
    const closeDeleteConfirmation=()=>{
        setDeleteConfirmation({
            isOpen:false,
            fileId:null
        })
    }
    
    //opening delete confirmation
    const openDeleteConfirmation = (fileId) => {
        setDeleteConfirmation({
            isOpen: true,
            fileId
        })
    }

    //opening the share link model
    const openShareModel=(fileId)=>{
      const link=`${window.location.origin}/file/${fileId}`;
      setShareModel({
        isOpen:true,
        fileId,
        link
      })
    }

    //closing the share link model
    const closeShareModel=()=>{
      setShareModel({
        isOpen:false,
        fileId:null,
        link:""
      })
    }

    //handle deleting file after confirmation
    const handleDelete= async ()=>{
      const fileId=deleteConfirmation.fileId;
      if(!fileId) return;
      try{
        const token=await getToken();
        const response=await axios.delete(apiEndPoints.DELETE_FILE(fileId),{headers:{Authorization:`Bearer ${token}`}})
        if(response.status===204){
          setFiles(files.filter((file)=>file.id!==fileId));
          closeDeleteConfirmation();
        }
        else{
          toast.error("Error Deleting the file");
        }
      }
      catch(error){
        console.error('Deleting Failed ',error);
        toast.error("Error Deleting file ",error.message);
      }
    }

  useEffect(()=>{
    fetchFiles();
  },[getToken])

    return (
    <DashboardLayout activeMenu="My Files">
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">My Files {files.length}</h2>
        <div className="flex items-center gap-3">
          <List 
          onClick={()=>setViewMode("list")}
          size={24}
          className={`cursor-pointer transition-colors ${viewMode=='list' ? 'text-blue-600':'text-gray-400 hover:text-gray-600'}`}/>
          <Grid 
          size={24} 
          onClick={()=>setViewMode("grid")} 
          className={`cursor-pointer transition-colors ${viewMode=='grid' ? 'text-blue-600':'text-gray-400 hover:text-gray-600'}`}/>
        </div>
      </div>
      {files.length===0 ? (
        <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
              <File
              className="text-red-300 mb-4"
              size={60}
              />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Files Uploaded Yet</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Start uploading files to see them listed here. you can upload documents, images and other files to share and manage them securely.
              </p>
              <button onClick={()=>navigate("/upload")} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer">Go to Upload</button>
        </div>
      ):viewMode==="grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((file)=>(
            <FileCard
            key={file.id}
            onDelete={openDeleteConfirmation}
            onTogglePublic={togglePublic}
            onDownload={handleDownload}
            onShareLink={openShareModel}
            file={file}/>
          ))}
        </div>
      ):(
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-red-100 border-b border-gray-500">
              <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Uploaded</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sharing</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {files.map((file)=>(
                <tr key={file.id} className="hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file)}
                      {file.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {(file.size/1024).toFixed(1)} KB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        <div className="flex items-center gap-4">
                          <button 
                          onClick={()=>togglePublic(file)}
                          className="flex items-center gap-2 cursor-pointer group"
                          >
                            {file.isPublic ? (
                              <>
                              <Globe size={16} className="text-green-500"/>
                              <span className="group-hover:underline">Public</span>
                              </>
                            ):(

                              <>
                              <Lock size={16} className="text-green-500"/>
                              <span className="group-hover:underline">Private</span>
                              </>
                            )}
                          </button>
                          {file.isPublic && (
                            <button 
                            onClick={()=>openShareModel(file.id)}
                            className="flex items-center gap-2 cursor-pointer text-blue-600">
                              <Copy size={16}/>
                              <span className="group-hover:underline">Share Link</span>
                            </button>
                          )}
                        </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex justify-center">
                                <button
                                onClick={()=>handleDownload(file)}
                                title="Download"
                                className="text-gray-500 hover:text-blue-700">
                                  <Download size={18}/>
                                </button>
                            </div>
                            <div className="flex justify-center">
                              <button 
                              onClick={()=>openDeleteConfirmation(file.id)}
                              title="Delete"
                              className="text-gray-500 hover:text-red-700 hover:cursor-pointer">
                                <Trash size={18}/>
                              </button>
                            </div>
                            <div className="flex justify-center">
                              {file.isPublic ? (
                                <a href={`/file/${file.id}`} title="View File" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-700">
                                  <Eye size={18}/>
                                </a>
                              ):(
                                <span className="w-[18px]"></span>
                              )}
                            </div>
                          </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/*Delete Confirmation Dialog */}
      <ConfirmationDialog
      isOpen={deleteConfirmation.isOpen}
      onClose={closeDeleteConfirmation}
      title="Delete File"
      message="Are you sure to delete this? (This can't be undone)"
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={handleDelete}
      confirmationButtonClass="bg-red-600 hover:bg-red-700"
      />

      {/*Share Link Modal */}
      <LinkShareModal
      isOpen={shareModel.isOpen}
      onClose={closeShareModel}
      link={shareModel.link}
      title="Share File"
      />
      </div>
    </DashboardLayout>
    )
}
export default MyFiles;