// import libraries
import { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom';

// import functions
import { getAllUsers, filterSearchedList } from './fuctions';

// import types
import { Iuser } from './interfaces'

// import css
import './SearchUser.css'

const SearchUser: React.FC = () => {
  const allUserRef = useRef<Iuser[]>();
  const [filteredUsers, setFilteredUsers] = useState<Iuser[]>();
  const history = useHistory();

  useEffect(() => {
    getAllUsers()
      .then((users: any) => {
        allUserRef.current = users;
      })
  }, [])

  const filterTable = (e: any) => {
    const str = e.target.value;
    setTimeout(() => {
      if(e.target.value === str) {
        setFilteredUsers(filterSearchedList(allUserRef.current, str))
      }
    }, 200);
  }

  return (
    <div className="search-user">
      <input onBlur={(e) => { e.target.value = ""; setFilteredUsers([]) }} onChange={(e) => filterTable(e)} placeholder='Search For A User..' />
      {
        filteredUsers &&
        <ul className="results">
            {
            filteredUsers.map((user: any, i: number) => {
              return (<li key={i} onClick={() => history.push(`/profile?username=${user.username}`)}>{user.username}</li>);
            })
          }
        </ul>
      }
    </div>
  )
}

export default SearchUser

