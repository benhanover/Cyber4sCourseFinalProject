import React from 'react'

// import types
import { newRoomFormProps } from './interfaces';
import './JoinRoomFilter.css'
import LockIcon from '@material-ui/icons/Lock';
import NoEncryptionIcon from '@material-ui/icons/NoEncryption';
import { getStreamId } from '../../VideoRoom/functions';
import { Tooltip } from '@material-ui/core';
import { Category, PeopleAlt } from '@material-ui/icons';
const JoinRoomForm: React.FC<newRoomFormProps> = ({joinFormStateManager, setJoinFormStateManager}) => {

  return (
    <div className='join-room-filter'>
      <h4>Find The Most Relevant Room For You:</h4>
      <div className="filter-form">

      <Tooltip title="Filter Room Subject" placement="top">
      <div className="subjects-filter-container">
            <Category className="category-icon icon" />
            <div className="subjects">

      <input className="subject-input" placeholder="Subject"  onChange={(e) => setJoinFormStateManager({...joinFormStateManager, subject: e.target.value})}/>
          <input
            className="subSubject-input"
            placeholder="SubSubject" 
            onChange={(e) => setJoinFormStateManager({...joinFormStateManager, subSubject: e.target.value})}
            />
            </div>
          </div>
        </Tooltip>
        <div className="room-filter-right">
        <Tooltip title="Filter By Title Or Description" placement="top">
          <input 
          placeholder="Title" className="search"
              onChange={(e) => setJoinFormStateManager({ ...joinFormStateManager, search: e.target.value })} />
            </Tooltip>
        <div className="room-details-filter">
          <Tooltip title={"Participants Limit"} placement="top">
            <div className="limit">
          <PeopleAlt className="people-icon icon" />
            
      <input
              className="limit-input"
              type="number"
              onChange={(e) => setJoinFormStateManager({...joinFormStateManager, limit: e.target.value})}
              placeholder="limit"
              min="2"
              max="4"
              
              />
              </div>
          </Tooltip>
          <Tooltip title={joinFormStateManager.isLocked?"Show Opened Rooms": "Show Locked Rooms"} placement="top">
            {joinFormStateManager.isLocked ? <LockIcon className="lock-icon icon" onClick={(e) => setJoinFormStateManager({ ...joinFormStateManager, isLocked: !joinFormStateManager.isLocked })} /> : <NoEncryptionIcon className="lock-icon icon" onClick={(e) => setJoinFormStateManager({ ...joinFormStateManager, isLocked: !joinFormStateManager.isLocked })}/>}
            </Tooltip>
            </div>
      
      </div>
      </div>
    </div>
  )
}

export default JoinRoomForm
