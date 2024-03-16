import React , {Component} from 'react'
import { useState } from 'react'
import {
  CButton,
  CCard,
  CCardFooter,
  CCol,
  CRow,
} from '@coreui/react'

import axios from 'axios'

import FormControl from '../forms/form-control/FormControl'
import Select from '../forms/input-group/InputGroup'
import Validation from '../forms/validation/Validation'
import { useContext , useEffect } from 'react'
import { Store } from 'src/views/forms/validation/store';
import {base_url} from 'src/base_url'
import { APIMiddleware } from 'src/global_function/GlobalFunctions'
import Breadcrumbnav from '../breadcrum/Breadcrumbnav';
import useAPI from 'src/global_function/useApi'
import Terms from '../forms/validation/Terms'
const Dashboard = () => {
  const [steps, setsteps] = useState('term')
  const [semester_slug, set_semester_slug] = useState("");
  const [semSlug, setsemSlug] = useState("");
  const [subSlug, setsubSlug] = useState("");

  const [term_conut, set_term_count] = useState(0)
  const [semCount, setsemCount] = useState(0);
  const [divisionCount,set_divisionCount] = useState(0)
  const [batchCount, setbatchCount] = useState(0);
  
    
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken , refreshToken , profileDetails, objectCount } = state  
  const [division_slug, set_division_slug] = useState("")
  const [StoredTokens,CallAPI] = useAPI()
  const [term_slug,set_term_slug] = useState("")

  useEffect(() => {               
    if(profileDetails.obj.profile.role === "admin"){
      getObjectCounts()
    }
  }, []);

  const getObjectCounts = async () =>{
    const header = {
      "Content-Type":"application/json",        
      'ngrok-skip-browser-warning':true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/get_object_counts`;let method='get';let headers = header;
    let response_obj = await CallAPI(StoredTokens,axiosInstance,endpoint,method,headers)
    if(response_obj.error == false){
      let response = response_obj.response
      ctxDispatch({ type: 'GET_OBJECTS', payload: response.data });
    }else{  
      alert(response_obj.errorMessage.message)
    }
  }
  
  const chageSteps = (currentStep) =>{
      setsteps(currentStep)
  }
  // console.log(divisionCount)
  const progressExample = [
    { title: 'Terms', value: objectCount.terms, nextStep:'semester' },
    { title: 'Semester', value: objectCount.semesters, nextStep:'semester' },
    { title: 'divison', value: objectCount.divisons, nextStep:'subject' },
    { title: 'Batches', value: objectCount.batches, nextStep:'batch'},
  ]
  // console.log(objectCount)
  return (
    <>
      <Breadcrumbnav currentStep={steps} chageSteps={chageSteps}></Breadcrumbnav>
      
      <CCard className="mb-4">
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 4 }} className="text-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <CButton style={{ backgroundColor: 'transparent', border: 'none',cursor:"default" }}>
                  <div className="text-medium-emphasis">{item.title}</div>
                  <strong style={{ color: 'black' }}>
                    {item.value} {item.percent}
                  </strong>
                </CButton>
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>      
      {(() => {
        
        switch (steps) {

          case 'term':
            return <Terms chageSteps={chageSteps} set_term_slug={set_term_slug} set_term_count={set_term_count}></Terms>

          case 'semester':
            return <Validation chageSteps={chageSteps} term_slug={term_slug}  set_semester_slug={set_semester_slug} setsemCount={setsemCount}></Validation>
            
          case 'division':
            return <FormControl chageSteps={chageSteps}  semester_slug={semester_slug} set_division_slug={set_division_slug} set_divisionCount={set_divisionCount}></FormControl>
          case 'batch':
            return <Select chageSteps={chageSteps} division_slug={division_slug} setsubSlug={setsubSlug} setBatchCout={setbatchCount}></Select>
          default:
            {/* console.log(steps) */}
        }
      })()}
    </>
  )
}

export default Dashboard