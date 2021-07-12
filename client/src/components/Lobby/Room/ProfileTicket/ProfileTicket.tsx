import React, { useEffect } from "react";
import Network from "../../../../utils/network";
import { IprofileTicket } from "./interfaces";
import { useHistory } from "react-router";
import './ProfileTicket.css';
const ProfileTicket: React.FC<IprofileTicket> = ({ participants }) => {
  const history = useHistory();
  console.log(participants);
  
  return (
    <div className="profile-ticket-container">
      {participants.map((item: any, i: number) => {
        console.log(item);
        
        return (
          <li className="profile-ticket" key={i}>
            <div className="profile-ticket-top">
              <div className="profile-display">

            <p className="profile-username">{item.user.username}</p>
              <img className="profile-image"
                src={item.user.profile.img}
                alt={item.user.username + "profile"}
                />
                </div>
              <div className="profile-ticket-buttons">
              <button className="add-friend-button button">Add As Friend</button>
              <button className="show-contact-button button" onClick={(e) => {
                e.preventDefault();
                history.push(`/profile/${item.user.username}`);
              }}>Go To Contact</button>
              </div>
            </div>
            <div className="profile-ticket-bottom">

            <div className="profile-age">
              <p className="age">{item.user.age}</p><p  className="years-old" >years old</p>
            </div>
            <div className="profile-ticket-status">
              <p className="profile-status">{item.user.profile.status === "Change me:)"? "- No Status -" : item.user.profile.status}</p>
            </div>
            </div>
          </li>
        );
      })}
    </div>
  );
};

export default ProfileTicket;
