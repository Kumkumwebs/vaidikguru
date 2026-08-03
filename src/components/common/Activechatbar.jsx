import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { callStatusUpdate } from '../../services/liveService';

const fmt = (s) => {
  const m = String(Math.floor(s / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
};
const initials = (n) =>
  (n || '').trim().split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();

/**
 * ActiveChatBar
 * Mount once inside <Router> (outside <Routes>). Shows a floating pill whenever
 * a chat session is active and the user is NOT on the chat screen — tap to jump
 * back in. Sits above the call bar so both can coexist.
 */
const ActiveChatBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { chatActive, chatInfo, chatTimeLeft, stopChatTimer } = useChat();

  const onChatScreen = pathname.startsWith('/consultation/chat');
  const visible = chatActive && chatInfo && !onChatScreen;

  if (!visible) return null;

  const handleReturn = () => {
    navigate(`/consultation/chat/${chatInfo.astrologer_id}`, {
      state: {
        gid: chatInfo.gid,
        fbchannelID: chatInfo.fbchannelID,
        astrologer_id: chatInfo.astrologer_id,
        astroName: chatInfo.astroName,
        astrologerImage: chatInfo.astrologerImage,
        rate: chatInfo.rate,
        wallet: chatInfo.wallet,
        name: chatInfo.name,
        gender: chatInfo.gender,
        dob: chatInfo.dob,
        tob: chatInfo.tob,
        place: chatInfo.place,
      },
    });
  };

  const handleEnd = async (e) => {
    e.stopPropagation();
    try { await callStatusUpdate(chatInfo.gid, 'end_user'); } catch { /* silent */ }
    stopChatTimer();
  };

  return (
    <div
      onClick={handleReturn}
      style={{
        position: 'fixed', bottom: 84, right: 20, zIndex: 9998,
        display: 'flex', alignItems: 'center', gap: 12,
        background: '#fff', borderRadius: 40, padding: '8px 8px 8px 12px',
        boxShadow: '0 12px 34px rgba(123,26,58,0.28)',
        border: '1px solid #f1d7de', cursor: 'pointer', maxWidth: 320,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#7b1a3a,#7b1a3a99)', color: '#fff', fontWeight: 700,
      }}>
        {chatInfo.astrologerImage
          ? <img src={chatInfo.astrologerImage} alt={chatInfo.astroName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }} />
          : initials(chatInfo.astroName)}
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {chatInfo.astroName}
        </div>
        <div style={{ fontSize: 11.5, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
          Chat active · {fmt(chatTimeLeft)} left
        </div>
      </div>

      <button
        onClick={handleEnd}
        title="End chat"
        style={{
          width: 40, height: 40, borderRadius: '50%', border: 'none', flexShrink: 0,
          background: '#dc2626', color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <i className="fas fa-times" />
      </button>
    </div>
  );
};

export default ActiveChatBar;