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
import moment from 'moment'
import { BarController } from 'chart.js'

const StudentDashboard = () => {
  const [StoredTokens, CallAPI] = useAPI()
  const [TimeTables, setTimeTables] = useState(null)
  const [permission_state, set_permission_state]  = useState(false)

  const load_teacher_timetable = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/get_timetable_for_student',
      'get',
      headers,
      null,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj.response
      setTimeTables(response.data.data)
    }
  }

  const get_location_permission = ()=>{    
    // if(!permission_state){
      navigator.permissions.query({ name: "geolocation" }).then((result) => {        
        if (result.state === "granted") {          
            set_permission_state(true)
        } else if (result.state === "prompt") {
          navigator.geolocation.getCurrentPosition((position)=>{
            set_permission_state(true)
          })
        } else if (result.state === "denied") {
          navigator.geolocation.getCurrentPosition((position)=>{
            set_permission_state(true)
          })
        }
        result.addEventListener("change", () => {
          if (result.state === "granted") {          
            set_permission_state(true)
          } else if (result.state === "prompt") {          
              set_permission_state(false)            
          } else if (result.state === "denied") {            
              set_permission_state(false)            
          }
        });
      });          
    // }
  }
  const mark_attendance = async (btn, lecture_slug) => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }
    try {
      navigator.geolocation.getCurrentPosition(
        async (positions) => {
          const latitude = positions.coords.latitude
          const longitude = positions.coords.longitude
          const headers = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': true,
          }
          const axiosInstance = axios.create()
          const response_obj = await CallAPI(
            StoredTokens,
            axiosInstance,
            '/manage/session/mark_attendance_for_student/',
            'post',
            headers,
            { lecture_slug: lecture_slug, latitude: latitude, longitude: longitude },
            null,
          )
          if (response_obj.error === false) {
            const response = response_obj.response
            if (response.data.data === true) {
              btn.disabled = true; btn.classList.add('btn-outline-secondary')
              alert('your Attendance Marked successfully')
            }
          } else {
            if (response_obj.errorMessage.code == 100) {
              btn.disabled = true
              btn.classList.add('btn-outline-secondary')
            }
            alert(response_obj.errorMessage.message)
          }
        },
        (error) => {
          alert(error.message)
          return
        },
        { enableHighAccuracy: true, maximumAge: 0 },
      )
    } catch (error) {
      alert('Location services are not available, Please enable it from you browser')
      return
    }
  }

  useEffect(() => {    
    get_location_permission()
    load_teacher_timetable()
  }, [permission_state])

  return (
    <>
      {
        permission_state ? (<CRow className="mb-3">
        <CCol>
          {
            TimeTables && TimeTables.map((branch, index) => {
              return branch.timetables.map((timetable, index) => {
                
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
                      timetable.schedule ? (timetable.schedule.lectures.length > 0 ? (
                        timetable.schedule.lectures.map((lecture, index) => {
                          return (
                            <div key={index}>
                            <CRow className="flex-column" style={{ padding: '0' }}>
                              <CCol className="d-flex align-items-center flex-column" key={index}>
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
                                          
                                            <div className={`w-100 fw-bold text-center text-sm-start text-md-start text-lg-start`}>
                                              <div>
                                                
                                                <small className='mx-2 my-2'>

                                                  Semester: {timetable.division.semester.no} | Division : {timetable.division.division_name}
                                                </small>
                                              </div>
                                              <div>
                                                {
                                                  lecture.is_proxy  ? (
                                                    <small className='mx-2 my-2'>
                                                  {lecture.is_proxy ? "Proxied from " : ""}
                                                  {lecture.link ? lecture.link.from_lecture.subject.subject_name : ""}
                                                </small>
                                                  ) : (null)
                                                }
                                                
                                              </div>

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
                                              {(lecture.session.active === 'pre' ||
                                                lecture.session.active ===
                                                'ongoing') && (
                                                  <button
                                                    className={`btn ${lecture.session.attendances
                                                      .is_present
                                                      ? 'btn-outline-secondary'
                                                      : 'btn-outline-primary'
                                                      } w-100 mt-3`}
                                                    value={lecture.slug}
                                                    onClick={(e) =>
                                                      !lecture.session.attendances
                                                        .is_present &&
                                                      mark_attendance(
                                                        e.target,
                                                        e.target.value,
                                                      )
                                                    }
                                                    disabled={
                                                      lecture.session.attendances
                                                        .is_present
                                                    }
                                                  >
                                                    Mark Your Attendance
                                                  </button>
                                                )}
                                              {lecture.session.active === 'post' && (
                                                <button
                                                  className="btn btn-outline-secondary w-100 mt-3"
                                                  disabled={true}
                                                >
                                                  Session Ended
                                                </button>
                                              )}
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
                  </div>)) : (<div className='d-flex justify-content-center w-full my-3'><CToast className='w-100' animation={false} autohide={false} visible={true}>
                      <CToastBody className='text-center w-full'>There is no lecture today....</CToastBody>
                    </CToast></div>)
                      

                    }
                  </div>

                )
              })
            })
          }
        </CCol>
      </CRow>) : (<iframe width="100%" height="315" src="https://www.youtube.com/embed/ERhEIsEXG50?si=i9ez0hxneFCuAe6E" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>)
      }

      
    </>
  )
}

export default StudentDashboard
