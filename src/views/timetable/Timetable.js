import React,{ useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormSelect,
  CToast,
  CToastBody,
  CToastHeader,  
  CAlert,
} from '@coreui/react'
import axios from 'axios'
import { useEffect } from 'react'
import useAPI from 'src/global_function/useApi'
import SetLecture from './SetLecture'
import SetProxy from './SetProxy'

const Timetable = () => {


  const [Semesters, setSemesters] = useState(null)
  const [division, set_division] = useState(null)
  const [schedule, set_sechedule] = useState(null)
  const [StoredTokens, CallAPI] = useAPI()
  const [time_table, set_time_table] = useState(null)
  const [visible, setVisible] = useState(false)
  const [lectureConfigs, setLectureConfigs] = useState(null)
  const [schedules, set_sechedules] = useState(null)
  const [term, set_term] = useState(null)
  const [proxy_visible,set_proxy_visible] = useState(false)
  const [proxy_lecture_slug,set_proxy_lecture_slug] = useState("")

  const load_semester = async (term_slug) => {
    // console.log(term_slug)
    const header = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/get_semesters`
    let method = 'get'
    let headers = header
    let response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, headers, null, { 'term_slug': term_slug })
    if (response_obj.error == false) {
      let response = response_obj.response
      setSemesters(response.data.data)
    } else {
      setSemesters(null)
      alert(response_obj.errorMessage.message)
    }
  }

  const showLectureModal = async (schedule) => {
    const header = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/get_lecture_configs`
    let method = 'get'
    let headers = header
    let response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, headers,null,{ schedule_slug: schedule.slug })
    if(response_obj.error ===false){
        set_sechedule(schedule)
        setLectureConfigs(response_obj.response.data.data)
    }else{
        alert(response_obj.errorMessage.message);        
    }
  }
  const load_division = async (semester_slug) => {
    if (semester_slug != ' ') {
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
      const axiosInstance = axios.create()
      let endpoint = `/manage/get_divisions`
      let method = 'get'
      let response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        headers,
        null,
        { semester_slug: semester_slug },
      )
      if (response_obj.error === false) {
        const response = response_obj.response
        set_division(response.data.data)
        setLectureConfigs(null)
      } else {
        set_division(null)        
        alert(response_obj.errorMessage.message)
      }
    } else {
      alert('please select semester')
    }
  }

  const load_term = async () => {
    const header = {
      "Content-Typle": "application/json",
      'ngrok-skip-browser-warning': true
    }

    const axiosInstance = axios.create()
    let endpoint = `/manage/get_terms`; let method = 'get'; let headers = header;
    let response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, headers)
    if (response_obj.error === false) {
      const response = response_obj.response
      set_term(response.data.data)
    }
    else {
      alert(response_obj.errorMessage.message)
    }
  }
  const load_time_talbe = async (division_slug) => {
    if (division_slug != '') {
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
      const axiosInstance = axios.create()
      let endpoint = `/manage/get_timetable`
      let method = 'get'
      let response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        headers,
        null,
        { division_slug: division_slug },
      )
      if (response_obj.error === false) {
        const response = response_obj.response
        set_time_table(response.data.data)
        set_sechedules(response.data.data.schedules)
      } else {
        alert(response_obj.errorMessage.message)
      }
    } else {
      alert('please select division')
    }
  }
  //for set the schedule
  useEffect(() => {
    load_term()
  }, [])
  return (
    <>
      <CRow className="mb-3">
        <CCol>
          {term && (
            <>
              <CCard className={`mb-3`}>
                <CCardHeader>select term</CCardHeader>
                <CCardBody>
                  <CFormSelect
                    aria-label="Default select example"
                    onChange={(e) => {
                      load_semester(e.target.value)
                    }}
                  >
                    <option value="">Select Term</option>
                    {term.map((item, index) => (
                      <option key={index} value={item.slug}>
                        Term : {item.start_year} - {item.end_year}
                      </option>
                    ))}
                  </CFormSelect>
                </CCardBody>
              </CCard>
            </>
          )}
          {Semesters && (
            <>
              <CCard className={`mb-3`}>
                <CCardHeader>Semester</CCardHeader>
                <CCardBody>
                  <CFormSelect
                    aria-label="Default select example"
                    onChange={(e) => {
                      load_division(e.target.value)
                    }}
                  >
                    <option value="">Select Semester</option>
                    {Semesters.map((item, index) => (
                      <option key={index} value={item.slug}>
                        Semester - {item.no}
                      </option>
                    ))}
                  </CFormSelect>
                </CCardBody>
              </CCard>
            </>
          )}
          {division && (
            <>
              <CCard>
                <CCardHeader>Division</CCardHeader>
                <CCardBody>
                  <CFormSelect
                    aria-label="Default select example"
                    onChange={(e) => {
                      load_time_talbe(e.target.value)
                    }}
                  >
                    <option value="">Select division</option>
                    {division.map((item, index) => (
                      <option key={index} value={item.slug}>
                        Division - {item.division_name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCardBody>
              </CCard>
            </>
          )}
        </CCol>
      </CRow>
      {time_table ? (
        <>
          <CRow className='text-center mb-5 justify-content-center'>
            <CCol className='col-lg-10 col-md-10 col-sm-12 col-xs-12'>
              <CCard className="">
                <CCardHeader>
                  Division - {time_table ? time_table.division.division_name : ''}
                </CCardHeader>
                <CCardBody>
                  <CRow className="flex-column" style={{ padding: '0' }}>
                    {time_table ? (
                      schedules.map((item, index) => (
                        <>
                          <CCol className="mb-4 d-flex align-items-center flex-column" key={index}>                        
                              <CAlert className="m-0 rounded-0 w-100 p-2 d-flex justify-content-between align-items-center" color="primary" visible={true} onClose={() => setVisible(false)}>
                                  {item.day.toUpperCase()}
                                  <button
                                    className="btn"
                                    onClick={() => {
                                      showLectureModal(item); setVisible(true);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-plus-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                    </svg>
                                  </button>
                              </CAlert>                            
                            <CCard className="w-100  rounded-0 border-0">
                              <CCardBody className=''>
                                <CRow className="justify-content-center">
                                  {item.lectures.length > 0 ? (
                                    item.lectures.map((lecture, index) => (                                      
                                      <CToast key={index} autohide={false} visible={true} className={`mb-3 w-100 ${lecture.is_proxy ? "border-red-700" : ""}`}>                                        
                                          <CToastHeader className="d-flex flex-wrap justify-content-sm-between justify-content-center">
                                            {lecture.is_proxy ? (
                                              <div className={`w-100 fw-bold mx-2 my-2`}>
                                              <small className='mx-2 my-2'>
                                                {lecture.is_proxy ? "Proxied from ":""}
                                                {lecture.link ? lecture.link.from_lecture.subject.subject_name : ""}
                                              </small>
                                              <hr className='w-100 my-2'></hr>
                                              </div>
                                            ):(null)}
                                            
                                            <div className="fw-bold mx-2 my-2">
                                              {lecture.subject.subject_name.charAt(0).toUpperCase() + lecture.subject.subject_name.slice(1)}
                                            </div>
                                            <small className='mx-2 my-2'>
                                              {lecture.type.toUpperCase()}
                                            </small>
                                            <small className='mx-2 my-2'>
                                              {lecture.start_time.slice(0, 5)} |{' '}
                                              {lecture.end_time.slice(0, 5)}
                                            </small>
                                            
                                          </CToastHeader>
                                          <CToastBody className='d-flex flex-row flex-wrap justify-content-center justify-content-md-between'><span className='mx-3'>Prof - {lecture.teacher.charAt(0).toUpperCase() + lecture.teacher.slice(1)} </span><span>batches - {lecture.batches.map((batch, index) => (<span key={index}>{batch.batch_name.toUpperCase()}{index < lecture.batches.length - 1 && ', '}</span>))} </span> <span className='mx-3'>{lecture.classroom.class_name.charAt(0).toUpperCase() + lecture.classroom.class_name.slice(1)}</span> </CToastBody>
                                          {!lecture.is_proxy && (<><hr className='w-100'></hr>
                                              <div className='d-flex w-100 mb-3'>
                                                <div className='w-100'>
                                                  <button className='btn btn-outline-dark w-100 mt-3' onClick={(e)=>{showLectureModal(item);set_proxy_lecture_slug(lecture.slug); set_proxy_visible(true)}}>Add Proxy</button>  
                                                </div>
                                          </div></>)}
                                      </CToast>                                      
                                    ))
                                  ) : (
                                    <CToast autohide={false} visible={true}>
                                      <CToastBody>No Lectures Found</CToastBody>
                                    </CToast>
                                  )}
                                </CRow>
                              </CCardBody>
                            </CCard>
                          </CCol></>
                      ))
                    ) : (
                      <CToast autohide={false} visible={true}>
                        <CToastBody>No Schedules Found</CToastBody>
                      </CToast>
                    )}
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      ) : (
        <CToast animation={false} autohide={false} visible={true} className="mx-auto w-100">
          <CToastHeader className="bg-dark d-flex justify-content-center">
            <img src="/static/media/smartroll_logo.a3c3e21d0b4a56919e74.png" width={100}></img>
          </CToastHeader>
          {term ? Semesters ? (
            division ? (
              <CToastBody>Select a division</CToastBody>
            ) : (
              <CToastBody>Select a semester </CToastBody>
            )
          ) : <CToastBody>Select a term </CToastBody> : null}
        </CToast>
      )}
      {schedule && <SetLecture visible={visible} setVisible={setVisible} sechedule={schedule} lectureConfigs={lectureConfigs} schedule_list={set_sechedules} />}
      {schedule && <SetProxy visible={proxy_visible} setVisible={set_proxy_visible}  sechedule={schedule} lectureConfigs={lectureConfigs} schedule_list={set_sechedules} proxy_lecture_slug={proxy_lecture_slug}></SetProxy>}
    </>
  )
}
export default Timetable
