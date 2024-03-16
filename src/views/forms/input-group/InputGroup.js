import React from 'react'
import { useState , useContext,useEffect } from 'react'
import PropTypes from 'prop-types'
import { Store } from '../validation/store'
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
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { showAlert } from 'src/global_function/GlobalFunctions'
import { batch } from 'react-redux'
import useAPI from 'src/global_function/useApi'
const CustomStyles = (division_slug,set_batches,setBatchCout) => {
  const [validated, setValidated] = useState(false)
  const [batch_name, set_batch_name] = useState(null);
  
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken,refreshToken, objectCount } = state
  const navigate = useNavigate()

  //custom hook to call the API

  const [StoredTokens,CallAPI] = useAPI()


  const add_batch = async (body) => {
    if(batch_name){

    }
    else{
      alert("Please Enter The Valid Batch Name")
    }
    const header = {
      "Content-Type":"application/json",      
      'ngrok-skip-browser-warning':true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/add_batch/`;let method='post';let headers = header;
    let response_obj = await CallAPI(StoredTokens,axiosInstance,endpoint,method,headers,body,null)
    if(response_obj.error == false){
        let response = response_obj.response        
        let changeSubjectCount = {...objectCount}
        changeSubjectCount.batches += 1      
        // console.log(changeSubjectCount)  
        ctxDispatch({ type: 'GET_OBJECTS', payload: changeSubjectCount })
        set_batches(prevArray => [...prevArray, response.data.data])
        setBatchCout(preValue => preValue + 1);
        showAlert("success","Batch Added successfully...!")
      }else{     
        alert(response_obj.errorMessage.message)     
      }    
  }
  
  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    const body = {
      division_slug:division_slug,
      batch_name:batch_name,
    }
    event.preventDefault()
    add_batch(body)
    
  }
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom01">Batch Name</CFormLabel>
        <CFormInput type="text" id="validationCustom01" onChange={e => set_batch_name(e.target.value)} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <button className='btn btn-outline-dark form-control' type="submit">
          Submit form
        </button>
      </CCol>
    </CForm>
  )
}

const Select = (props) => {

  const [StoredTokens, CallAPI] = useAPI()
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken,refreshToken, semesters } = state
  const navigate = useNavigate()
  const {division_slug , chageSteps,setBatchCout} = props
  const [batches, set_batches] = useState([]);
  
  const load_batches = async () => {
    const header = {
      "Content-Type":"application/json",        
      'ngrok-skip-browser-warning':true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/get_batches`;let method='get';let headers = header;
    let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers,null,{ division_slug: division_slug })
    if(response_obj.error == false){
      let response = response_obj.response
      set_batches(response.data.data)
    }else{      
      alert(response_obj.errorMessage.message)  
    }
  }

  useEffect(() => {
      load_batches()
  }, []);
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Batches</strong>
            </CCardHeader>
            <CCardBody>{CustomStyles(division_slug,set_batches,setBatchCout)}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Batch History</strong>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow className='text-center'>
                    <CTableHeaderCell>Batch Name</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {batches.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div className='text-center'>{item.division.division_name} | {item.batch_name}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
Select.prototype = {
  chageSteps:PropTypes.func.isRequired,
  semSlug: PropTypes.string
}
export default Select
