import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import './css/main.min.css';
import './css/style.css';
import './css/slider.css';

import './css/color.css';
import './css/responsive.css';
import './css/responsive-fix.css';
import './css/styleguide.css';
import './css/notifications.css';
import './css/globals.css';
import AuthService from './services/auth.services';
import { useLocation, BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Removed local FontAwesome and Emojionearea CSS imports
import HeaderComponent from './components/dashboard/HeaderComponent.jsx';
import AddFriendsComponent from './components/user/AddFriendsComponent';
import FriendsComponent from './components/user/FriendsComponent';
import NewsfeedComponent from './components/user/NewsfeedComponent';
import ChatComponent from './components/chat/ChatComponent';
import Index from './components/user/Index';
import UserService from './services/UserService';
import UserContext from './contexts/UserContext';
import GroupComponent from './components/group/GroupComponent';
import ProfileComponent from './components/user/ProfileComponent';
import ViewGroupComponent from './components/group/ViewGroupComponent';
import AboutComponent from './components/user/AboutComponent';
import PrivacyPolicyComponent from './components/user/PrivacyPolicyComponent';
import { testScript } from './js/script';
import ProtectedRoute from './components/ProtectedRoute';
import OtherProfileComponent from './components/user/OtherProfileComponent';
import CreateGroupComponentMain from './components/group/CreateGroupComponentMain';
import GuideComponent from './components/user/GuideComponent';
import NotificationChatComponent from './components/user/NotificationChatComponent';
import ShareFeedComponent from './components/user/ShareFeedComponent';
import SwapFeedComponent from './components/user/SwapFeedComponent';
import ReelFeedComponent from './components/user/ReelFeedComponent';
import ActivityComponent from './components/user/ActivityComponent';
import SecuritySettingsComponent from './components/AccountSettings/SecuritySettingsComponent';
import HangGiftComponent from './components/Hang/HangGiftComponent';
import ShippingComponent from './components/Hang/ShippingComponent';
import CheckoutComponent from './components/Hang/CheckoutComponent';
import EditProfileComponent from './components/user/EditProfileComponent';
import SwapComponent from './components/SwapPoint/SwapComponent';
import PayConfirmComponent from './components/Hang/PayConfirmComponent';
import SavedSharesComponent from './components/post/SavedSharesComponent';
import ShareItemComponent from './components/share/ShareItemComponent';
import ChatTestComponent from './components/ChatTest/ChatTestComponent';
import DisplayComponent from './components/Stories/DisplayComponent';
import MessagesComponent from './components/Messages/MessagesComponent';
import LocationComponent from './components/AccountSettings/LocationComponent';
import SearchFeedComponent from './components/user/SearchFeedComponent';

import ForgotPasswordComponent from './components/user/ForgotPasswordComponent.jsx';





import Giphy from './components/Giphy';


// import StoriesComponentMain from './components/Stories/StoriesComponent';

// Component to conditionally render HeaderComponent based on route
function ConditionalHeader() {
  const location = useLocation();
  
  useEffect(() => {
    // Add class to body for landing/public pages
    const publicPages = ['/', '/about', '/privacyPolicy'];
    if (publicPages.includes(location.pathname)) {
      document.body.classList.add('landing-page');
    } else {
      document.body.classList.remove('landing-page');
    }
  }, [location]);
  
  return <HeaderComponent />;
}

function App() {
  testScript()

  const [jwtUser, setJwtUser] = useState(AuthService.getCurrentUser())
  const [user, setUser] = useState([])

  const authKey = useMemo(() => {
    const username = jwtUser?.username || '';
    const jwt = jwtUser?.jwt || '';
    return `${username}|${jwt}`;
  }, [jwtUser?.username, jwtUser?.jwt]);

  const lastAuthKeyRef = useRef(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    // Not logged in (or invalid), do not overwrite stored auth
    if (!jwtUser?.jwt || !jwtUser?.username) {
      lastAuthKeyRef.current = null;
      setUser(null);
      return;
    }

    // Dedupe: only fetch once per unique authKey
    if (lastAuthKeyRef.current === authKey || inFlightRef.current) {
      return;
    }

    lastAuthKeyRef.current = authKey;
    inFlightRef.current = true;
    let cancelled = false;

    (async () => {
      try {
        await AuthService.setCurrentUser(jwtUser);
        const res = await UserService.getUserByEmail(jwtUser.username);
        if (!cancelled) {
          // axios response body is { data: <user> } so prefer res.data.data
          const u = res.data?.data ?? res.data ?? {};
          const normalized = {
            id: u.id,
            email: u.email || u.email_address,
            firstName: u.first_name || u.firstName || '',
            lastName: u.last_name || u.lastName || '',
            profilePicturePath: u.profile_picture || u.profilePicturePath || '',
            bio: u.bio || '',
            location: u.location || ''
          };
          setUser(normalized);
        }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 429) {
          // Rate-limited: don't crash the app; keep current user state as-is.
          console.warn('Rate limited (429) while fetching user; will not retry immediately.');
        } else {
          console.error('userAuthenticator error:', err);
        }
      } finally {
        inFlightRef.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authKey, jwtUser]);

  // useEffect(() => {
  //   AuthService.setCurrentUser(jwtUser)
  // }, []);

Giphy();


  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        <ConditionalHeader />
          <Switch>
          <Route path="/" exact><Index set={setJwtUser} setUser={setUser}/></Route>
          <Route path="/about">
            <AboutComponent/>
          </Route>
          <Route path="/privacyPolicy">
            <PrivacyPolicyComponent/>
          </Route>
          <Route path="/forgot-password" exact>
            <ForgotPasswordComponent />
          </Route>
          <ProtectedRoute path="/newsfeed" component={NewsfeedComponent}></ProtectedRoute>
          <ProtectedRoute path="/shareFeed" component={ShareFeedComponent}></ProtectedRoute>
          <ProtectedRoute path="/notifications" component={NotificationChatComponent}></ProtectedRoute>
          <ProtectedRoute path="/new-user" component={GuideComponent}></ProtectedRoute>
          <ProtectedRoute path="/group/create" component={CreateGroupComponentMain}></ProtectedRoute>
          {/* <ProtectedRoute path="/group/create" component={CreateGroupComponent}></ProtectedRoute> */}
          <ProtectedRoute path="/groups/:id" component={ViewGroupComponent}></ProtectedRoute>
          <ProtectedRoute path="/groups/" component={GroupComponent}></ProtectedRoute>
          <ProtectedRoute path="/profile/:email" component={OtherProfileComponent}></ProtectedRoute>
          <ProtectedRoute path="/" exact component={ProfileComponent}></ProtectedRoute>
          <ProtectedRoute path="/Addfriends" component={AddFriendsComponent}></ProtectedRoute>
          <ProtectedRoute path="/friends" component={FriendsComponent}></ProtectedRoute>
          <ProtectedRoute path="/chat" component={ChatComponent}></ProtectedRoute>
          <ProtectedRoute path="/messages" component={MessagesComponent}></ProtectedRoute>
          {/* <ProtectedRoute path="/swappoint" component={SwappointComponent}></ProtectedRoute> */}
      <ProtectedRoute path="/share" component={ShareItemComponent}></ProtectedRoute>
      <ProtectedRoute path="/Activity" component={ActivityComponent}></ProtectedRoute>
      <ProtectedRoute path="/Security" component={SecuritySettingsComponent}></ProtectedRoute>
      <ProtectedRoute path="/HangGift" component={HangGiftComponent}></ProtectedRoute>
      <ProtectedRoute path="/shipping" component={ShippingComponent}></ProtectedRoute>
      <ProtectedRoute path="/checkout" component={CheckoutComponent}></ProtectedRoute>
      <ProtectedRoute path="/editprofile" component={EditProfileComponent}></ProtectedRoute>
      <ProtectedRoute path="/swap" component={SwapComponent}></ProtectedRoute>
      <ProtectedRoute path="/swapFeed" component={SwapFeedComponent}></ProtectedRoute>
      <ProtectedRoute path="/savedShares" component={SavedSharesComponent}></ProtectedRoute>
      <ProtectedRoute path="/swappost" component={SwapFeedComponent}></ProtectedRoute>
      <ProtectedRoute path="/PaymentConfirmation" component={PayConfirmComponent}></ProtectedRoute>
      <ProtectedRoute path="/chatTest" component={ChatTestComponent}></ProtectedRoute>
      <ProtectedRoute path="/stry" component={DisplayComponent}></ProtectedRoute>
      <ProtectedRoute path="/loc" component={LocationComponent}></ProtectedRoute>
      <ProtectedRoute path="/searchFeed" component={SearchFeedComponent}></ProtectedRoute>
      <ProtectedRoute path="/reelFeed" component={ReelFeedComponent}></ProtectedRoute>


    
      
      {/* <ProtectedRoute path="/stories" component={StoriesComponent}></ProtectedRoute> */}
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
