import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Grid, List } from "lucide-react";
const MyFiles=()=>{
  const [files,setFiles]=useState([]);
  const [viewMode,setViewMode]=useState("list");
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
          <Grid size={24} onClick={()=>setViewMode("grid")} className={``}/>
        </div>
      </div>
      </div>
    </DashboardLayout>
    )
}
export default MyFiles;