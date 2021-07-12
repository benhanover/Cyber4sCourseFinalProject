// import libraries
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
// import css
import './Navbar.css'

// import interfaces
import {Iprops} from './interfaces';

// import components
import SearchUser from '../SearchUser/SearchUser';
import LogoutButton from '../Common/LogoutButton/LougoutButton'
import { useSelector } from 'react-redux';
import { State } from '../../state';

const Navbar: React.FC<Iprops> = ({setDisplayAccountSettings, displayAccountSettings}) => {
  const {user} = useSelector((state: State )  => state.ws)
  const [profileMenu, setProfileMenu] = useState(false)
  function toggleProfileMenu() {
    if (profileMenu) {
      setProfileMenu(false);
      return;
    }
    setProfileMenu(true);

  }
  
  return (
    <nav className="navbar" >
      <Link className="logo bold" to='/lobby'><h1>Room-In</h1></Link>
      <div className="options">
        <SearchUser />
        <div className="profile-menu-container">
          <img className="profile-menu-button" src={user.profile.img} onClick={toggleProfileMenu}/>
            {profileMenu &&
          
            <ul className="profile-menu dropdown_menu"  onMouseLeave={()=>setProfileMenu(false)} onClick={()=>setProfileMenu(false)} >
            <li className="cursor">
            
                <Link to='/my-profile' color='black'>Profile</Link>
              </li>
              <li className='cursor'>
                <span onClick={() => setDisplayAccountSettings(!displayAccountSettings)}>Account Settings</span>
              </li>
            <li className='cursor' >
                <LogoutButton />
              </li>
              
            </ul>
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar
