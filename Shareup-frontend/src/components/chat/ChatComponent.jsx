import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import FriendsService from '../../services/FriendService';
import "./chatStyle.css";
import "./chat.js";
import { useJwt } from "react-jwt";

function ChatComponent() {
  const history = useHistory();

  const { user } = useContext(UserContext)

  // const []

  const [allUser, setAllUser] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);


  const sendMessges=()=>{
    


  }
  const addFriendsId = (uid,fid) => {
    FriendsService.addFriends(uid,fid).then(res => {
      window.location.reload();
    })
  }

  const removeFriend = (uid,fid) => {
    FriendsService.removeFriends(uid,fid).then(res => {
      window.location.reload();
    })
  }

  const getAllUser = async () => {
    await UserService.getUsers().then(res => {
      setAllUser(res.data)
      setSearchedUser(res.data)
    })
  }

  const getFriendsList = async () => {
    const jwtUser = AuthService.getCurrentUser();
    if (!jwtUser || !jwtUser.username) return;
    await FriendsService.getFriends(jwtUser.username).then(res => {
      setFriendsList(res.data)
    })
  }

  const getsadasd = (event) => {
  }

  const handleSearchedUser = (event) => {
    if(event.target.value === ""){
      setSearchedUser(allUser) 
    }else{
      const temp = []
      allUser.map(u => {
        if(u.email.includes(event.target.value)){
          temp.push(u)
        }
      })
      setSearchedUser(temp)
    }
    
  }

  useEffect(() => {
    getAllUser()
    getFriendsList()
  }, [])

  return (
    <div className="container clearfix">
    <div className="people-list" id="people-list">
      <div className="search">
        <input id="userName" placeholder="search" type="text" />
        <button onClick="registration()">Enter the chat</button>
        <button onClick="fetchAll()">Refresh</button>
      </div>
      <ul className="list" id="usersList">
      </ul>
    </div>
    <div className="chat">
      <div className="chat-header clearfix">
        <img alt="avatar" height="55px" src="https://w7.pngwing.com/pngs/643/454/png-transparent-business-game-avatar-computer-program-google-smart-object-game-child-face.png" width="55px" />
        <div className="chat-about">
          <div className="chat-with" id="selectedUserId" />
          <div className="chat-num-messages" />
        </div>
        <i className="fa fa-star" />
      </div> {/* end chat-header */}
      <div className="chat-history">
        <ul>
        </ul>
      </div> {/* end chat-history */}
      <div className="chat-message clearfix">
        <textarea id="message-to-send" name="message-to-send" placeholder="Type your message here" onKeyPress={(e) => { if (e.key === 'Enter') sendMessges(); }} rows={3} defaultValue={""} />
        <i className="fa fa-file-o" /> &nbsp;&nbsp;&nbsp;
        <i className="fa fa-file-image-o" />
        <button id="sendBtn">Send</button>
      </div> {/* end chat-message */}
    </div> {/* end chat */}
  </div>

  );
}
export default ChatComponent;