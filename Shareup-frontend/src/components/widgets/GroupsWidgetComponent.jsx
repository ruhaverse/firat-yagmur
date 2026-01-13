import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import FriendsService from '../../services/FriendService';
import GroupService from '../../services/GroupService';
import Grpicon from '../../images/grpicon.png'
import fileStorage from '../../config/fileStorage';


function GroupsWidgetComponent() {
    const history = useHistory();

    const { user } = useContext(UserContext)

    const [friendsList, setFriendsList] = useState([])

    const getFriendsList = async () => {
        const jwtUser = AuthService.getCurrentUser();
        if (!jwtUser || !jwtUser.username) return;
        await FriendsService.getFriends(jwtUser.username).then(res => {
            setFriendsList(res.data)
        })
    }

    const [allGroups, setAllGroups] = useState([]);
    const [searchedGroups, setSearchedGroups] = useState([]);

    const getAllGroups = async () => {
        await GroupService.getAllGroups().then(res => {
            const data = Array.isArray(res.data) ? res.data : (res.data && Array.isArray(res.data.data) ? res.data.data : []);
            setAllGroups(data)
            setSearchedGroups(data)
        })
    }

    const handleSearchGroup = () => {
    }

    useEffect(() => {
        const abortCtrl = new AbortController();
        const opts = {signal: abortCtrl.signal };
        getAllGroups()
        return () => abortCtrl.abort()
    }, [])


    return (

        <div className="widget friend-list stick-widget" >
            <div className="row">
                <img src="../assets/images/b76706b9814f347e841ff15b89a5d170-instagram-discover-people-icon-by-vexels.png" style={{width:'14%'}}/>
                <p className="widget-title" style={{position:'absolute', left: '50px',}}>Groups</p></div>
            {/* <div id="searchDir" /> */}
            <ul className="nearby-contct sidebar-grp">
                {(Array.isArray(searchedGroups) ? searchedGroups : []).slice(0,4).map(
                    group =>
                    <li key={group.id}>
                    <div className="nearly-pepls" style={{display:'flex' ,background:'white' ,padding:'10px'}}>
                        <figure>
                            {}
                            <a href={`/groups/${group.id}`} title="#"> <img src={group.groupImagePath ? fileStorage.baseUrl+group.groupImagePath : Grpicon} alt="" /></a>
                        </figure>
                        <div className="pepl-info">
                            <h4><a href={`/groups/${group.id}`} title="#">{`${group.name}`}</a></h4>
                            <span>{`${group.description}`}</span>

                        </div>
                        <button className="button" style={{width:'60px',margin:'10px',padding:'0 5px'}}>Join</button>
                    </div>
                </li>
                )}
            </ul>
        </div>
    );
}
export default GroupsWidgetComponent;