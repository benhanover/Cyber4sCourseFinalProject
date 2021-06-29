// import libraries
import { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom';

// import functions
import { getAllUsers, filterSearchedList } from './fuctions';

// import types
import { Iuser } from './interfaces'

const SearchUser: React.FC = () => {
  const allUsersRef = useRef<Iuser[]>();
  const [allUsers, setAllUsers] = useState<Iuser[]>();
  const history = useHistory();

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
            allUsers.map((user: any, i: number) => {
              return (<li key={i} onClick={() => history.push(`/profile?username=${user.username}`)}>{user.username}</li>);
            })
          }
        </ul>
      }
    </div>
  )
}

export default SearchUser

