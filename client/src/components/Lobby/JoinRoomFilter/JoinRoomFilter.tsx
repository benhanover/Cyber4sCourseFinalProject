import React from 'react'

// import types
import { newRoomFormProps } from './interfaces';
const JoinRoomForm: React.FC<newRoomFormProps> = ({joinFormStateManager, setJoinFormStateManager}) => {

  return (
    <div className='join-room-filter'>
      <select onChange={(e) => setJoinFormStateManager({...joinFormStateManager, subject: e.target.value})}>
        <option value="Math">Math</option>
        <option value="Programming">Programming</option>
      </select>
      <input
        placeholder="subSubject" 
        onChange={(e) => setJoinFormStateManager({...joinFormStateManager, subSubject: e.target.value})}
      />
      <input
              className="limit-input"
              type="number"
              onChange={(e) => setJoinFormStateManager({...joinFormStateManager, limit: e.target.value})}
              placeholder="limit"
              min="2"
              max="4"
              
      />
       <input
            name="isLocked"
            type="checkbox"
            onChange={(e) => setJoinFormStateManager({...joinFormStateManager, isLocked: e.target.checked})}

       />
       <input 
        placeholder="Search"
        onChange={(e) => setJoinFormStateManager({...joinFormStateManager, search: e.target.value})} />
    </div>
  )
}

export default JoinRoomForm
