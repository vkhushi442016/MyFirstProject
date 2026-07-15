import React, { useEffect } from 'react'
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
import PrincipleDashboard from './Principal/PrincipalDashboard'
import PrincipalStaffDirectory from './Principal/PrincipalStaffDirectory'
import Syllabus from './Syllabus'
import PrincipalSyllabusUpdate from './Principal/PrincipalSyllabusUpdate'
import PrincipalFacilities from './Principal/PrincipalStudents'
import UpdatedSchoolManagement from './UpdatedSchoolManagement'
import ProtectedRoute from './ProtectedRoute'
import TeacherDashboard from './TeacherComponents/TeacherDashboard'
import Students from './TeacherComponents/Students'
import TeacherSyllabusUpdate from './TeacherComponents/TeacherSyllabusUpdate'
import PrincipalInfrastructure from './Principal/PrincipalInfrastructure'
import AdminLogin from './UI/AdminLogin'
import initSocket from './UI/NotificationAlert'
import StudentsAttendance from './TeacherComponents/StudentsAttendance'
import useStore from './common/store/store'
import socket from './UI/socket'

const App = () => {
  const userRole = useStore((state) => state.role)
  const dise_code = useStore((state) => state.dise_code)

  useEffect(() => {
    initSocket();
  }, []);

  // Register role into socket rooms
  useEffect(() => {

    if (userRole && socket.connected) {

      console.log("REGISTER ROLE FROM APP:", userRole, dise_code);

      socket.emit("registerRole", {
        role: userRole.toLowerCase(),
        dise_code
      });

    }

  }, [userRole, dise_code]);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/error' element={<Error />}></Route>
          <Route path='/admin/login' element={<AdminLogin />} />

          <Route element={<ProtectedRoute />} >
            <Route element={<Layout />}>
              <Route path='/' element={<Dashboard />}></Route>
              <Route path='/updated/schoolmanagement' element={<UpdatedSchoolManagement />}></Route>
              <Route path='staffdirectory' element={<StaffDirectory />}></Route>
              <Route path='syllabustracking' element={<SyllabusTracking />}></Route>
              <Route path='syllabus' element={<Syllabus />} />
              <Route path='infrafacilities' element={<InfrastructureFacilities />}></Route>
              <Route path='exams' element={<Examinations />}></Route>
              <Route path='attendance' element={<AttendanceReports />}></Route>
              <Route path='performanceanalytics' element={<PerformanceAnalytics />}></Route>
              <Route path='calendar' element={<AcademicCalender />}></Route>
              <Route path='achievements' element={<Achivements />}></Route>
              <Route path='complaints' element={<Complaints />}></Route>
              <Route path='reports' element={<ReportsNDownloads />}></Route>
              <Route path='settings' element={<Settings />}></Route>

              {/* Principle Side Routing */}
              <Route path='principal/dashboard' element={<PrincipleDashboard />} />
              <Route path='principal/staffdirectory' element={<PrincipalStaffDirectory />} />
              <Route path='/principal/syllabus' element={<PrincipalSyllabusUpdate />} />
              <Route path='/principal/facilities' element={<PrincipalFacilities />} />

              {/* Teacher Side Routing */}
              <Route path="/staff/dashboard" element={<TeacherDashboard />} />
              <Route path="/staff/students" element={<Students />} />
              <Route path="/syllabus/update" element={<TeacherSyllabusUpdate />} />
              <Route path='/principal/infra-info' element={<PrincipalInfrastructure />} />
              <Route path='/students/attendance' element={<StudentsAttendance />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
