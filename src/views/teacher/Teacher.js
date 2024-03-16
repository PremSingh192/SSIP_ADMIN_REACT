import React from 'react'
import { useState, useContext, useEffect } from 'react'
import 'src/scss/panel.css'
import { Store } from '../forms/validation/store'
import axios from 'axios'
import {base_url} from 'src/base_url'
import { useSelector, useDispatch } from 'react-redux'
import expireToken from 'src/global_function/unauthorizedToken'
import ManageSubjects from './ManageSubjects'
import { useNavigate } from 'react-router-dom'
import { APIMiddleware } from 'src/global_function/GlobalFunctions'
import useAPI from 'src/global_function/useApi'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  COffcanvasBody,
  CFormCheck,
} from '@coreui/react'
import { showAlert } from 'src/global_function/GlobalFunctions'
import Swal from 'sweetalert'
  const CustomStyles = (setTeacherlist) => {
  const [validated, setValidated] = useState(false)
  const [StoredTokens, CallAPI] = useAPI()
  const add_Teacher = async (body) => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/add_teacher/`
    let method = 'post'
    let response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      endpoint,
      method,
      headers,
      body,
      null
    )
    if (response_obj.error == false) {
      
      let response = response_obj.response
     
      setTeacherlist((prevArray) => [...prevArray, response.data.data])
    } else {  
      alert(response_obj.errorMessage.message)    
    }
  }

  const handleSubmit = (event) => {
    
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
      Swal({
        title: 'Please Enter Valid Information',
        icon: 'error',
        button: 'OK',  
      })
      return
    }
    
    const name = event.target.tname.value
    const email = event.target.temail.value
    setValidated(true)
    if (!name || !email) {
      
      alert("hello")
      
    } else {      

      const body = {
        name,
        email,
      }
      add_Teacher(body)
      showAlert('success', 'Teacher Added successfully...!')
    }

  }
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom01">Teacher Name</CFormLabel>
        <CFormInput type="text" id="validationCustom01" name="tname" required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom01">Teacher E-mail</CFormLabel>
        <CFormInput type="email" id="validationCustom02" name="temail" required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <button className="btn btn-outline-dark form-control" type="submit">
          Submit form
        </button>
      </CCol>
    </CForm>
  )
}

const Teacher = () => {
  const [StoredTokens, CallAPI] = useAPI()
  const [visible, setVisible] = useState(false)
  const [SelectedTeacher, setSelectedTeacher] = useState(null)

  const [Teacherlist, setTeacherlist] = useState([])

  const load_teacher = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/get_teacher`
    let method = 'get'
    let response_obj = await CallAPI(StoredTokens,axiosInstance, endpoint, method, headers)
    if (response_obj.error == false) {
      let response = response_obj.response
      setTeacherlist(response.data.data)
    } else {
      // console.log(response_obj.errorMessage.message)
    }
  }

  useEffect(() => {
      load_teacher()
  }, [])


  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Teachers</strong>
            </CCardHeader>
            <CCardBody>{CustomStyles(setTeacherlist)}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Teacher History</strong>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>E-mail</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {Teacherlist.map((item, index) => (
                    <CTableRow
                      v-for="item in tableItems"
                      key={index}
                    >
                      <CTableDataCell>
                        <div>{item.profile.name.charAt(0) + item.profile.name.slice(1)}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.profile.email}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {SelectedTeacher ? (
        <ManageSubjects
          visible={visible}
          setVisible={setVisible}
          SelectedTeacher={SelectedTeacher}
        />
      ) : null}
    </>
  )
}

export default Teacher