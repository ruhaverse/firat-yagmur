  module.exports = function createRoutes({ router, deps }) {
    const controller = require('./controller')(deps);

    // GET /api/v1/friends/email/:email
    router.get('/email/:email', controller.listByEmail);

    // POST /api/v1/friends/:uid/:fid (add)
    router.post('/:uid/:fid', controller.addFriend);

    // DELETE /api/v1/friends/:uid/:fid (remove)
    router.delete('/:uid/:fid', controller.removeFriend);

    // friend request flows
    router.post('/:uid/friend_request/:fid', controller.sendRequest);
    router.post('/:uid/accept_friend_request/:fid', controller.acceptRequest);
    router.post('/:uid/decline_friend_request/:fid', controller.declineRequest);

    // GET pending friend requests sent by this user
    router.get('/email/:email/requests_sent', controller.listRequestsSent);

    // GET pending friend requests received by this user
    router.get('/email/:email/requests_received', controller.listRequestsReceived);
  };
