import React from 'react'
import axios from 'axios'
import useAPI from 'src/global_function/useApi'
import Swal from 'sweetalert'

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function AdditionalFeatures() {  
  const [StoredTokens, CallAPI] = useAPI()

  const SaveSubscription = async (subscription) => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/save_web_push_subscription/',
      'post',
      headers,
      {subscription:subscription},
      null,
    )
    if (response_obj.error === false) {
        Swal("Good job!", "You'll be notified about your upcoming lecture sessions", "success")
    } else {
      Swal("Oops!", response_obj.errorMessage.message, "error")      
    }
  }

  const subscribe_for_alerts = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/set_web_push_subscription',
      'get',
      headers,
      null,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj.response
      if (response.data.VAPID_PUBLIC_KEY) {        
        if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
          navigator.serviceWorker.register('/workers/NotificationWorker.js').then((registration) => {
            navigator.serviceWorker.getRegistrations().then(registered => {
              Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                  const applicationServerKey = urlB64ToUint8Array(response.data.VAPID_PUBLIC_KEY)
                  registration.pushManager
                    .subscribe({
                      userVisibleOnly: true,
                      applicationServerKey,
                    })
                    .then((subscription) => {
                      console.log(subscription);
                        SaveSubscription(subscription)                    
                    })
                    .catch((error) => {
                      Swal("Oops!", error, "error")
                    })
                }else{
                  Swal("Oops!", "You've denined the notification permission", "error")
                }            
            })
            })
          })
        }else{
          Swal("Oops!", "Your browser doesn't support push notificaitons!!", "error")
        }
      } else {
        Swal("Oops!", response_obj.errorMessage.message, "error")
      }
    }
  }
  return (
    <div className='flex justify-center mt-4'>
      <div className="max-w-sm bg-slate-200 p-6  border border-gray-200 rounded-lg shadow dark:border-gray-700">
        <svg
          className="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M18 5h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C8.4.842 6.949 0 5.5 0A3.5 3.5 0 0 0 2 3.5c.003.52.123 1.033.351 1.5H2a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2ZM8.058 5H5.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM11 13H9v7h2v-7Zm-4 0H2v5a2 2 0 0 0 2 2h3v-7Zm6 0v7h3a2 2 0 0 0 2-2v-5h-5Z" />
        </svg>
        <a href="#">
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-dark">
            Lecture Alerts !!
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
          You'll be notified 5 mins before your lecture session !!
        </p>
        <a
          onClick={subscribe_for_alerts}
          className="btn inline-flex font-medium items-center text-blue-600 hover:underline"
        >
          Opt-In
          <svg
            className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
            />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default AdditionalFeatures
