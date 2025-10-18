import React from 'react'
import { BrowserRouter, Routes ,Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import MyFiles from './pages/MyFiles'
import Transactions from './pages/Transactions'
import Landing from './pages/Landing';      
import Upload from './pages/Upload';         
import PublicFileView from './pages/PublicFileView';         
import Subscription from './pages/Subscription';
import { RedirectToSignIn, SignedOut, SignedIn } from '@clerk/clerk-react'
import {Toaster} from "react-hot-toast"
import {UserCreditsProvider } from './context/UserCreditsContext'
const App = () => {
  return (
    <UserCreditsProvider>
    <BrowserRouter>
    <Toaster/>
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/dashboard" element={
          <>
            <SignedIn><Dashboard/></SignedIn>
            <SignedOut><RedirectToSignIn/></SignedOut>
          </>

      } />
      <Route path="/upload" element={
        <>
            <SignedIn><Upload/></SignedIn>
            <SignedOut><RedirectToSignIn/></SignedOut>
          </>
      } />
      <Route path='/my-files' element={
        <>
            <SignedIn><MyFiles/></SignedIn>
            <SignedOut><RedirectToSignIn/></SignedOut>
          </>
      }/>
      <Route path='/subscriptions' element={
        <>
            <SignedIn><Subscription/></SignedIn>
            <SignedOut><RedirectToSignIn/></SignedOut>
          </>
      }/>
      <Route path='/transactions' element={
        <>
            <SignedIn><Transactions/></SignedIn>
            <SignedOut><RedirectToSignIn/></SignedOut>
          </>
      }/>
      <Route path="file/:fileId" element={
        <>
        <PublicFileView/>
        </>
      }/>
      <Route path="/*" element={<RedirectToSignIn/>}/>

    </Routes>
    </BrowserRouter>
    </UserCreditsProvider>
  )
}

export default App
