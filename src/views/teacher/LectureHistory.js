import React, { useEffect, useState } from 'react'
import { 
    CRow,
    CCol,
    CCardHeader,
    CCard,
    CCardBody,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CFormInput
} from '@coreui/react'
import useAPI from 'src/global_function/useApi'
import axios from 'axios'
import '../../css/tailwind.css'
import Subject from '../subject/Subject'
import Session_history from './Session_history'
import moment from 'moment';

const LectureHistory = () => {
const [StoredTokens, CallAPI] = useAPI()
const [subjects,SetSubjects] = useState(null)
const [lecture,setLecture] = useState(null)
const [FilterLecture,setFilterLecture] = useState(null)
const [attendances, setAttendances] = useState(null)
const [visible , setVisible] = useState(false)
const [session_data, setSessionData] = useState(null)

const load_subjects_of_teacher = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/get_subjects_of_teacher',
      'get',
      headers,
      null,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj.response
      SetSubjects(response.data.data)  
       
    }
    else{
      alert(response_obj.errorMessage.message)
    }
  }
  const load_lectures = async (subject_slug) => {
    const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
      const axiosInstance = axios.create()
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        '/manage/get_lecture_sessions_for_teacher',
        'get',
        headers,
        null,
        {subject_slug:subject_slug},
      )
      if (response_obj.error === false) {
        const response = response_obj.response        
        setLecture(response.data.data)     
      }
      else{
        alert(response_obj.errorMessage.message)
      }
  }

  const search_lecture = (day)=>{
    // console.log(day);
    const filteredData = lecture.filter(item => item.session.some(session => session.day === day));
    
    if(filteredData.length > 0) {
      setFilterLecture(filteredData)
    }
    else{
      setFilterLecture(null)
    }
    
  }


  const get_session_data = async(session_id)=>{
    const headers = {
      'Content-Type':"application/json",
      'ngrok-skip-browser-warning':true
    }

    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      `/manage/session/get_session_data_for_export/${session_id}`,
      'get',
      headers,
      null,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj.response
      setAttendances(response.data.data.marked_attendances)
      setSessionData(response.data.data)
      setVisible(true)
    }
    else{
      alert(response_obj.errorMessage.message)
    }
  }
  useEffect(() => {
    load_subjects_of_teacher()
  },[])
  return (
    <>
      {
        subjects ? (<>
            <div className="mb-3">
              <label className="form-label">Select A Subject</label>
              <select className="form-select" aria-label="Default select example" required  onChange={(e) => {load_lectures(e.target.value)}}>
                <option value="">....</option>
                {subjects && subjects.map((item,index) => (
                    <option key={index} value={item.slug}>{item.subject_name}</option>
                ))}               
              </select>
        </div>
        
        {
          FilterLecture ? (
<CRow>
            <CCol xs>
              <CCard className="mb-4">
                <CCardHeader>
                  <div className='d-flex flex-wrap justify-between'>
                    <div>
                      <strong>Subject Attendance History</strong>
                    </div>
                    <div>
                      <div className='d-flex'>
                        <div>
                          <input type="date" id="validationCustom01"  required  onChange={(e)=>{search_lecture(e.target.value)}}/>
                        </div>
                        <div className='mx-2'>  
                        </div>
                      </div>
                    
                    
                    </div>
                  </div>
                </CCardHeader>
                <CCardBody>

                  <CTable align="middle" className="mb-0 border text-center" hover responsive>
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell>classroom</CTableHeaderCell>
                        <CTableHeaderCell>Lecture Type</CTableHeaderCell>
                        <CTableHeaderCell>Date</CTableHeaderCell>
                        <CTableHeaderCell>Time</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {FilterLecture.map((lecture, index) => (
                        lecture.session.map((session,index)=>(
                          <CTableRow v-for="item in tableItems" key={index} onClick={(e) => get_session_data(session.session_id)}>
                          <CTableDataCell style={{fontSize:'0.8rem'}}>
                            <div>{lecture.classroom}</div>   
                          </CTableDataCell>
                          <CTableDataCell style={{fontSize:'0.8rem'}}>
                            <div>{lecture.type.charAt(0).toUpperCase() + lecture.type.slice(1)}</div>   
                          </CTableDataCell>
                          <CTableDataCell style={{fontSize:'0.6rem'}}>
                            <div>{session.day}</div>   
                          </CTableDataCell>
                          <CTableDataCell style={{fontSize:'0.5rem'}}>
                            <span className='d-block'>{moment(lecture.start_time.slice(0, 5), 'HH:mm').format('h:mm A')} </span>
                            <span className='d-block'>To</span> 
                            <span className='d-block'>{moment(lecture.end_time.slice(0, 5), 'HH:mm').format('h:mm A')}</span>
                          </CTableDataCell>
                        </CTableRow>
                        ))
                        
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          ) : ( lecture ? (<CRow>
            <CCol xs>
              <CCard className="mb-4">
                <CCardHeader>
                  <div className='d-flex flex-wrap justify-between'>
                    <div>
                      <strong>Subject Attendance History</strong>
                    </div>
                    <div>
                      <div className='d-flex'>
                        <div>
                          <input type="date" id="validationCustom01"  required  onChange={(e)=>{search_lecture(e.target.value)}}/>
                        </div>
                        <div className='mx-2'>
                        
                        </div>
                      </div>
                    
                    
                    </div>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <CTable align="middle" className="mb-0 border text-center" hover responsive>
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell>Class</CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Date</CTableHeaderCell>
                        <CTableHeaderCell>Time</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      
                    { lecture.length > 0  ? (
                      lecture.map((lecture, index) => (
                        lecture.session.map((session,index)=>(
                          <CTableRow v-for="item in tableItems" key={index} onClick={(e) => get_session_data(session.session_id)}>
                          <CTableDataCell style={{fontSize:'0.8rem'}}>
                            <div>{lecture.classroom}</div>   
                          </CTableDataCell>
                          <CTableDataCell style={{fontSize:'0.8rem'}}>
                            <div>{lecture.type.charAt(0).toUpperCase() + lecture.type.slice(1)}</div>   
                          </CTableDataCell>
                          <CTableDataCell style={{fontSize:'0.6rem'}}>
                            <div>{session.day}</div>   
                          </CTableDataCell>
                          <CTableDataCell style={{fontSize:'0.5rem'}}>
                            <span className='d-block'>{moment(lecture.start_time.slice(0, 5), 'HH:mm').format('h:mm A')} </span>
                            <span className='d-block'>To</span> 
                            <span className='d-block'>{moment(lecture.end_time.slice(0, 5), 'HH:mm').format('h:mm A')}</span>
                          </CTableDataCell>
                        </CTableRow>
                        )) 
                        
                        
                      ))
                    ) 
                    :(
                      <CTableRow v-for="item in tableItems">
                        <CTableDataCell colSpan={4}>
                          <div className='alert alert-primary w-100 my-2'>
                            <span className=''>No Lecture Sessions Are There for This Subject</span>
                          </div>
                        
                        </CTableDataCell>
                      </CTableRow>
                    )
                    }
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>) : (null)
          )
        }

        </>) : (null)
      }
       {
        attendances && <Session_history visible={visible} setVisible={setVisible} attendances={attendances} session_data={session_data}></Session_history>
       } 
       
       {
         !lecture &&<>
            <div className='d-flex justify-content-center'>
                <img style={{maxWidth:'70%',height:'auto'}} src='/svgs/lecturehistory.svg'></img>
            </div>
        </>
       }
        
    </>
  )
}

export default LectureHistory