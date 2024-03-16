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

const StudentDashboard = () => {
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
      '/manage/get_timetable_for_student',
      'get',
      headers,
      null,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj.response
      console.log(response.data.data)
      setTimeTables(response.data.data)
    }
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
          console.log(positions.coords);       
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
            { lecture_slug: lecture_slug,latitude:latitude,longitude:longitude},
            null,
          )
          if (response_obj.error === false) {
            const response = response_obj.response
            if (response.data.data === true)
            {
              btn.disabled = true;btn.classList.add('btn-outline-secondary')
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
                      <span className="mx-2">Semester - {timetable.division.semester.no}</span>
                      <span className="mx-2">Division - {timetable.division.division_name}</span>
                    </CCardHeader>
                    <CCardBody>
                      <>
                        <CRow className="text-center justify-content-center">
                          <CCol className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="">
                              <div>
                                <CRow className="flex-column" style={{ padding: '0' }}>
                                  {timetable && timetable.schedules.length > 0 ? (
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
                                            <div className="" style={{ paddingBottom: '0px' }}>
                                              <div className="justify-content-center w-100">
                                                {item.lectures.length > 0 ? (
                                                  item.lectures.map((lecture, index) => (
                                                    <CToast
                                                      key={index}
                                                      autohide={false}
                                                      visible={true}
                                                      className={`mb-3 mt-3 w-100 ${
                                                        lecture.is_proxy ? 'border-red-700' : ''
                                                      }`}
                                                    >
                                                      <CToastHeader className="d-flex flex-wrap justify-content-sm-between justify-content-center">
                                                        {lecture.is_proxy ? (
                                                          <div className={`w-100 fw-bold`}>
                                                            <small className="mx-2 my-2">
                                                              {lecture.is_proxy
                                                                ? 'Proxied from '
                                                                : ''}
                                                              {lecture.link
                                                                ? lecture.link.from_lecture.subject
                                                                    .subject_name
                                                                : ''}
                                                            </small>
                                                            <hr className="w-100 my-2"></hr>
                                                          </div>
                                                        ) : null}
                                                        <div className="fw-bold mx-2 my-2">
                                                          {lecture.subject.subject_name
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            lecture.subject.subject_name.slice(1)}
                                                        </div>
                                                        <small className="mx-2 my-2">
                                                          {lecture.type.toUpperCase()}
                                                        </small>
                                                        <small className="mx-2 my-2">
                                                          {moment(
                                                            lecture.start_time.slice(0, 5),
                                                            'HH:mm',
                                                          ).format('h:mm A')}{' '}
                                                          |{' '}
                                                          {moment(
                                                            lecture.end_time.slice(0, 5),
                                                            'HH:mm',
                                                          ).format('h:mm A')}
                                                        </small>
                                                      </CToastHeader>
                                                      <CToastBody className="d-flex flex-row flex-wrap justify-content-center justify-content-md-between">
                                                        <CRow className="w-100 align-items-center">
                                                          <CCol className="text-sm-start col-12 col-sm-4 col-lg-4 col-md-4">
                                                            Prof -{' '}
                                                            {lecture.teacher
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                              lecture.teacher.slice(1)}{' '}
                                                          </CCol>
                                                          <CCol className=" text-sm-end col-12 col-sm-4 col-lg-4 col-md-4">
                                                            <div className="w-100 text-center">
                                                              {' '}
                                                              {lecture.batches.map(
                                                                (batch, index) => (
                                                                  <span key={index}>
                                                                    {batch.batch_name.toUpperCase()}
                                                                    {index <
                                                                      lecture.batches.length - 1 &&
                                                                      ', '}
                                                                  </span>
                                                                ),
                                                              )}{' '}
                                                            </div>
                                                          </CCol>
                                                          <CCol className="text-sm-end col-12 col-sm-4 col-lg-4 col-md-4">
                                                            {lecture.classroom.class_name
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                              lecture.classroom.class_name.slice(
                                                                1,
                                                              )}{' '}
                                                          </CCol>
                                                        </CRow>
                                                        <div className="d-flex flex-wrap w-100">
                                                          <div className="w-100 mt-3">
                                                            {(lecture.session.active === 'pre' ||
                                                              lecture.session.active ===
                                                                'ongoing') && (
                                                              <button
                                                                className={`btn ${
                                                                  lecture.session.attendances
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
                                                          <hr></hr>
                                                        </div>
                                                      </CToastBody>
                                                    </CToast>
                                                  ))
                                                ) : (
                                                  <CToast
                                                    className="w-100 d-flex justify-content-center mt-3"
                                                    autohide={false}
                                                    visible={true}
                                                  >
                                                    <CToastBody>No Lectures Today</CToastBody>
                                                  </CToast>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </CCol>
                                      </>
                                    ))
                                  ) : (
                                    <CToast
                                      className="w-100 d-flex justify-content-center mt-3"
                                      autohide={false}
                                      visible={true}
                                    >
                                      <CToastBody>No Lectures Today</CToastBody>
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
              <CToastBody>
                <p>No Timetable Found</p>
              </CToastBody>
            </CToast>
          )}
        </CCol>
      </CRow>
    </>
  )
}

export default StudentDashboard
