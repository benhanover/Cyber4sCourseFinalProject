// import libraries
import { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom';

// import functions
import { getAllUsers, filterSearchedList } from './fuctions';

// redux
import { useSelector } from "react-redux";
import { State } from "../../state";

// import types
import { Iuser } from './interfaces'

// import css
import './SearchUser.css'

const SearchUser: React.FC = () => {

  const { user } = useSelector((state: State) => state.ws);
  const allUserRef = useRef<Iuser[]>();
  const searchRef = useRef<any>();
  const [filteredUsers, setFilteredUsers] = useState<Iuser[]>();
  const history = useHistory();

  useEffect(() => {
    getAllUsers()
      .then((users: any) => {
        allUserRef.current = users.filter((filterUser: any) => filterUser.username !== user.username);
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
    <div className="search-user"
      // onMouseLeave={() => setTimeout(() => { setFilteredUsers([]) }, 1000)}
    >
      <input ref={searchRef}
      //   onBlur={(e) => {
      //   e.target.value = ""; setFilteredUsers([])
      // }} 
      onChange={(e) => filterTable(e)} placeholder='Search For A User..' />
      {
        filteredUsers &&
        <ul className="results">
            {
            filteredUsers.map((user: any, i: number) => {
              return (<li key={i} onClick={() => {
                searchRef.current.value = ""; 
                setFilteredUsers([]);
                // history.push(`/profile?username=${user.username}`)    
                history.push(`/profile/${user.username}`)    
              }
              }>{user.username}</li>);
            })
          }
        </ul>
      }
    </div>
  )
}

export default SearchUser

