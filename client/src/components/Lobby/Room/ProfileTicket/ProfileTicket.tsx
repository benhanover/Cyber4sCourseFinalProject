import React, { useEffect } from "react";
import Network from "../../../../utils/network";
import { IprofileTicket } from "./interfaces";
import { useHistory } from "react-router";
const ProfileTicket: React.FC<IprofileTicket> = ({ participants }) => {
  const history = useHistory();
  return (
    <div>
      <h3>profileTicket</h3>
      {participants.map((item: any, i: number) => {
        return (
          <li key={i}>
            <img
              onClick={(e) => {
                e.preventDefault();
                history.push(`/profile?username=${item.user.username}`);
              }}
              src={item.user.profile.imageBlob}
            ></img>
            <p>{item.user.username}</p>
          </li>
        );
      })}
    </div>
  );
};

export default ProfileTicket;
