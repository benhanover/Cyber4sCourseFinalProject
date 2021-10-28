import React, { LegacyRef, useRef, useState } from 'react'

// import types
import { newRoomFormProps } from './interfaces';
import './JoinRoomFilter.css'
import LockIcon from '@material-ui/icons/Lock';
import NoEncryptionIcon from '@material-ui/icons/NoEncryption';
import { getStreamId } from '../../VideoRoom/functions';
import { Tooltip } from '@material-ui/core';
import { Category, PeopleAlt, PeopleAltOutlined } from '@material-ui/icons';
const JoinRoomForm: React.FC<newRoomFormProps> = ({joinFormStateManager, setJoinFormStateManager}) => {
  const [shouldFilterByLimit, setShouldFilterByLimit] = useState(false);
  const limitRef = useRef<HTMLInputElement|null>(null);
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
          placeholder="Search" className="search"
              onChange={(e) => setJoinFormStateManager({ ...joinFormStateManager, search: e.target.value })} />
            </Tooltip>
        <div className="room-details-filter">
          <Tooltip title={`${shouldFilterByLimit ? 'Unfilter ': 'Filter '} Participants Limit`} placement="top">
              <div className="limit">
                {shouldFilterByLimit ?
                  (<PeopleAlt className="people-icon icon" onClick={() => { setShouldFilterByLimit(false); setJoinFormStateManager({ ...joinFormStateManager, limit: '' }); limitRef?.current && (limitRef.current.value = ''); }}/>)
                  : (<PeopleAltOutlined className="people-icon icon" onClick={() => { setShouldFilterByLimit(true) }}/>)}
                {shouldFilterByLimit &&
            
                  <input
                    className="limit-input"
                  type="number"
                  ref={limitRef}
                    onChange={(e) => setJoinFormStateManager({ ...joinFormStateManager, limit: limitRef?.current?.value })}
                    placeholder="limit"
                    min="2"
                    max="4"
              
                  />}
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
