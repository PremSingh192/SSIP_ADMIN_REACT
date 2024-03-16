import React from 'react'
import { useState , useContext,useEffect } from 'react'
import PropTypes from 'prop-types'
import { Store } from 'src/views/forms/validation/store'
import axios from 'axios'
import {base_url} from 'src/base_url'
import expireToken from 'src/global_function/unauthorizedToken'
import { APIMiddleware } from 'src/global_function/GlobalFunctions'
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
  CFormSelect
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { showAlert } from 'src/global_function/GlobalFunctions'
import useAPI from 'src/global_function/useApi'

const Subject = () => {

    const [subjects, set_Subjects] = useState(null)
    const [semester,set_semester] = useState(null)
    //costom hook to call the API
    const [term,set_term] = useState(null)
    
    const [StoredTokens,CallAPI] = useAPI()
    const [current_semester, set_current_semester] = useState(null)

    const load_subject = async()=>{
        const header = {
            "Content-Type":"application/json",      
            'ngrok-skip-browser-warning':true
          }
          const axiosInstance = axios.create()
          let endpoint = `/manage/get_subject`;let method='get';let headers = header;
          let response_obj = await CallAPI(StoredTokens,axiosInstance,endpoint,method,headers,null,null)
          if(response_obj.error == false){
          let response = response_obj.response          
          set_Subjects(response.data.data)
        }else{            
        }   
    }
    const load_semester = async(current_term)=>{
      
      const headers = {
        "Content-Type":"application/json",
        'ngrok-skip-browser-warning':true
      }
      const axiosInstance = axios.create()
      const response_obje = await CallAPI(StoredTokens,axios,"/manage/get_semesters","get",headers,null,{"term_slug":current_term})
      if(response_obje.error == false){
        const response = response_obje.response        
        set_semester(response.data.data)
      }
      else{        
      }
    }



    const load_term = async()=>{
      const header = {
        "Content-Type":"application/json",
        'ngrok-skip-browser-warning':true
      }
      const axiosInstance = axios.create
      let endpoint = `/manage/get_terms`;let method='get';let headers = header;
      let response_obj = await CallAPI(StoredTokens,axiosInstance,endpoint,method,headers)    
      if(response_obj.error == false){
      let response = response_obj.response
          set_term(response.data.data)
    }else{  
      alert(response_obj.errorMessage.message)
    }  
    }

    const [validated, setValidated] = useState(false)
    const [subject_name, set_subject_name] = useState("")
    const [subject_code, set_subject_code] = useState("")
    const [subject_credit, set_subject_credit] = useState("")
    const [currentSelectSemester,setcurrentSelectSemester] = useState("")
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { accessToken,refreshToken } = state
    const navigate = useNavigate()
    const add_batch = async (body) => {
      
      const header = {
        "Content-Type":"application/json",      
        'ngrok-skip-browser-warning':true
      }
      const axiosInstance = axios.create()
      let endpoint = `/manage/add_subject/`;let method='post';let headers = header;
      let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers,body,null)
      if(response_obj.error == false){
          let response = response_obj.response
          set_Subjects(prevArray => [...prevArray, response.data.data])
          showAlert("success","Subject Added successfully...!")
        }else{            
          alert(response_obj.errorMessage.message)
        }    
    }
    
    const handleSubmit = (event) => {
      
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
        alert("Please Enter Valid Subject Information")
        return
      }
      setValidated(true)
      const body = {
        "code": subject_code,
        "subject_name": subject_name,
        "credit": subject_credit,
        "semester_slug":current_semester,
      }
      event.preventDefault()
      add_batch(body)
      
    }

    useEffect(() => {
        load_term()
        load_subject()
       
    }, [])
    
  return (
    <>
    <>
    <CRow>
    <CCol>
        {term && (
            <>
              <CCard className={`mb-3`}>
                <CCardHeader>select term</CCardHeader>
                <CCardBody>
                  <CFormSelect
                    aria-label="Default select example"
                    onChange={(e) => {
                      // console.log(e.target.value)
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
          {semester && (
            <>
              <CCard className={`mb-3`}>
                <CCardHeader>Semester</CCardHeader>
                <CCardBody>
                  <CFormSelect
                    aria-label="Default select example"
                    onChange={(e) => {
                     set_current_semester(e.target.value)
                    }}
                  >
                    <option value="">Select Semester</option>
                    {semester.map((item, index) => (
                      <option key={index} value={item.slug}>
                        Semester - {item.no}
                      </option>
                    ))}
                  </CFormSelect>
                </CCardBody>
              </CCard>
            </>
          )}
        </CCol>
      </CRow>
      {
        current_semester ? (
          <CRow>
            <CCol xs={12}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Subjects</strong>
            </CCardHeader>
            <CCardBody>
                <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <CCol md={12}>
              <CFormLabel htmlFor="validationCustom01">Subject Name</CFormLabel>
              <CFormInput type="text" id="validationCustom01" onChange={e => set_subject_name(e.target.value)} required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            
            
            <CCol md={6}>
              <CFormLabel htmlFor="validationCustom01">Subject Code</CFormLabel>
              <CFormInput type="number" id="validationCustom01" onChange={e => set_subject_code(e.target.value)} required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="validationCustom01">Subject Credit</CFormLabel>
              <CFormInput type="number" id="validationCustom01" onChange={e => set_subject_credit(e.target.value)} required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol xs={12}>
              <button className='btn btn-outline-dark form-control' type="submit">
                Submit form
              </button>
            </CCol>
                </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
        ) : (null)
      }
      
      <CRow>
        {
          subjects ? (
            <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Subject History</strong>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Subject Name</CTableHeaderCell>
                    <CTableHeaderCell>Subject Code</CTableHeaderCell>
                    <CTableHeaderCell>Semester</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>                
                <CTableBody>
                  {subjects.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div>{item.subject_name.charAt(0).toUpperCase() + item.subject_name.slice(1)}</div>
                      </CTableDataCell>
                      
                      <CTableDataCell>
                        <div>{item.code}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                      <div>{item.semester.no}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
          ) : (null)
        }
        
      </CRow>
    </>
    </>
  )
}

export default Subject