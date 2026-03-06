import React from 'react'
import { Toaster } from 'react-hot-toast'
import Dashboard from './Dashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SchoolManagement from './SchoolManagement'
import StaffDirectory from './StaffDirectory'
import SyllabusTracking from './SyllabusTracking'
import InfrastructureFacilities from './InfrastructureFacilities'
import Examinations from './Examinations'
import AttendanceReports from './AttendanceReports'
import PerformanceAnalytics from './PerformanceAnalytics'
import Achivements from './Achivements'
import Complaints from './Complaints'
import AcademicCalender from './AcademicCalender'
import ReportsNDownloads from './ReportsNDownloads'
import Settings from './Settings'
import Layout from './Layout'
import Login from './Login'
import SignUp from './SignUp'
import Error from './Error'


const App = () => {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/error' element={<Error />}></Route>
          <Route element={<Layout />}>
          <Route path='/' element={<Dashboard />}></Route>
          <Route path='/schoolmanagement' element={<SchoolManagement />}></Route>
          <Route path='/staffdirectory' element={<StaffDirectory />}></Route>
          <Route path='/syllabustracking' element={<SyllabusTracking />}></Route>
          <Route path='/infrafacilities' element={<InfrastructureFacilities />}></Route>
          <Route path='/exams' element={<Examinations />}></Route>
          <Route path='/attendance' element={<AttendanceReports />}></Route>
          <Route path='/performaceanalytics' element={<PerformanceAnalytics />}></Route>
          <Route path='/calender' element={<AcademicCalender />}></Route>
          <Route path='/achievements' element={<Achivements />}></Route>
          <Route path='/complaints' element={<Complaints />}></Route>
          <Route path='/reports' element={<ReportsNDownloads />}></Route>
          <Route path='/settings' element={<Settings />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
