// import libraries
import React from 'react'
import { Link } from 'react-router-dom'

// import components
import SearchUser from '../SearchUser/SearchUser';

const Navbar: React.FC = () => {
  return (
    <nav>
      <Link to='/profile'>Profile</Link>
      <Link to='/lobby'>Lobby</Link>
      <SearchUser />
    </nav>
  )
}

export default Navbar
