// import libraries
import { useEffect, useState, useRef } from 'react'

// import functions
import { getAllUsers, filterSearchedList } from './fuctions';

// import types
import { Iuser } from './interfaces'

const SearchUser: React.FC = () => {
  const allUsersRef = useRef();
  const [allUsers, setAllUsers] = useState<Iuser[]>();


  useEffect(() => {
    getAllUsers()
      .then((users: any) => {
        setAllUsers(users)
        allUsersRef.current = users;
      })
  }, [])

  const filterTable = (e: any) => {
    const str = e.target.value;
    setTimeout(() => {
      if(e.target.value === str) {
        setAllUsers(filterSearchedList(allUsersRef.current, str))
      }
    }, 200);
  }

  return (
    <div>
      <h1>Search For User</h1>
      <input onChange={(e) => filterTable(e)} placeholder='Search For A User..' />    
      {
        allUsers&&
        <ul>
            {
            allUsers.map((user: any) => {
              return (<li>{user.username}</li>);
            })
          }
        </ul>
      }
    </div>
  )
}

export default SearchUser

