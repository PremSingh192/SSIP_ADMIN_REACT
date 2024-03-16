import React from 'react'
import LectureHistory from './views/teacher/LectureHistory'
import AdditionalFeatures from './views/teacher/AdditionalFeatures'


const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))


// Base
const Timetable = React.lazy(() => import('./views/timetable/Timetable'))
const Subject = React.lazy(() => import('./views/subject/Subject'))
const Teacherview = React.lazy(() => import('./views/teacher/Teacherview'));
const Addstudent = React.lazy(() => import('./views/student_controller/Addstudent'));
const AttendanceHistory = React.lazy(() => import('./views/AttendanceHistory/AttendanceHistory'));
const StudentDashboard =  React.lazy(() => import('./views/student_controller/StudentDashboard'))
const Sessionmanage =  React.lazy(() => import('./views/teacher/Sessionmanage'))
const Logout = React.lazy(()=> import('./views/pages/logout/Logout'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))
const Teacher = React.lazy(()=> import('./views/teacher/Teacher'))
const Breadcrumbnav = React.lazy(()=> import('./views/breadcrum/Breadcrumbnav'))
const TeacherSidebar = React.lazy(()=> import('./views/teacher/TeacherSidebar'))
// Buttons





















const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  
  
  
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  
  
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/manage-teachers',name:'Teacher',element:Teacher},
  { path: '/breadcrumb',name:'Breadcrumbnav',element:Breadcrumbnav},
  { path: '/TeacherSidebar',name:'TeacherSidebar',element:TeacherSidebar},
  { path: '/logout',name:'Logout',element:Logout},
  { path: '/timetable',name:'Timetable',element:Timetable},
  { path: '/subject',name:'Subject',element:Subject},
  { path: '/addstudent',name:'AddStudent',element:Addstudent},
  { path: '/attendance-history',name:'attendance-history',element:AttendanceHistory},
  { path: '/teacher/dashboard',name:'Teacherview',element:Teacherview},
  { path: '/studentdashboard',name:'StudentDashboard',element:StudentDashboard}  ,
  { path: '/teacher/session',name:'Sessionmanage',element:Sessionmanage}  ,
  { path: '/teacher/lectures/history',name:'LectureHistory',element:LectureHistory},
  { path: '/teacher/lectures/additional-features',name:'LectureHistory',element:AdditionalFeatures}  
]

 export default routes;