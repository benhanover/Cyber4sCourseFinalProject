// import libraries
import React from 'react'
import { Link } from 'react-router-dom'

// import components
import SearchUser from '../SearchUser/SearchUser';
import LogoutButton from '../Common/LogoutButton/LougoutButton'

const Navbar: React.FC = () => {
  return (
    <nav>
      <Link to='/my-profile'>Profile</Link>
      <Link to='/lobby'>Lobby</Link>
      <SearchUser />
      <LogoutButton />
    </nav>
  )
}

export default Navbar
