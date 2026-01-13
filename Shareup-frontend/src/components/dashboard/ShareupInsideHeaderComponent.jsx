import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import AuthService from '../../services/auth.services';
import FriendsService from '../../services/FriendService';
import UserService from '../../services/UserService';
import fileStorage from "../../config/fileStorage";
import { useSelector } from "react-redux";
import { store } from "../../app/store";
import { setSearchTerm } from "../../app/searchSlice";
import './ShareupHeader.css';

function ShareupInsideHeaderComponent({ user: propUser }) {
  const history = useHistory();
  const [user, setUser] = useState(propUser || {});
  const [friendsList, setFriendsList] = useState([]);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const searchTerm = useSelector((state) => state.search);

  const KeyPressHandler = (event) => {
    if (event.key === 'Enter' && event.target.value !== '') {
      history.push("/searchFeed");
    }
  };

  // Fetch current logged-in user
  const currentUserGet = async () => {
    const jwtUser = AuthService.getCurrentUser();
    if (!jwtUser || !jwtUser.username) return;

    try {
      const res = await UserService.getUserByEmail(jwtUser.username);
      // API returns { data: user } — support either shape for safety
      const payload = (res && res.data && res.data.data) ? res.data.data : (res && res.data) ? res.data : null;
      if (payload) {
        // normalize possible profile picture keys from backend
        const profilePic = payload.profilePicturePath || payload.profile_picture || payload.profilePicture || payload.profilePictureUrl || null;
        setUser({
          ...payload,
          profile_picture: profilePic,
        });
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  // Fetch friends list
  const getFriendsList = async () => {
    const jwtUser = AuthService.getCurrentUser();
    if (!jwtUser || !jwtUser.username) return;
    try {
      const res = await FriendsService.getFriends(jwtUser.username);
      setFriendsList(res.data || []);
    } catch (err) {
      console.error("Error fetching friends list:", err);
    }
  };

  // Logout
  const handleLogout = () => {
    AuthService.logout();
    history.push("/");
  };

  useEffect(() => {
    getFriendsList();
  }, []);

  useEffect(() => {
    if (!propUser) {
      currentUserGet();
    } else {
      const profilePic = propUser.profilePicturePath || propUser.profile_picture || propUser.profilePicture || propUser.profilePictureUrl || null;
      setUser({
        ...propUser,
        profile_picture: profilePic,
      });
    }
  }, [propUser]);

  // Determine proper profile image URL
  const getProfileImage = () => {
    const pic = user?.profile_picture;
    if (!pic) return "../assets/images/resources/admin.jpg";
    if (typeof pic === 'string') {
      if (pic.startsWith('http')) return pic;
      // If backend returned a path that already includes base url, avoid double-adding
      if (pic.startsWith(fileStorage.baseUrl)) return pic;
      // ensure leading slash
      const path = pic.startsWith('/') ? pic : `/${pic}`;
      return fileStorage.baseUrl + path;
    }
    return "../assets/images/resources/admin.jpg";
  };

  return (
    <header className="shareup-header">
      <div className="header-container">
        {/* Left Section */}
        <div className="header-left">
          <nav className="header-nav">
            <a href="/newsfeed" className="nav-item" title="Home">
              <i className="las la-home" />
              <span>Feed</span>
            </a>
            <a href="/friends" className="nav-item" title="Friends">
              <i className="las la-user-plus" />
              <span>Friends</span>
            </a>
            <a href="/groups" className="nav-item" title="Groups">
              <i className="la la-users" />
              <span>Groups</span>
            </a>
            <a href="/shareFeed" className="nav-item" title="SharePoint">
              <i className="la la-share-alt" />
              <span>Share</span>
            </a>
            <a href="/swapFeed" className="nav-item" title="SwapPoint">
              <i className="las la-sync-alt" />
              <span>Swap</span>
            </a>
          </nav>
        </div>

        {/* Center Section */}
        <div className="header-logo">
          <a href="/newsfeed" title="ShareUp Home">
            <img src="../assets/images/Mainlogo.png" alt="ShareUp" />
          </a>
        </div>

        {/* Right Section */}
        <div className="header-actions">
          {/* Search */}
          <div className="search-container">
            <i className="las la-search search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search ShareUpTime Members..."
              value={searchTerm}
              onChange={(e) => store.dispatch(setSearchTerm(e.target.value))}
              onKeyUp={KeyPressHandler}
            />
          </div>

          {/* Notifications */}
          <div className="action-item">
            <button 
              className="action-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <i className="ti-bell" />
              <span className="badge">20</span>
            </button>
            {showNotifications && (
              <div className="dropdown-menu notifications-dropdown">
                <div className="dropdown-header">
                  <h6>Notifications</h6>
                  <span className="count">4 New</span>
                </div>
                <div className="dropdown-content">
                  {[1,2,3].map((item) => (
                    <a href="/notifications" key={item} className="dropdown-item">
                      <img src={`../assets/images/resources/thumb-${item}.jpg`} alt="" />
                      <div className="item-content">
                        <h6>User Name</h6>
                        <p>Hi, how r u dear ...?</p>
                        <small>2 min ago</small>
                      </div>
                      <span className="item-badge new">New</span>
                    </a>
                  ))}
                </div>
                <a href="/notifications" className="dropdown-footer">View all notifications</a>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="action-item">
            <button 
              className="action-btn"
              onClick={() => setShowMessages(!showMessages)}
              title="Messages"
            >
              <i className="ti-comment" />
              <span className="badge">12</span>
            </button>
            {showMessages && (
              <div className="dropdown-menu messages-dropdown">
                <div className="dropdown-header">
                  <h6>Messages</h6>
                  <span className="count">5 New</span>
                </div>
                <div className="dropdown-content">
                  {[1,2,3].map((item) => (
                    <a href="/notifications" key={item} className="dropdown-item">
                      <img src={`../assets/images/resources/thumb-${item}.jpg`} alt="" />
                      <div className="item-content">
                        <h6>User Name</h6>
                        <p>Hi, how r u dear ...?</p>
                        <small>2 min ago</small>
                      </div>
                      <span className="item-badge new">New</span>
                    </a>
                  ))}
                </div>
                <a href="/messages.html" className="dropdown-footer">View all messages</a>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="user-profile">
            <button 
              className="profile-btn"
              onClick={() => setShowUserSettings(!showUserSettings)}
            >
              <img
                src={getProfileImage()}
                alt="Profile"
              />
              <span className="status-indicator online" />
            </button>
            {showUserSettings && (
              <div className="dropdown-menu profile-dropdown">
                <div className="status-section">
                  <a href="#!" className="dropdown-link status-link">
                    <span className="status-indicator online"></span> online
                  </a>
                  <a href="#!" className="dropdown-link status-link">
                    <span className="status-indicator away"></span> away
                  </a>
                  <a href="#!" className="dropdown-link status-link">
                    <span className="status-indicator offline"></span> offline
                  </a>
                </div>
                <div className="dropdown-divider" />
                <a href="/profile" className="dropdown-link"><i className="ti-user" /> view profile</a>
                <a href="/editprofile" className="dropdown-link"><i className="ti-pencil-alt" /> edit profile</a>
                <a href="/Activity" className="dropdown-link"><i className="ti-target" /> activity log</a>
                <a href="/Security" className="dropdown-link"><i className="ti-settings" /> account setting</a>
                <div className="dropdown-divider" />
                <a href="#!" onClick={handleLogout} className="dropdown-link logout">
                  <i className="ti-power-off" /> log out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default ShareupInsideHeaderComponent;
