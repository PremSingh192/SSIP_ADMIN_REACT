import React from 'react'

import { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
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
      setTimeTables(response.data.data)
    }
    else{
      alert(response_obj.errorMessage.message)
    }
  }


  const create_Session = async(lecture_slug)=>{
    navigation(`/teacher/session?slug=${lecture_slug}`)
  }

  useEffect(() => {
    load_teacher_timetable()
  }, [])

  return (
    <>
      <CRow className="mb-3">
      <CCol>
        {TimeTables ? (
          TimeTables.map((timetable, index) => (
            <CRow key={index} className="text-center mb-5 justify-content-center">
              <CCol className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <CCard className="">
                  <CCardHeader className="d-flex justify-content-center justify-content-sm-between flex-wrap">
                    <span className='mx-2'>Semester - {timetable.division.semester.no}</span>
                    <span  className='mx-2'>Division - {timetable.division.division_name}</span>
                  </CCardHeader>
                  <CCardBody>
                    <>
                      <CRow className="text-center justify-content-center">
                        <CCol className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="">
                            <div>
                              <CRow className="flex-column" style={{ padding: '0' }}>
                                {timetable && timetable.schedules.length > 0? (
                                  timetable.schedules.map((item, index) => (
                                    <>
                                      <CCol
                                        className="d-flex align-items-center flex-column"
                                        key={index}
                                      >
                                        <CAlert
                                          className="m-0 rounded-0 w-100 p-2 d-flex justify-content-between align-items-center"
                                          color="primary"
                                          visible={true}
                                          
                                        >
                                          {item.day.toUpperCase()}
                                        </CAlert>
                                        <div className="w-100  rounded-0 border-0">
                                          <div className="" style={{paddingBottom:"0px"}}>
                                            <div className="justify-content-center w-100">
                                              {item.lectures.length > 0 ? (
                                                item.lectures.map((lecture, index) => (
                                                  <CToast
                                                    key={index}
                                                    autohide={false}
                                                    visible={true}
                                                    className={`mb-3 mt-3 w-100 ${lecture.is_proxy ? "border-red-700" : ""}`}
                                                    
                                                  >
                                                    <CToastHeader className="d-flex flex-wrap justify-content-sm-between justify-content-center">
                                                    {lecture.is_proxy ? (
                                              <div className={`w-100 fw-bold`}>
                                              <small className='mx-2 my-2'>
                                                {lecture.is_proxy ? "Proxied from ":""}
                                                {lecture.link ? lecture.link.from_lecture.subject.subject_name : ""}
                                              </small>
                                              <hr className='w-100 my-2'></hr>
                                              </div>
                                            ):(null)}
                                                      <div className="fw-bold mx-2">
                                                        {lecture.subject.subject_name.charAt(0).toUpperCase() + lecture.subject.subject_name.slice(1)}
                                                      </div>
                                                        <small className='mx-2 my-2'>
                                                          {lecture.type.toUpperCase()}
                                                        </small>
                                                      <small className='mx-2 my-2'>
                                                        {moment(lecture.start_time.slice(0,5), 'HH:mm').format('h:mm A')} |{' '}
                                                        {moment(lecture.end_time.slice(0,5), 'HH:mm').format('h:mm A')}
                                                      </small>
                                                    </CToastHeader>
                                                    <CToastBody className="d-flex flex-row flex-wrap justify-content-center">
                                                      <CRow className='w-100 align-items-center'>
                                                        <CCol className='text-sm-start col-12 col-sm-4 col-lg-4 col-md-4'>
                                                          
                                                        Prof - {lecture.teacher.charAt(0).toUpperCase() + lecture.teacher.slice(1)}{' '}
                                                         
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
                                                        <CCol className='text-sm-end col-12 col-sm-4 col-lg-4 col-md-4'>
                                                        
                                                        {lecture.classroom.class_name.charAt(0).toUpperCase() + lecture.classroom.class_name.slice(1)}
                                                      {' '}
                                                        </CCol>
                                                      </CRow>
                                                      <hr className='w-100'></hr>
                                                      <div className='d-flex w-100'>
                                                        <div className='w-100'>
                                                          {
                                                            lecture.session.active === "pre" && <button className='btn btn-outline-primary w-100 mt-3' value={lecture.slug} onClick={(e)=> create_Session(e.target.value)}>Start Session</button>
                                                          }
                                                          {
                                                            lecture.session.active === "ongoing" && <button className='btn btn-outline-primary w-100 mt-3' value={lecture.slug} onClick={(e)=> create_Session(e.target.value)}>Ongoing Session</button>
                                                          }
                                                          {lecture.session.active === "post" && <button disabled={true} className='btn btn-outline-secondary w-100 mt-3'>Session Ended</button>

                                                          }
                                                        </div>
                                                      </div>
                                                      
                                                      
                                                      <div>
                                                        <hr></hr>
                                                      </div>
                                                      
                                                    </CToastBody>
                                                  </CToast>
                                                ))
                                              ) : (
                                                <CToast className="w-100 d-flex justify-content-center mt-3" autohide={false} visible={true}>
                                                  <CToastBody>You have no lectures today!!</CToastBody>
                                                </CToast>
                                                    
                                                  
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </CCol>
                                    </>
                                  ))
                                ) : (
                                  <CToast className="w-100 d-flex justify-content-center mt-3" autohide={false} visible={true}>
                                                  <CToastBody>You have no lectures today!!</CToastBody>
                                                </CToast>
                                )}
                              </CRow>
                            </div>
                          </div>
                        </CCol>
                      </CRow>
                    </>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          ))
        ) : (
          <CToast animation={false} autohide={false} visible={true} className="mx-auto w-100">
            <CToastHeader className="bg-dark d-flex justify-content-center">
              <img
                src="/static/media/smartroll_logo.a3c3e21d0b4a56919e74.png"
                width={100}
                alt="SmartRoll Logo"
              />
            </CToastHeader>
          </CToast>
        )}
        </CCol>
      
      </CRow>
    </>
  )
}
