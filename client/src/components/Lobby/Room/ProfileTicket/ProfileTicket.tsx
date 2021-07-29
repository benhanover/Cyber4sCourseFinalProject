import React, { useEffect } from "react";
import Network from "../../../../utils/network";
import { IprofileTicket } from "./interfaces";
import { useHistory } from "react-router";
import './ProfileTicket.css';
const ProfileTicket: React.FC<IprofileTicket> = ({ participants }) => {
  const history = useHistory();
  
  return (
    <div className="profile-ticket-container">
      {participants.map((participant: any, i: number) => {
        console.log(participant);
        
        return (
          <li className="profile-ticket" key={i}>
            <div className="profile-ticket-top">
              <div className="profile-display">

            <p className="profile-username">{participant.user.username}</p>
              <img className="profile-image"
                src={participant.user.profile.img}
                alt={participant.user.username + "profile"}
                />
                </div>
              <div className="profile-ticket-buttons">
              <button className="add-friend-button button">Add As Friend</button>
              <button className="show-contact-button button" onClick={(e) => {
                e.preventDefault();
                history.push(`/profile/${participant.user.username}`);
              }}>Go To Contact</button>
              </div>
            </div>
            <div className="profile-ticket-bottom">

            <div className="profile-age">
              <p className="age">{participant.age}</p><p  className="years-old" >years old</p>
            </div>
            <div className="profile-ticket-status">
              <p className="profile-status">{participant.user.profile.status === "Change me:)"? "- No Status -" : participant.user.profile.status}</p>
            </div>
            </div>
          </li>
        );
      })}
    </div>
  );
};

export default ProfileTicket;
