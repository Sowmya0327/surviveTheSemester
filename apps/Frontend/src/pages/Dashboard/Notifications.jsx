import React, { useState } from 'react';
import './notifications.css';

// Dynamic connections instead of dummy
const dummyGeneral = [
    { id: 201, title: 'Congrats! You have won a 7-day streak badge 🔥', time: '5 hours ago', icon: '🏆', iconClass: 'icon-orange' },
    { id: 202, title: 'You moved up to Global Rank #5! Keep it up.', time: '1 day ago', icon: '📈', iconClass: 'icon-neon' }
];

const Notifications = () => {
    const [view, setView] = useState('connections'); // 'connections' or 'general'
    const [connections, setConnections] = useState([]);
    
    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    React.useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${API_URL}/api/connections/notifications`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                
                const mapped = data.notifications.map(n => {
                    const colors = ['icon-blue', 'icon-neon', 'icon-orange'];
                    const bg = colors[n.senderId ? n.senderId.charCodeAt(0) % colors.length : 0] || 'icon-blue';
                    return {
                        id: n.id,
                        type: n.type, 
                        user: n.senderName || 'System',
                        senderId: n.senderId,
                        time: new Date(n.createdAt).toLocaleDateString(),
                        avatarClass: bg,
                        initial: n.senderName ? (n.senderName.split(' ').map(p=>p[0]).join('').substring(0,2).toUpperCase()) : '?'
                    };
                });
                setConnections(mapped);
                
                await fetch(`${API_URL}/api/connections/notifications/read`, {
                    method: 'POST',
                    credentials: 'include'
                });
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const handleAction = async (id, actionType) => {
        const notif = connections.find(c => c.id === id);
        if (!notif) return;
        
        try {
            const apiEndpoint = `${API_URL}/api/connections/${actionType}`;
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderId: notif.senderId, notificationId: id }),
                credentials: 'include'
            });
            if (response.ok) {
                if (actionType === 'accept') {
                    // Turn it into accepted UI visually or just remove the action buttons
                    setConnections(prev => prev.map(c => c.id === id ? { ...c, type: 'accepted', time: 'Just now' } : c));
                } else {
                    setConnections(prev => prev.filter(c => c.id !== id));
                }
            }
        } catch(error) {
            console.error("Error handling action:", error);
        }
    };

    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <h2 className="notifications-title">Notifications</h2>
                
                {/* Reusing the same MD3 toggle structure from Leaderboard */}
                <div className="leaderboard-toggle-wrapper" data-active={view}>
                    <div className="leaderboard-toggle-pill"></div>
                    <button 
                        className={`leaderboard-toggle-btn ${view === 'connections' ? 'active' : ''}`}
                        onClick={() => setView('connections')}
                    >
                        Connections
                    </button>
                    <button 
                        className={`leaderboard-toggle-btn ${view === 'general' ? 'active' : ''}`}
                        onClick={() => setView('general')}
                    >
                        General
                    </button>
                </div>
            </div>

            <div className="notifications-list">
                {view === 'connections' && connections.map(notif => (
                    <div key={notif.id} className="notification-card">
                        <div className={`notification-icon-wrapper ${notif.avatarClass}`}>
                            {notif.initial}
                        </div>
                        <div className="notification-content">
                            <p className="notification-text">
                                {notif.type === 'request' ? (
                                    <><strong>{notif.user}</strong> sent you a connection request.</>
                                ) : (
                                    <><strong>{notif.user}</strong> accepted your connection request.</>
                                )}
                            </p>
                            <span className="notification-time">{notif.time}</span>
                            
                            {notif.type === 'request' && (
                                <div className="notification-actions">
                                    <button className="notif-btn-accept" onClick={() => handleAction(notif.id, 'accept')}>Accept</button>
                                    <button className="notif-btn-decline" onClick={() => handleAction(notif.id, 'decline')}>Decline</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                {view === 'connections' && connections.length === 0 && (
                    <div style={{ color: 'var(--md-sys-color-on-surface-variant)', padding: '24px' }}>
                        No new connection notifications.
                    </div>
                )}

                {view === 'general' && dummyGeneral.map(notif => (
                    <div key={notif.id} className="notification-card">
                        <div className={`notification-icon-wrapper ${notif.iconClass}`}>
                            {notif.icon}
                        </div>
                        <div className="notification-content">
                            <p className="notification-text">{notif.title}</p>
                            <span className="notification-time">{notif.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
