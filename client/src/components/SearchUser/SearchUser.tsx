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
  const [filteredUsers, setFilteredUsers] = useState<Iuser[]>();
  const allUserRef = useRef<Iuser[]>();
  const searchRef = useRef<any>();
  const history = useHistory();

  useEffect(() => {
    getAllUsers()
      .then((users: any) => {
        allUserRef.current = users.filter((filterUser: any) => filterUser.username !== user.username);
      });
  }, []);


  return (
    <div className="search-user"
      
    >
      <input className='search-input' ref={searchRef}
      onChange={(e) =>  setFilteredUsers(filterSearchedList(allUserRef.current, e.target.value))} placeholder='Search For A User..' />
      {
        filteredUsers && filteredUsers.length > 0 &&
        <ul className="results" onMouseLeave={() => {
          searchRef.current.value = "";
          setFilteredUsers([]);
        }}>
            {
            filteredUsers
            .slice(0, 10)
            .map((user: any, i: number) => {
              return (<li key={i} onClick={() => {
                searchRef.current.value = ""; 
                setFilteredUsers([]);
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

