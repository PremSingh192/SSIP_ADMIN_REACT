import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Store } from "src/views/forms/validation/store";
import {base_url} from "src/base_url";


const useAPI = () => {  
  const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken , refreshToken, loader_state } = state

  const StoredTokens = {
    accessToken,
    refreshToken
  }
  const CallAPI = async (tokens=StoredTokens,reqInstance, endpoint, method, headers, body = null, params = null) => {    
    ctxDispatch({ type: 'LOADER_STATE', payload: true});
    headers['Authorization'] = `Bearer ${tokens.accessToken}`;    
    try {
      const response = await makeRequest(reqInstance, endpoint, method, headers, body, params);
      ctxDispatch({ type: 'LOADER_STATE', payload: false});
      return { error: false, response };
    } catch (error) {            
        if (error.response && error.response.status === 401) {
          const result = await expireToken(tokens.refreshToken);          
          if(result.access && result.refresh){
            const token_data = {
              "accessToken" : result.access,
              "refreshToken": result.refresh
            }
            localStorage.setItem('accessToken',result.access)
            localStorage.setItem('refreshToken',result.refresh)
            ctxDispatch({ type: 'ACCESS_TOKEN', payload: result.access});
            ctxDispatch({ type: 'REFRESH_TOKEN', payload: result.refresh });
            return CallAPI(token_data, reqInstance, endpoint, method, headers, body, params);
          }
          if(result.action == 'tokenExpired' && result.status === 401){
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            navigate('/auth/sign-in/')
            ctxDispatch({ type: 'LOADER_STATE', payload: false});
            return { error: true, result };
          }
        } else {
          ctxDispatch({ type: 'LOADER_STATE', payload: false});
          return { error: true, errorMessage: error.response.data || 'Unknown error' };
        }      
    }
  }
  return [StoredTokens,CallAPI]
};

const makeRequest = async (reqInstance, endpoint, method, headers, body, params) => {
  if (method === 'get') {
    return await axios.get(`${base_url}${endpoint}`, { headers, params });
  } else if (method === 'post') {
    return await axios.post(`${base_url}${endpoint}`, body, { headers });
  } else {
    throw new Error('Invalid HTTP method');
  }
};

const expireToken = async (refreshToken) => {
  const header = {
    'ngrok-skip-browser-warning': true,
  };  
  try {
    const response = await axios.post(`${base_url}/auth/api/token/refresh/, { refresh: ${refreshToken} }, { headers: header }`);
    return response.data;
  } catch (error) {
    if(error.response.status === 401){       
      return {'action':'tokenExpired','status':error.response.status};
    }
  }
};

export default useAPI;