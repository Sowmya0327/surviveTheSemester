import React from 'react';
import { useSelector } from 'react-redux';
import './profileratings.css';

const ForwardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

const ProfileRatings = () => {
    const user = useSelector((state) => state.user.currentUser);
    const rating = user?.rating || user?.Rating || 1018;

    return (
        <div className="profile-ratings-container">
            <div className="profile-section-header">
                <h3 className="profile-section-title">Ratings</h3>
                <button className="profile-section-forward">
                    <ForwardIcon />
                </button>
            </div>

            <div className="profile-ratings-grid">
                <div className="profile-rating-card">
                    <h4 className="profile-rating-score">{rating}</h4>
                    <p className="profile-rating-label">Overall rating</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileRatings;
