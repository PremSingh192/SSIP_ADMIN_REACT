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
      const { refreshToken , set404 ,loader_state} = state;

      const SubmitRegister = (data) => {
        const flag = confirm("Please make sure you've entered correct email address, as it will be used for further notifications!!")
        if (flag == true) {
          if(data.enrollment != parseInt(data.enrollment)){          
            return alert("please enter the valid enrollment numner")
          }
          const header = {
            "Content-Type":"application/json",
            'ngrok-skip-browser-warning':true
          }
          ctxDispatch({ type: 'LOADER_STATE', payload: true});
          Axios.post(`${base_url}/auth/api/register/`,{
            "enrollment":data.enrollment,
            "email":  data.email,
            "password":data.password        
          },{header})
          .then((response)=>{        
            ctxDispatch({ type: 'LOADER_STATE', payload: false});
            if(response.data.data.status){
              navigate('/login')
            }
            else{
  
            }
          })
          .catch((error)=>{          
            ctxDispatch({ type: 'LOADER_STATE', payload: false});
            if(error.code === "ERR_NETWORK"){
              ctxDispatch({ type: 'SET_404', payload: true });
            }
            else{
              if(error.response.status === 401){
                expireToken(refreshToken)            
                }
              else{
                alert(error.response.data.message)
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
    <>
      <div  className={!loader_state ? 'd-none' : ''} style={{backdropFilter: 'blur(5px)',height: '100vh', width: '100%', position: 'absolute',zIndex: 9999,top: 0, justifyContent: 'center', display: 'flex', alignItems: 'center', left: 0 }}>
        <img className="animated-container" style={{height:'10vh'}} src='/svgs/loader.svg'></img>
      </div>
    <div className="h-screen bg-center sm:p-10 p-2" style={{backgroundImage:`url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23f1f5f9'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`}}>
      <section className="w-full h-full flex justify-center items-center">
      <div className="text-white sm:w-full w-75">        
             
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit(SubmitRegister)} autoComplete='off'>        
          <div className="relative border-b-2	border-slate-500 z-0 w-full mb-5 group">
            <input type="text" name="floating_enrollment" id="floating_enrollment" className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required {...register('enrollment')}/>
            <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Entrollment No.</label>
          </div>
          <div className="relative border-b-2	border-slate-500 z-0 w-full mb-5 group">
            <input type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required {...register('email')}/>
            <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
          </div>
          <div className="relative z-0 border-b-2	border-slate-500 w-full mb-5 group">
            <input type="password" name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required  {...register('password')}/>
            <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
          </div>
          <button type="submit" className="w-100 focus:ring-4  font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  text-black" style={{background:'#ffa31a'}}>Register</button>
        </form>
        <CRow className='justify-center mt-4'>
              <CCol className='w-full text-center'>
                <div className='text-black'> Already have an account?  <Link to={"/login"} className='ml-2' style={{color:'rgb(255, 163, 26)'}}>Login</Link></div>
                <div className='text-black'> Or <Link to={"/register"} style={{color:'#ffa31a'}}>Forgot Password</Link></div>
              </CCol>
            </CRow>
      </div>
      </section>
    </div>    
    </>
  );
};