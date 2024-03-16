import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDrop,
  cilPencil,
  cilAccountLogout,
  cilCalendar,
  cilNotes,
  cilPeople,
  cilLibraryBuilding,
  cilSchool,
  cilClock
  //cilSpeedometer,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'
import { useContext } from 'react'






const _nav = {
  admin_role:[
    {
      component: CNavTitle,
      name: 'ADMNISTRATION',
    },
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/',
      icon: <CIcon icon={cilLibraryBuilding} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Subject',
      to: '/subject',    
      icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Teachers',
      to: '/manage-teachers',
      icon: <CIcon icon={cilSchool} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Add Student',
      to: '/addstudent',
      icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Timetable',
      to: '/timetable',
      icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Attendance History',
      to: '/attendance-history',
      icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Logout',
      to: '/logout',    
      icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
    },  
      
  ],
  teacher_role:[
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/teacher/dashboard',
      icon: <CIcon icon={cilLibraryBuilding} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'LectureHistory',
      to: '/teacher/lectures/history',    
      icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Additional Features',
      to: '/teacher/lectures/additional-features',    
      icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Logout',
      to: '/logout',    
      icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
    },
  ],
  student_role:[
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/studentdashboard',
      icon: <CIcon icon={cilLibraryBuilding} customClassName="nav-icon" />,
    }, 
    {
      component: CNavItem,
      name: 'Logout',
      to: '/logout',    
      icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
    },
  ]
}

export default _nav
