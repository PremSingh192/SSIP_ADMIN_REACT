import React from 'react'

import { useState } from 'react'
import {
  CCol,
  CRow,
  CToast,
  CToastHeader,
  CToastBody,
  CAlert,
} from '@coreui/react'
import axios from 'axios'
import { useEffect } from 'react'
import useAPI from 'src/global_function/useApi'
import { useNavigate } from 'react-router-dom'
import moment from 'moment';


export default function Teacherview() {

  // usestate to opne and close the model  
  const navigation = useNavigate()  
  const [StoredTokens, CallAPI] = useAPI()
  const [TimeTables, setTimeTables] = useState(null)
  const [lecture_list,set_lecture_list]  = useState(null)
  const load_teacher_timetable = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/get_timetable_for_teacher',
      'get',
      headers,
      null,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj.response
      const data = response.data.data.map((branch,index)=>{
          const lecture_obj = {
            branch_name: branch.branch_name,
            branch_slug: branch.slug
          }
          const lecture_list = []
           branch.semesters.map((semester, index) => {
            semester.divisions.map((division, idnex) => {
                if (division.timetable.schedule.lectures.length > 0) {
                    division.timetable.schedule.lectures.map((lecture, index) => {
                       
                      lecture_list.push({...lecture, division_name: division.division_name,semester:semester.no,schedule: division.timetable.schedule.day});

                    });
                } else {
                    
                }
            });
            
        });
        
        return ({...lecture_obj,lectures:lecture_list})
        

      })
      // console.log(data)
      setTimeTables(data)
    }
    else {
      alert(response_obj.errorMessage.message)
    }
  }

  // const get_location_permission = ()=>{
  //   if(!premission_state){
  //     if(navigator.geolocation){
  //       navigator.geolocation.getCurrentPosition((position)=>{
  //         set_permission_state(true)
  //       })
  //     }
  //   }
    
  // }

  const create_Session = async (lecture_slug) => {
    navigation(`/teacher/session?slug=${lecture_slug}`)
  }

  useEffect(() => {
    // get_location_permission()
      load_teacher_timetable()
  }, [])

  return (
    <>
          <CRow className="mb-3">
        <CCol>
          {
            TimeTables && TimeTables.map((branch, index) => {
              return (
                <div key={index}>
                    <CAlert
                      className="m-0 rounded-0 w-100 p-2 d-flex justify-content-between align-items-center mb-2"
                      color="primary"
                      visible={true}
                    >
                      
                      {branch.branch_name}
                    </CAlert>
                    {
                        branch.lectures.length > 0 ?  (
                          branch.lectures.map((lecture,index)=>{
                            return (
                              <div key={index} className='d-flex justify-content-center w-100'>
                              <CRow className="flex-column w-100" style={{ padding: '0' }}>
                                <CCol className="d-flex align-items-center flex-column w-100" key={index}>
                                  <div className="w-100 rounded-0 border-0">
                                    <div className="" style={{ paddingBottom: "0px" }}>
                                      <div className="justify-content-center w-100">
                                        <CToast
                                          key={index}
                                          autohide={false}
                                          visible={true}
                                          className={`mb-3 mt-3 w-100 ${lecture.is_proxy ? "border-red-700" : ""}`}
                                        >
                                          <CToastHeader className="d-flex flex-wrap justify-content-sm-between justify-content-center mx-2">
                                            
                                              <div className={`w-100 fw-bold text-center`}>
                                                <div>
                                                  <small className='mx-2 my-2'>

                                                    Semester: {lecture.semester} | Division : {lecture.division_name}
                                                  </small>
                                                </div>
                                                {
                                                  lecture.is_proxy ? (<div>
                                                    <small className='mx-2 my-2'>
                                                      {lecture.is_proxy ? "Proxied from " : ""}
                                                      {lecture.link ? lecture.link.from_lecture.subject.subject_name : ""}
                                                    </small>
                                                  </div>) : (null)
                                                }
                                                

                                                <hr className='w-100 my-2'></hr>

                                              </div>
                                            
                                            <div className="fw-bold mx-2">
                                              {lecture.subject.subject_name.charAt(0).toUpperCase() + lecture.subject.subject_name.slice(1)}
                                            </div>
                                            <small className='mx-2 my-2'>
                                              {lecture.type.toUpperCase()}
                                            </small>
                                            <small className='mx-2 my-2'>
                                              {moment(lecture.start_time.slice(0, 5), 'HH:mm').format('h:mm A')} |{' '}
                                              {moment(lecture.end_time.slice(0, 5), 'HH:mm').format('h:mm A')}
                                            </small>
                                          </CToastHeader>
                                          <CToastBody className="d-flex flex-row flex-wrap justify-content-center">
                                            <CRow className='w-100 align-items-center'>
                                              <CCol className='text-sm-start text-center col-12 col-sm-4 col-lg-4 col-md-4'>
                                                Prof - {lecture.teacher.charAt(0).toUpperCase() + lecture.teacher.slice(1)}
                                              </CCol>
                                              <CCol className=' text-sm-end col-12 col-sm-4 col-lg-4 col-md-4'>
                                                <div className='w-100 text-center'>
                                                  {' '}
                                                  {lecture.batches.map((batch, index) => (
                                                    <span key={index}>
                                                      {batch.batch_name.toUpperCase()}
                                                      {index < lecture.batches.length - 1 &&
                                                        ', '}
                                                    </span>
                                                  ))}{' '}
                                                </div>
                                              </CCol>
                                              <CCol className='text-sm-end text-center col-12 col-sm-4 col-lg-4 col-md-4'>
                                                {lecture.classroom.class_name.charAt(0).toUpperCase() + lecture.classroom.class_name.slice(1)}
                                                {' '}
                                              </CCol>
                                            </CRow>

                                            <div className='d-flex w-100'>
                                              <div className='w-100'>
                                                {lecture.session.active === "pre" && <button className='btn btn-outline-primary w-100 mt-3' value={lecture.slug} onClick={(e) => create_Session(e.target.value)}>Start Session</button>}
                                                {lecture.session.active === "ongoing" && <button className='btn btn-outline-primary w-100 mt-3' value={lecture.slug} onClick={(e) => create_Session(e.target.value)}>Ongoing Session</button>}
                                                {lecture.session.active === "post" && <button disabled={true} className='btn btn-outline-secondary w-100 mt-3'>Session Ended</button>}
                                              </div>
                                            </div>
                                            <div>
                                            </div>
                                          </CToastBody>
                                        </CToast>
                                      </div>
                                    </div>
                                  </div>
                                </CCol>
                              </CRow>
                            </div>
                            )
                          })
                        ) : (<div className='d-flex w-100 justify-content-center'>
                        <div className='alert alert-warning w-75 my-2 text-center '>
                  <span className=''>No lecture sessions are there for this branch</span>
                </div>
                    </div>)
                    }
                </div>
              )
              
            })
          }

        </CCol>

      </CRow>
  
    </>
  )
}
