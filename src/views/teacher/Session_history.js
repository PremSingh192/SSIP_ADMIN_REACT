import React, { useState, useEffect, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel';
import {
  COffcanvas,
  COffcanvasBody,
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CFormCheck
} from '@coreui/react'
import axios from 'axios';
import useAPI from 'src/global_function/useApi'
const Session_history = ({ visible, setVisible, attendances, session_data }) => {
  const tableRef = useRef(null);
  const [isRefReady, setIsRefReady] = useState(false);
  const [StoredTokens, CallAPI] = useAPI()
  useEffect(() => {
    if (tableRef.current) {
      setIsRefReady(true);
    }
  }, [tableRef.current])
  const mark_student_attendance = async (event, attendance_Slug) => {
    event.preventDefault()
    try {
      if(!confirm("Are you sure you want to mark the attendance manually?"))return;
      console.log(attendance_Slug)
      event.target.checked = "checked"
      event.target.disabled = true
      const axiosInstance = axios.create()
      const headers = {
        'Content-Type': "application/json",
        'ngrok-skip-browser-warning': true
      }
      const body = {
        "attendance_slug":attendance_Slug
      }
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        `/manage/session/mark_attendance_for_absent_student/`,
        'post',
        headers,
        body,
        null,
      )
      if (response_obj.error === false) {
        
        const response = response_obj.response
        const div_element = event.target.parentElement
        const children = div_element.children
        children[1].innerText = "P"
        div_element.removeChild(children[0])
        var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.setAttribute("width", "16");
        svgElement.setAttribute("height", "16");
        svgElement.setAttribute("fill", "currentColor");
        svgElement.setAttribute("class", "mx-auto bi bi-patch-check");
        svgElement.setAttribute("viewBox", "0 0 16 16");

        var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("fill-rule", "evenodd");
        path1.setAttribute("d", "M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0");

        var path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("d", "m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911z");

        svgElement.appendChild(path1);
        svgElement.appendChild(path2);
        div_element.prepend(svgElement)
      }
      else{
        alert(response_obj.errorMessage.message)
      }
    }
    catch (error) {
      alert(error.message)
    }

  }
  return (
    <>
      <COffcanvas
        className="card w-100"
        placement="end"
        visible={visible}
        onHide={() => setVisible(false)}
        data-coreui-backdrop="static"
      >
        <CAlert
          color="success"
          visible={true}
          className="justify-content-between align-items-center d-flex"
        >
          <svg
            onClick={() => setVisible(false)}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg>
        </CAlert>
        <COffcanvasBody>
          <div className='w-100'>
            {tableRef.current ? (<DownloadTableExcel
              filename={`${session_data.lecture.subject.subject_name} - ${new Date(session_data.day).toLocaleString()}`}
              sheet="attendance"
              currentTableRef={tableRef.current}
            >

              <button className='my-2 w-100 btn btn btn-outline-primary'> Export excel </button>

            </DownloadTableExcel>) : null}
          </div>
          <CRow className="w-100 flex-col">
            <CCol className="col-12">
              <div className='table-responsive'>
                <table align="middle" className="table align-middle table-hover text-center mb-0 border hover responsive" ref={tableRef}>
                  <CTableHead color="light">
                    <CTableRow aria-colspan={5}>
                      <CTableHeaderCell colSpan={5}>L.D COLLEGE OF ENGINEERING</CTableHeaderCell>
                    </CTableRow>
                    <CTableRow aria-colspan={5}>
                      <CTableHeaderCell colSpan={5}>Subject: {session_data.lecture.subject.subject_name} | DATE: {session_data.day}</CTableHeaderCell>
                    </CTableRow>
                    <CTableRow>
                      {/* <CTableHeaderCell>SR. NO</CTableHeaderCell> */}
                      <CTableHeaderCell>Enrollment No</CTableHeaderCell>
                      <CTableHeaderCell>Student Name</CTableHeaderCell>
                      {/* <CTableHeaderCell>IP Addr</CTableHeaderCell> */}
                      <CTableHeaderCell>Batch</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {attendances &&
                      attendances.map((item, index) => (
                        
                        <CTableRow v-for={`alert alert-primary item in tableItems`} style={item.manual ? {border:"2px solid darkorange"} : null} key={index}>
                          {/* <CTableDataCell>
                                        <div>{item.student.sr_no}</div>   
                                </CTableDataCell> */}
                          <CTableDataCell>
                            <div>{item.student.enrollment ? item.student.enrollment : "-"}</div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div>{item.student.profile.name ? item.student.profile.name : '-'}</div>
                          </CTableDataCell>
                          {/* <CTableDataCell>
                            <div>{item.marking_ip ? item.marking_ip : '-'}</div>
                          </CTableDataCell> */}
                          <CTableDataCell>
                            <div>
                              {item.batches
                                ? item.batches.map((batch, index) => (
                                  <span key={index}>{batch.batch_name.toUpperCase()}</span>
                                ))
                                : '-'}
                            </div>

                          </CTableDataCell>
                          {item.is_present ? (<CTableDataCell>
                            <div className="text-success d-flex justify-content-center align-items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="mx-auto bi bi-patch-check"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0"
                                />
                                <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911z" />
                              </svg>
                              <p style={{ visibility: 'hidden' }}>P</p>
                            </div>
                          </CTableDataCell>) : (<CTableDataCell>
                            <div className="text-success d-flex justify-content-center align-items-center">
                              {/* <CFormCheck onClick={(e) => { mark_student_attendanc(e, item.slug) }}>Mark Attendance</CFormCheck> */}
                              <input type="checkbox" onClick={(e)=>{ mark_student_attendance(e,item.slug)}}></input>
                              <p style={{ visibility: 'hidden' }}>F</p>
                            </div>
                          </CTableDataCell>)}
                        </CTableRow>
                      ))}
                  </CTableBody>
                </table>
              </div>
            </CCol>
          </CRow>
        </COffcanvasBody>
      </COffcanvas>
    </>
  )
}

export default Session_history