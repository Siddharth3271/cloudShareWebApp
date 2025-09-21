import React from 'react'
import { BrowserRouter, Routes ,Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import MyFiles from './pages/MyFiles'
import Transactions from './pages/Transactions'
import Landing from './pages/Landing';      
import Upload from './pages/Upload';         
import Subscription from './pages/Subscription';
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/upload" element={<Upload/>} />
      <Route path='/my-files' element={<MyFiles/>}/>
      <Route path='/subscriptions' element={<Subscription/>}/>
      <Route path='/transactions' element={<Transactions/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
