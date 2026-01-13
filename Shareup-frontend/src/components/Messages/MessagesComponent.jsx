import React, { useState, useEffect, useContext, useRef, } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import { testScript } from '../../js/script';
import FriendsService from '../../services/FriendService';
import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';


function MessagesComponent() {

    const history = useHistory();
    const { user } = useContext(UserContext)

    // const []

    // const inputRef = createRef();



    const [friendsList, setFriendsList] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [stories, setStories] = useState([]);
    const [refresh, setRefresh] = useState(null)
    const [userR, setUserR] = useState(null);
    const activeUser = user || userR || {};
    const [searchedUser, setSearchedUser] = useState([]);

    const handleChat = (userM) => {
        setUserR(userM)
    }
    const handleSearchedUser = (event) => {
        const normalize = (value) => (value ?? "").toString().toLowerCase();
        const searchedValue = normalize(event?.target?.value);

        if (!searchedValue) {
            setSearchedUser(allUser);
            return;
        }

        const filtered = (allUser || []).filter((u) => {
            const email = normalize(u?.email);
            const firstname = normalize(u?.firstName);
            const lastname = normalize(u?.lastName);
            return (
                email.includes(searchedValue) ||
                firstname.includes(searchedValue) ||
                lastname.includes(searchedValue)
            );
        });

        setSearchedUser(filtered);
    }
    const getAllUser = async () => {
    try {
        const res = await UserService.getUsers();

        const users =
            Array.isArray(res.data) ? res.data :
            Array.isArray(res.data.users) ? res.data.users :
            Array.isArray(res.data.data) ? res.data.data :
            [];

        setAllUser(users);
        setSearchedUser(users);
    } catch (err) {
        console.error("Failed to load users", err);
        setAllUser([]);
        setSearchedUser([]);
    }
};
    const getFriendsList = async () => {
        const jwtUser = AuthService.getCurrentUser();
        if (!jwtUser || !jwtUser.username) return;
        await FriendsService.getFriends(jwtUser.username).then(res => {
            setFriendsList(res.data)
        })
    }

    useEffect(() => {
        getAllUser()
        getFriendsList()
        testScript()
    }, [])


    return (<>
        <ShareupInsideHeaderComponent />
        <div className="central-message">
            <div className="left-message">
                <div className="msgHead">

                    <a href={`/profile/${activeUser.email || ''}`} title={`${activeUser.email || ''}`}>
                        <img className="msgprof" style={{ objectFit: 'cover' }} src={fileStorage.baseUrl + (activeUser.profilePicturePath || '')} alt="" /><span style={{ paddingLeft: '10px', fontWeight: 'bold', fontSize: '15px' }}>{`${activeUser.firstName || ''} ${activeUser.lastName || ''}`}</span>
                        <span style={{ paddingLeft: '20px', fontWeight: '900' }}><img src="/assets/images/msgarrw.svg" /></span></a>
                </div>
                <div className="search-container" style={{ paddingBottom: '16px', borderBottom: '1px solid #cecece' }} >
                    {/* <i className="las la-search"></i> */}
                    <input className="friend-search"  style={{ width: '95%', marginTop: '21px' }}
                     type="text" id="header-search" placeholder="Search Users" name="s" onChange={handleSearchedUser} />
                </div>
                <div className="cntnrScrll">
                    <ul className="nearby-contct" style={{padding:'10px'}}>

                        {searchedUser.map(
                            userM =>
                                (activeUser.id !== userM.id) ?
                                    <li key={userM.id} className="friends-card grp"  style={{background:'#e9e9e9'}}>
                                        <a  href="#!" onClick={() => handleChat(userM)} > 
                                        <div className="grid-container" style={{height: '75px !important' }}>
                                            {/* <figure> */}
                                            <div className="item1">
                                                <a href={`/profile/${userM.email}`} title={`${userM.email}`}>
                                                    <img style={{ objectFit: 'cover' }} src={fileStorage.baseUrl + userM.profilePicturePath} alt="" /></a>
                                                {/* </figure> */}

                                            </div>
                                            <div className="item2" style={{width:'65%', padding:'10px', paddingLeft:'20px'}}>
                                                <p className="nameTagMsg" style={{lineHeight:'16px', fontSize: '15px'}}>
                                                    {`${userM.firstName} ${userM.lastName}`}
                                                    
                                                    </p>
                                                <div className="item5 actv"  style={{width: 'fit-Content', alignItems:'unset', paddingTop:'6px'}}>Active 2 mints ago</div>
                                            </div>
                                            {/* <div className="  "> */}
                                        </div></a>
                                    </li>
                                    : null
                        )}
                    </ul></div>
            </div>

            <div className="right-message ">
                <div style={{ height: '10%' }}><div className="msgTop">
                    {userR ?
                        <a href={`/profile/${userR.email}`} title={`${userR.email}`}><img className="msgprof" style={{ objectFit: 'cover' }} src={fileStorage.baseUrl + userR.profilePicturePath} alt="" /><span style={{ paddingLeft: '10px', fontWeight: 'bold', fontSize: '15px' }}>{`${userR.firstName} ${userR.lastName}`}</span>
                        </a> : <a href="#" title="user"><img className="msgprof" style={{ objectFit: 'cover' }} src="https://freeiconshop.com/wp-content/uploads/edd/many-people-outline.png" alt="" /><span style={{ paddingLeft: '10px', fontWeight: 'bold', fontSize: '15px' }}>User</span>
                        </a>}
                    <div className="msgic">
                        <div style={{ paddingRight: '10px', display: 'inline' }}>
                            <img src="/assets/images/callicon.svg" />
                        </div>
                        <div style={{ paddingRight: '10px', display: 'inline' }}>
                            <img src="/assets/images/videoicon.svg" /></div>
                    </div>
                </div>

                </div>
                <div className="AreaMsg"></div>
                <div className="txtAreaMsg"><input className="chat-text" placeholder="Type message here" name="s" >

                </input>
                    <div className="add-microphicon" style={{ right: '55px'}}> <img width="20" src="/assets/images/picmsg.svg" /></div>
                    <div className="add-stckricon" style={{ right: '85px'}}> <img width="20" src="/assets/images/stckrmsg.svg" /></div>
                    <div className="add-picicon" style={{ right: '115px'}} > <img width="20" src="/assets/images/mic.svg" /></div>
                    <button id="sendBtn" style={{
                         position: 'absolute' , right: '4px', top: '3px',fontSize: '17px', border: '0px', borderRadius: '5px',  padding: '2px',
    color: 'white',
    background: '#033347'}}>Send</button>
                </div>
            </div>

        </div>



    </>

    );
}

export default MessagesComponent;