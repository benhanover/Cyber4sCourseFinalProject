import React, { useEffect } from "react";
import Network from "../../../../utils/network";
import { IprofileTicket } from "./interfaces";
import { useHistory } from "react-router";
import './ProfileTicket.css';
const ProfileTicket: React.FC<IprofileTicket> = ({ participants }) => {
  const history = useHistory();
  return (
    <div className="profile-ticket-container">
      {participants.map((item: any, i: number) => {
        console.log(item);
        
        return (
          <li className="profile-ticket" key={i}>
            <div className="profile-ticket-general">
            <p className="profile-username">{item.user.username}</p>
              <p className="profile-status">{item.user.profile.status}</p>
              <div className="profile-ticket-buttons">
              <button className="add-friend-button button">Add As Friend</button>
              <button className="show-contact-button button">Go To Contact</button>
              </div>
            <img className="profile-image"
              onClick={(e) => {
                e.preventDefault();
                history.push(`/profile?username=${item.user.username}`);
              }}
              src={item.user.profile.imageBlob}
              alt={item.user.username + "profile"}
            />
            </div>
            <div className="profile-ticket-about">
              <p className="profile-about">{item.user.profile.about}</p>
            </div>
            <div className="profile-ticket-friends">{item.friendList?.map((friend: any) => { return <img src={friend} alt="friend-profile" /> })}
            </div>
          </li>
        );
      })}
    </div>
  );
};

export default ProfileTicket;
