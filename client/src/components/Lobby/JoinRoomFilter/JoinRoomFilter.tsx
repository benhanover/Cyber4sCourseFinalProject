import React from 'react'

// import types
import { newRoomFormProps } from './interfaces';
import './JoinRoomFilter.css'
import LockIcon from '@material-ui/icons/Lock';
import NoEncryptionIcon from '@material-ui/icons/NoEncryption';
import { getStreamId } from '../../VideoRoom/functions';
const JoinRoomForm: React.FC<newRoomFormProps> = ({joinFormStateManager, setJoinFormStateManager}) => {

  return (
    <div className='join-room-filter'>
      <h4>Find The Most Relevant Room For You:</h4>
      <div className="filter-form">

      <div className="subjects-filter-container">

      <select className="subject-input" onChange={(e) => setJoinFormStateManager({...joinFormStateManager, subject: e.target.value})}>
        <option value="Math">Math</option>
        <option value="Programming">Programming</option>
      </select>
          <input
            className="subSubject-input"
        placeholder="subSubject" 
        onChange={(e) => setJoinFormStateManager({...joinFormStateManager, subSubject: e.target.value})}
        />
        </div>
        <div className="room-details-filter">

      <input
              className="limit-input"
              type="number"
              onChange={(e) => setJoinFormStateManager({...joinFormStateManager, limit: e.target.value})}
              placeholder="limit"
              min="2"
              max="4"
              
          />
          <div className="locked-button" onClick={(e) => setJoinFormStateManager({...joinFormStateManager, isLocked: !joinFormStateManager.isLocked})}>
            {joinFormStateManager.isLocked ? <LockIcon className="lock-icon" /> : <NoEncryptionIcon className="lock-icon" />}
          </div>
            </div>
       <input 
        placeholder="Search"
        onChange={(e) => setJoinFormStateManager({...joinFormStateManager, search: e.target.value})} />
        </div>
    </div>
  )
}

export default JoinRoomForm
