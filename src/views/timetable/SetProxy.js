import React, { useRef,useEffect} from 'react'
import {
  COffcanvas,  
  COffcanvasBody,  
  CAlert,
} from '@coreui/react'
import { useForm } from "react-hook-form"
import useAPI from 'src/global_function/useApi'
import axios from 'axios'

const SetProxy = ({ visible, setVisible, sechedule, lectureConfigs , schedule_list,proxy_lecture_slug}) => {
    const [StoredTokens,CallAPI] = useAPI()
    const lectureForm = useRef()
    const { register, handleSubmit } = useForm();
    const handleFormSubmit = async (data) => {
      if(data.start_time && data.end_time && data.teacher && data.subject && data.batches && data.classroom && data.type){
        const axiosInstance = axios.create()
        const body = data    
        body.schedule_slug = sechedule.slug
        body.prev_lecture_slug = proxy_lecture_slug
        const headers = {
          "Content-Type":"application/json",
          'ngrok-skip-browser-warning':true
        }
        const response_obj = await CallAPI(StoredTokens,axiosInstance,"/manage/add_lecture_as_proxy/","post",headers,body,null)
        if(response_obj.error === false){
          const response = response_obj.response
          schedule_list(prevItems => {
            return prevItems.map(item => {
              if (item.slug === sechedule.slug) {
                // Update the value array of the first item
                return { ...item, lectures: [...item.lectures, response.data.data] };
              }
              return item; // Return unchanged item for other items
            });
          });
          setVisible(!visible)
           console.log(response.data.data)
        }else{
          alert(response_obj.errorMessage.message)
        }
      }else{
        // console.log('here');
      }
    };
  useEffect(() => {
    // console.log(lectureForm.current);
  }, [lectureForm])
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
          {sechedule.day.toUpperCase()}
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
          <form className="container" onSubmit={handleSubmit(handleFormSubmit)} ref={lectureForm}>
            <div className="mb-3">
              <label className="form-label">Start Time</label>
              <input type="time" className="form-control" required  {...register("start_time")}/>
            </div>
            <div className="mb-3">
              <label className="form-label">End Time</label>
              <input type="time" className="form-control" required {...register("end_time")}/>
            </div>
            <div className="mb-3">
              <label className="form-label">Select Lecture Type</label>
              <select className="form-select" aria-label="Default select example" required {...register("type")}>
                <option value="">....</option>
                <option value={'theory'}>Theory</option>
                <option value={'lab'}>Lab</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Select Classroom</label>
              <select className="form-select" aria-label="Default select example" {...register("classroom")}>
                <option value="">....</option>
                {lectureConfigs.classrooms &&
                  lectureConfigs.classrooms.map((item, index) => (
                    <option key={index} value={item.slug}>
                      {item.class_name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Select Subject</label>
              <select className="form-select" aria-label="Default select example" {...register("subject")}>
                <option value="">....</option>
                {lectureConfigs.subjects &&
                  lectureConfigs.subjects.map((item, index) => (
                    <option key={index} value={item.slug}>
                      {item.subject_name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Select Teacher</label>
              <select className="form-select" aria-label="Default select example" {...register("teacher")}>
                <option value="">....</option>
                {lectureConfigs.teachers &&
                  lectureConfigs.teachers.map((item, index) => (
                    <option key={index} value={item.slug}>
                      {item.profile.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Select Batch</label>
              <select multiple className="form-select" size="3" aria-label="size 3 select example" {...register("batches")}> 
                {lectureConfigs.batches &&
                  lectureConfigs.batches.map((item, index) => (
                    <option key={index} value={item.slug}>
                      {item.batch_name}
                  </option>
                  ))}
              </select>
            </div>            
              <button type="submit" className="form-control btn-outline-success btn mb-3">
                Submit
              </button>                        
            <button type="button" className="form-control btn-outline-success btn" onClick={() => {lectureForm.current?.reset()}}>
                Clear
            </button>            
          </form>
        </COffcanvasBody>
      </COffcanvas>
    </>
  )
}

export default SetProxy