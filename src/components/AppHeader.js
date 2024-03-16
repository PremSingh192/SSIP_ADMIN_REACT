import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useContext , useState} from 'react'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import { Store } from 'src/views/forms/validation/store'

import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'

const AppHeader = () => {
  
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { profileDetails } = state
  const [adminEmail, setadminEmail] = useState("");
  
  useEffect(() => {
    if(profileDetails){
      setadminEmail(profileDetails.email)
    }
  }, [profileDetails]);

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CHeader position="sticky" className="mb-2">
      <CContainer fluid className='d-flex flex-wrap'>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>      
      
    </CHeader>
  )
}

export default AppHeader
