# Backend API Comparison: Website vs Mobile App

## 🔍 Current Status

### ✅ Existing in Website Backend (5 endpoints)

| Endpoint | Method | File | Status |
|----------|--------|------|--------|
| `/api/v1/users/register` | POST | `routes/auth.js` | ✅ |
| `/api/v1/users/login` | POST | `routes/auth.js` | ✅ |
| `/api/v1/users/:email` | GET | `routes/auth.js` | ✅ |
| `/api/v1/posts/web/:userId` | POST | `routes/posts.js` | ✅ |
| `/api/v1/reels/web/:userId` | POST | `routes/reels.js` | ✅ |

### ❌ Missing (60+ endpoints required by Mobile App)

#### Authentication (5 endpoints missing)
- `GET /api/auth/verify` - Token verification
- `POST /api/auth/change-password` - Password change
- `POST /api/auth/request-password-reset` - Password reset
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - Logout

#### Users (6 endpoints missing)
- `GET /api/users/search` - User search
- `GET /api/users/:userId` - Profile by ID (not email)
- `PUT /api/users/:userId` - Update profile
- `POST /api/users/:userId/upload_profile_picture` - Profile photo
- `POST /api/users/:userId/upload_cover_picture` - Cover photo
- `GET /api/users/:userId/posts` - User posts

#### Posts (13 endpoints missing)
- `GET /api/posts` - List all posts (feed)
- `GET /api/posts/:postId` - Single post
- `GET /api/posts/user/:userId` - User posts
- `PUT /api/posts/:postId` - Update post
- `DELETE /api/posts/:postId` - Delete post
- `POST /api/posts/:postId/like` - Like post
- `POST /api/posts/:postId/save` - Save post
- `POST /api/posts/:postId/share` - Share post
- `GET /api/posts/:postId/likes` - Post likes
- `GET /api/posts/:postId/shares` - Post shares
- `GET /api/posts/:postId/saves` - Saved posts
- `GET /api/posts/saved` - User saved posts
- `POST /api/posts` - Create post (without /web/:userId)

#### Comments (6 endpoints missing)
- `POST /api/posts/:postId/comments` - Add comment
- `GET /api/posts/:postId/comments` - List comments
- `PUT /api/comments/:commentId` - Edit comment
- `DELETE /api/comments/:commentId` - Delete comment
- `POST /api/comments/:commentId/like` - Like comment
- `POST /api/comments/:commentId/reply` - Reply to comment

#### Following System (6 endpoints missing)
- `POST /api/follows/:userId` - Follow user
- `DELETE /api/follows/:userId` - Unfollow user
- `GET /api/follows/:userId/followers` - Get followers
- `GET /api/follows/:userId/following` - Get following
- `GET /api/follows/:userId/status` - Follow status
- `GET /api/follows/:userId/mutual` - Mutual follows

#### Friends (6 endpoints missing)
- `GET /api/friends/:userId` - List friends
- `POST /api/friends/:userId/request` - Send friend request
- `POST /api/friends/:userId/accept` - Accept request
- `POST /api/friends/:userId/decline` - Decline request
- `DELETE /api/friends/:userId` - Remove friend
- `GET /api/friends/:userId/requests` - Pending requests

#### Messages (5 endpoints missing)
- `GET /api/messages/conversations` - List conversations
- `GET /api/messages/conversations/:conversationId` - Conversation messages
- `POST /api/messages/send` - Send message
- `PUT /api/messages/:messageId/read` - Mark as read
- `DELETE /api/messages/:messageId` - Delete message

#### Notifications (4 endpoints missing)
- `GET /api/notifications` - List notifications
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all read
- `DELETE /api/notifications/:notificationId` - Delete notification

#### Groups (8 endpoints missing)
- `POST /api/groups` - Create group
- `GET /api/groups/:groupId` - Group details
- `PUT /api/groups/:groupId` - Update group
- `DELETE /api/groups/:groupId` - Delete group
- `POST /api/groups/:groupId/join` - Join group
- `POST /api/groups/:groupId/leave` - Leave group
- `GET /api/groups/:groupId/members` - Group members
- `GET /api/groups/:groupId/posts` - Group posts

#### Stories (4 endpoints missing)
- `GET /api/stories` - List stories
- `POST /api/stories/:userId` - Create story
- `GET /api/stories/:userId` - User stories
- `PUT /api/stories/:storyId` - Update story

## 📊 Summary

- **Total endpoints needed:** 60+
- **Currently implemented:** 5
- **Missing:** 55+
- **Coverage:** ~8%

## 🚀 Action Plan

1. ✅ Use mobile app backend directly (shareuptime.com API)
2. ✅ Update website frontend to use same API base URL
3. ✅ Align authentication (JWT tokens)
4. ✅ Update API service calls in website frontend
5. ✅ Test integration with mobile app backend

## 🔗 Mobile App Backend

**Base URL:** `https://www.shareuptime.com/api`  
**Repo:** https://github.com/Shareup-dev/shareuptime-social-media  
**Branch:** new_dev  
**Status:** ✅ Production ready (60+ endpoints)
