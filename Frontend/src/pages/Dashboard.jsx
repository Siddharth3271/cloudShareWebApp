import React, { useEffect } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { useAuth } from '@clerk/clerk-react'

const Dashboard = () => {
  const {getToken}=useAuth();
  useEffect(()=>{
    const displayToken=async()=>{
      const token = await getToken();
      console.log(token);
    }
    displayToken();
  },[]);
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div>
        Dashboard content
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
