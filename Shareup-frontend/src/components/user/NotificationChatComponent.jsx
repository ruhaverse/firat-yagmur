import React, { useState, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import Layout from '../LayoutComponent';
import './NotificationChat.css';

function NotificationChatComponent() {
    const { user } = useContext(UserContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');

    const users = [
        { id: 1, name: 'Molly Cyrus', avatar: '../assets/images/resources/friend-avatar2.jpg', status: 'online' },
        { id: 2, name: 'Andrew', avatar: '../assets/images/resources/friend-avatar3.jpg', status: 'away' },
        { id: 3, name: 'Jason Bourne', avatar: '../assets/images/resources/friend-avatar.jpg', status: 'online' },
        { id: 4, name: 'Sarah Grey', avatar: '../assets/images/resources/friend-avatar4.jpg', status: 'offline' },
        { id: 5, name: 'Bill Doe', avatar: '../assets/images/resources/friend-avatar5.jpg', status: 'online' },
        { id: 6, name: 'Shen Cornery', avatar: '../assets/images/resources/friend-avatar6.jpg', status: 'away' },
        { id: 7, name: 'Kill Bill', avatar: '../assets/images/resources/friend-avatar7.jpg', status: 'offline' },
        { id: 8, name: 'Jasmin Walia', avatar: '../assets/images/resources/friend-avatar8.jpg', status: 'online' },
    ];

    const messages = [
        { id: 1, type: 'received', text: "what's liz short for? :)" },
        { id: 2, type: 'sent', text: 'Elizabeth lol' },
        { id: 3, type: 'sent', text: 'wanna know whats my second guess was?' },
        { id: 4, type: 'received', text: 'yes' },
        { id: 5, type: 'sent', text: "Disney's the lizard king" },
        { id: 6, type: 'sent', text: 'i know him 5 years ago' },
        { id: 7, type: 'received', text: 'coooooooooool dude ;)' }
    ];

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            setMessage('');
        }
    };

    const currentChat = selectedUser || users[2];

    return (
        <Layout user={user}>
            <div className="">
                <div className="messaging-card">
                    <div className="messaging-header">
                        <h5>Messages</h5>
                    </div>

                    <div className="messaging-container">
                        {/* Users Sidebar */}
                        <aside className="contacts-sidebar">
                            <div className="contacts-list">
                                {users.map((u) => (
                                    <div
                                        key={u.id}
                                        className={`contact-item ${currentChat.id === u.id ? 'active' : ''}`}
                                        onClick={() => setSelectedUser(u)}
                                    >
                                        <div className="contact-avatar">
                                            <img src={u.avatar} alt={u.name} />
                                            <span className={`status ${u.status}`}></span>
                                        </div>
                                        <span className="contact-name">{u.name}</span>
                                    </div>
                                ))}
                            </div>
                        </aside>

                        {/* Chat Panel */}
                        <main className="chat-panel">
                            <div className="chat-header">
                                <img src={currentChat.avatar} alt={currentChat.name} />
                                <div className="chat-user-info">
                                    <h6>{currentChat.name}</h6>
                                    <span className={`status-text ${currentChat.status}`}>{currentChat.status}</span>
                                </div>
                            </div>

                            <div className="chat-messages">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`message-row ${msg.type}`}>
                                        <div className="message-bubble">
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form className="chat-input-form" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button type="submit">
                                    <i className="ti-arrow-right"></i>
                                </button>
                            </form>
                        </main>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default NotificationChatComponent;