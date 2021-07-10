// import libraries
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
// import components
import SearchUser from '../SearchUser/SearchUser';
import LogoutButton from '../Common/LogoutButton/LougoutButton'
import { useSelector } from 'react-redux';
import { State } from '../../state';

const Navbar: React.FC = () => {
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
      <Link className="logo" to='/lobby'>Together</Link>
      <div className="options">
        <SearchUser />
        <div className="profile-menu-container" onMouseLeave={()=>setProfileMenu(false)}>
          <img className="profile-menu-button" src={user.profile.img} onClick={toggleProfileMenu}/>
          

            {profileMenu &&
          
          <ul className="profile-menu" >
            <li>
            <Link to='/my-profile'>My Profile</Link>
            </li>
            <li>
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
