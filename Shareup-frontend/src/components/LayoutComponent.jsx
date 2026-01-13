import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import UserContext from '../contexts/UserContext';
import AuthService from '../services/auth.services';
import ShareupInsideHeaderComponent from './dashboard/ShareupInsideHeaderComponent';
import FriendsWidgetComponent from './widgets/FriendsWidgetComponent';
import FollowingWidgetComponent from './widgets/FollowingWidgetComponent';
import GroupsWidgetComponent from './widgets/GroupsWidgetComponent';
import fileStorage from '../config/fileStorage';
import ReelsServices from '../services/ReelsServices';
import Popup from 'reactjs-popup';
import img1 from '../images/news1.jpg';
import './Layout.css';

export default function Layout(props) {
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const { user } = useContext(UserContext);
  const currentUser = props.user || user || null;
  const displayUsername = currentUser?.username || AuthService.getCurrentUser()?.username;

  const [refresh, setRefresh] = useState(null);
  const [filesReel, setFilesReel] = useState(null);
  const [ReelVideo, setReelVideo] = useState(null);
  const [ShowReelVideo, setShowReelVideo] = useState(false);
  const [uploadErrorReel, setUploadErrorReel] = useState('');
  const [reelPreviewPath, setReelPreviewPath] = useState(null);
  const [reelContent, setReelContent] = useState('');

  useEffect(() => {
    if (currentUser) setIsLoading(false);
  }, [currentUser]);

  // Resolve various backend profile-picture field names to a usable URL
  const resolveProfileImage = (u) => {
    if (!u) return "../assets/images/resources/admin.jpg";
    const pic = u.profile_picture || u.profilePicturePath || u.profilePicture || u.profilePictureUrl || null;
    if (!pic) return "../assets/images/resources/admin.jpg";
    if (typeof pic === 'string') {
      if (pic.startsWith('http')) return pic;
      if (pic.startsWith(fileStorage.baseUrl)) return pic;
      const path = pic.startsWith('/') ? pic : `/${pic}`;
      return fileStorage.baseUrl + path;
    }
    return "../assets/images/resources/admin.jpg";
  };

  useEffect(() => {
    getPreviewReel();
  }, [refresh]);

  const getPreviewReel = async () => {
    const authUser = AuthService.getCurrentUser();
    const username = props.user?.username || user?.username || authUser?.username;
    if (!username) return;
    try {
      const res = await ReelsServices.getPreviewReel(username);
      if (res?.data?.media && res.data.media.length > 0) setReelPreviewPath(res.data.media[0]);
    } catch (err) {
      console.error('getPreviewReel error', err);
    }
  };

  const uploadReels = (event) => {
    event.preventDefault();
    setUploadErrorReel('');

    if (!filesReel) {
      setUploadErrorReel('Please add reel video');
      return;
    }

    const formData = new FormData();
    formData.append('content', reelContent || '');
    formData.append('reelfiles', filesReel); // must match Multer field name

    ReelsServices.createReels(currentUser?.id, formData)
      .then((res) => {
        handleRemoveReelVideo();
        setRefresh(res.data);
      })
      .catch((err) => {
        console.error('Upload failed', err);
        setUploadErrorReel('Failed to upload reel');
      });
  };

  const handleFileReel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFilesReel(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setReelVideo(reader.result);
      }
    };
    reader.readAsDataURL(file);
    setShowReelVideo(true);
  };

  const handleRemoveReelVideo = () => {
    setFilesReel(null);
    setReelVideo(null);
    setShowReelVideo(false);
    setUploadErrorReel('');
  };

  const newsItems = [
    {
      headline: "Omicron variant of COVID-19: New travel guidelines to come into force from December 1",
      source: "Aljazeera Qatar News",
      link: "https://www.aljazeera.com/where/qatar/",
      date: "12/1/2021",
      image: img1
    },
    {
      headline: "Prime Minister Scott Morrison says big tech firms have responsibility to ensure their platforms are safe.",
      source: "Technology",
      link: "https://www.theverge.com/tech",
      date: "12/1/2021"
    },
    {
      headline: "Comprehensive Guide to Qatar Business ....",
      source: "Business",
      link: "https://thepeninsulaqatar.com/category/Qatar-Business",
      date: "12/1/2021"
    },
    {
      headline: "The #FIFArabCup Qatar 2021 kicks off today, coinciding with the inauguration of Al Bayt Stadium and Stadium 974",
      source: "Sports",
      link: "https://www.dohanews.co/category/sports/",
      date: "12/1/2021"
    }
  ];

  const menuItems = [
    { icon: "ti-clipboard", label: "NewsFeed", link: "/newsfeed" },
    { icon: "ti-write", label: "SavedShares", link: "/savedShares" },
    { icon: "ti-comments", label: "Messages", link: "/messages" },
    { icon: "ti-user", label: "ShareFriends", link: "/friends" },
    { icon: "ti-user", label: "Add Friends", link: "/Addfriends", badge: true },
    { icon: "ti-user", label: "ShareGroups", link: "/groups", doubleIcon: true },
    { icon: "ti-link", label: "SharePoint", link: "/shareFeed" },
    { icon: "ti-control-shuffle", label: "SwapPoint", link: "/swapFeed" }
  ];

  if (isLoading) return null;

  return (
    <>
      <ShareupInsideHeaderComponent user={currentUser} />
      
      <div className="layout-wrapper">
        <div className="layout-container">
          <div className="layout-grid">
            
            {/* Left Sidebar */}
            <aside className="left-sidebar">
              {/* User Profile Card */}
            <div className="profile-card">
    <div className="profile-avatar">
    <img src={resolveProfileImage(currentUser)} alt="" />
  </div>
  <a href="/profile" className="profile-name">
    {currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}` : 'User'}
  </a>
  {displayUsername && (
    <div className="profile-username">{displayUsername}</div>
  )}
</div>


              {/* Navigation Menu */}
              <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                  <a key={index} href={item.link} className="nav-link">
                    <div className="nav-icon">
                      <i className={item.icon} />
                      {item.doubleIcon && <i className={`${item.icon} double-icon`} />}
                      {item.badge && <span className="badge-plus">+</span>}
                    </div>
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
              {React.Children.map(props.children, (child) =>
                React.isValidElement(child) ? React.cloneElement(child, { user: currentUser }) : child
              )}
            </main>

            {/* Right Sidebar */}
            <aside className="right-sidebar">
              
              {/* Trending News */}
              <div className="widget-card">
                <div className="widget-header">
                  <i className="ti-bolt" />
                  <h6>What's Trending</h6>
                </div>
                <div className="widget-content">
                  {newsItems.map((news, index) => (
                    <div key={index} className="news-item">
                      {news.image && (
                        <div className="news-image">
                          <img src={news.image} alt="" />
                        </div>
                      )}
                      <p className="news-headline">{news.headline}</p>
                      <div className="news-meta">
                        <a href={news.link} target="_blank" rel="noreferrer" className="news-source">
                          {news.source}
                        </a>
                        <span className="news-date">{news.date}</span>
                      </div>
                    </div>
                  ))}
                  <a href="https://www.aljazeera.com/" target="_blank" rel="noreferrer" className="show-more">
                    Show More
                  </a>
                </div>
              </div>

              {/* Reels Widget */}
              <div className="widget-card">
                <div className="widget-header">
                  <i className="ti-video-clapper" />
                  <h6>Reels</h6>
                </div>
                
                <div className="widget-content">
                  {reelPreviewPath?.mediaPath ? (
                    <div className="reel-preview">
                      <video
                        loop
                        controls
                        muted
                        className="reel-video"
                        src={`${fileStorage.baseUrl}${reelPreviewPath.mediaPath}`}
                        type="video/mp4"
                      />
                    </div>
                  ) : (
                    <div className="no-reels">
                      <i className="ti-video-camera" />
                      <p>No Reels to show</p>
                    </div>
                  )}

                  <Popup 
                    trigger={<button className="widget-btn primary">Add Reel</button>} 
                    modal
                    closeOnDocumentClick
                  >
                    {(close) => (
                      <div className="reel-modal">
                        <div className="modal-header">
                          <h5>Add Reel Video</h5>
                          <button onClick={close} className="close-btn">
                            <i className="las la-times" />
                          </button>
                        </div>
                        
                        <div className="modal-body">
                          <div className="reel-content-input">
                            <label htmlFor="reel-content">Caption / Content</label>
                            <textarea
                              id="reel-content"
                              value={reelContent}
                              onChange={(e) => setReelContent(e.target.value)}
                              placeholder="Add a caption or description for your reel"
                              rows={3}
                            />
                          </div>
                          {ShowReelVideo ? (
                            <div className="video-preview">
                              <video id="video" controls className="preview-video">
                                <source src={ReelVideo} />
                              </video>
                              <button onClick={handleRemoveReelVideo} className="remove-video-btn">
                                <i className="las la-times" />
                              </button>
                            </div>
                          ) : (
                            <label className="upload-area">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileReel}
                                style={{ display: 'none' }}
                              />
                              <div className="upload-content">
                                <i className="ti-video-camera" />
                                <p>Click to upload reel video</p>
                              </div>
                            </label>
                          )}
                          {uploadErrorReel && <div className="error-msg">{uploadErrorReel}</div>}
                        </div>

                        {ShowReelVideo && (
                          <div className="modal-footer">
                            <button onClick={(e) => { uploadReels(e); close(); }} className="upload-btn">
                              Upload Reel
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </Popup>

                  <a href="/reelFeed" className="widget-btn secondary">
                    Explore Reels
                  </a>
                </div>
              </div>

              {/* Widget Components */}
              <FriendsWidgetComponent />
              <FollowingWidgetComponent />
              <GroupsWidgetComponent />
            </aside>

          </div>
        </div>
      </div>
    </>
  );
}
