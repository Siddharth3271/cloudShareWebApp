import React, { useState } from 'react'
import {Copy, Download, Eye, FileIcon, FileText, Globe, Image, Lock, Music, Video,Trash} from "lucide-react"
const FileCard = ({file,onDelete,onTogglePublic, onDownload,onShareLink}) => {
    const [showActions, setShowActions]=useState(false);

    const getFileIcon=(file)=>{
        const extension=file.name.split('.').pop().toLowerCase();
        if(['jpg','jpeg','png','gif','svg','webp'].includes(extension)){
            return <Image size={24} classname="text-orange-500"/>
        }
        if(['mp4','webm','mov','mkv','avi'].includes(extension)){
            return <Video size={24} classname="text-blue-500"/>
        }
        if(['mp3','wav','ogg','m4a','flac'].includes(extension)){
            return <Music size={24} classname="text-green-500"/>
        }
        if(['pdf','doc','docx','docx','rtf','xlsx','xls','pptx','ppt'].includes(extension)){
            return <FileText size={24} classname="text-amber-500"/>
        }

        return <FileIcon size={24} className='text-amber-800'/>
    }

    const formatfileSize=(bytes)=>{
        if(bytes<1024) return bytes+' B';

        else if(bytes<1048576) return (bytes/1024).toFixed(1)+' KB';
        else return (bytes/1048576).toFixed(1)+' MB';
    }

    const formatDate=(dateString)=>{
        const date=new Date(dateString);
        return date.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})
    }

  return (
    <div 
    onMouseEnter={()=>setShowActions(true)} 
    onMouseLeave={()=>setShowActions(false)}
    className='relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200'>
        {/* File preview */}
      <div className='h-32 bg-gradient-to-br from-black-50 to-orange-100 flex items-center justify-center p-4'>
        {getFileIcon(file)}
      </div>

      {/* Public/Private Badge */}
      <div className='absolute top-2 right-2'>
        <div className={`rounded-full p-1.5 ${file.isPublic ? 'bg-green-200':'bg-gray-100'}`} title={file.isPublic ? "Public":"Private"}>
            {file.isPublic? (
                <Globe size={14} className='text-green-700'/>
            ):(
                <Lock size={14} className='text-gray-600'/>
            )}
        </div>
      </div>

        {/*File info */}
        <div className="p-4">
            <div className="flex justify-between items-start">
                <div className="overflow-hidden">
                    <h3 title={file.info} className="font-medium text-gray-900 truncate">
                        {file.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                        {formatfileSize(file.size)} . {formatDate(file.uploadedAt)}
                    </p>
                </div>
            </div>
        </div>

        {/*Action Buttons */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${showActions ? 'opacity-100':'opacity-0'}`}>
            <div className='flex gap-3 wi-full justify-center'>
                {file.isPublic && (
                    <button 
                    onClick={()=>onShareLink(file.id)}
                    title='Share Link'
                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-red-500 hover:text-red-600 cursor-pointer"><Copy size={18}/></button>
                )}

                {file.isPublic && (
                    <a href={`/file/${file.id}`} title='View File' target='_blank' rel='noreferrer' className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-gray-700 hover:text-gray-900'><Eye size={18}/></a>
                )}

                <button 
                onClick={()=>onDownload(file)}
                title='Download'
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-green-600 hover:text-green-800 cursor-pointer"><Download/></button>
                
                <button 
                onClick={()=>onTogglePublic(file)}
                title={file.isPublic ? "Make Private":"Make Public"}
                className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-amber-600 hover:text-amber-800 cursor-pointer'>{file.isPublic ? <Lock size={18}/>:<Globe size={18}/>}
                </button>

                <button 
                title='Delete'
                onClick={()=>onDelete(file.id)}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-red-600 hover:text-red-700 cursor-pointer">
                    <Trash size={18}/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default FileCard
