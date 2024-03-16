import React, { useEffect } from 'react';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useContext } from 'react'
import { Store } from 'src/views/forms/validation/store';
import {base_url} from 'src/base_url';
import "../login/LoginForm.css";
import expireToken from 'src/global_function/unauthorizedToken';
import '../../../css/tailwind.css'
import { useForm } from "react-hook-form";
import { CCol, CRow } from '@coreui/react';
import Swal from 'sweetalert';

export default function Register(){
      




     const navigate = useNavigate();
     const { register, handleSubmit} = useForm();      
    
      const { state, dispatch: ctxDispatch } = useContext(Store);
      const { refreshToken , set404 } = state;

      const SubmitRegister = (data) => {
          const flag = confirm("Are you sure you want to save the details?")
        if (flag == true) {
          if(data.enrollment != parseInt(data.enrollment)){
            return alert("please enter the valid enrollment numner ")
          }
          const header = {
            "Content-Type":"application/json",
            'ngrok-skip-browser-warning':true
          }
          Axios.post(`${base_url}/auth/api/register/`,{
            "enrollment":data.enrollment,
            "email":  data.email,
            "password":data.password        
          },{header})
          .then((response)=>{        
            if(response.data.data.status){
              navigate('/login')
            }
            else{
  
            }
          })
          .catch((error)=>{          
            if(error.code === "ERR_NETWORK"){
              ctxDispatch({ type: 'SET_404', payload: true });
            }
            else{
              if(error.response.status === 401){
                expireToken(refreshToken)            
                }
              else{
                alert("something went worng")
              }
            }
            
          })
        }
    }
    useEffect(()=>{      
      if(set404){
        navigate("/404")
        ctxDispatch({ type: 'SET_404', payload: false });        
      }
    },[set404])    

  return (
    <div className="h-screen bg-center bg-no-repeat sm:p-10 p-2" style={{background:'black'}}>
      <section className="w-full h-full flex justify-center items-center rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100" style={{backgroundImage:'url(/images/background2.jpg)'}}>
      <div className="text-white sm:w-full w-75">        
             
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit(SubmitRegister)} autoComplete='off'>        
          <div className="relative border-b-2	border-slate-500 z-0 w-full mb-5 group">
            <input type="text" name="floating_enrollment" id="floating_enrollment" className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required {...register('enrollment')}/>
            <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Entrollment No.</label>
          </div>
          <div className="relative border-b-2	border-slate-500 z-0 w-full mb-5 group">
            <input type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required {...register('email')}/>
            <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
          </div>
          <div className="relative z-0 border-b-2	border-slate-500 w-full mb-5 group">
            <input type="password" name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required  {...register('password')}/>
            <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
          </div>
          <button type="submit" className="w-100 focus:ring-4  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  text-slate-300" style={{border:'1px solid #ffa31a'}}>Register</button>
        </form>
        <CRow className='justify-center mt-4'>
              <CCol className='w-full text-center'>
              <div> Or <Link to={"/login"} className='ml-2' style={{color:'rgb(255, 163, 26)'}}>Login</Link></div>
              </CCol>
            </CRow>
      </div>
      </section>
    </div>    
  );
};