// App.js - Smart Parking Frontend (Enhanced Professional Version with Responsive Design)
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, 
  PieChart, Pie, Cell, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts';

const API_BASE = 'http://192.168.113.67:3000/api'; // IMPORTANT: Change to your backend's IP address

// Custom CSS for date and time pickers - Hide default icons, use custom SVG icons
const dateTimePickerStyles = `
  /* Completely hide default browser calendar/time picker icons */
  input[type="date"]::-webkit-calendar-picker-indicator,
  input[type="time"]::-webkit-calendar-picker-indicator {
    display: none !important;
    opacity: 0 !important;
    width: 0 !important;
    height: 0 !important;
    pointer-events: none !important;
  }
  
  input[type="date"]::-webkit-inner-spin-button,
  input[type="time"]::-webkit-inner-spin-button {
    display: none !important;
    -webkit-appearance: none !important;
  }
  
  input[type="date"]::-webkit-clear-button,
  input[type="time"]::-webkit-clear-button {
    display: none !important;
    -webkit-appearance: none !important;
  }
  
  /* Remove any default appearance */
  input[type="date"],
  input[type="time"] {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
  }
  
  /* Hide the dark box/icon on the left side */
  input[type="date"]::-webkit-datetime-edit-fields-wrapper,
  input[type="time"]::-webkit-datetime-edit-fields-wrapper {
    padding: 0 !important;
  }
  
  input[type="date"]::-webkit-datetime-edit,
  input[type="time"]::-webkit-datetime-edit {
    padding: 0 !important;
  }
  
  input[type="date"]::-webkit-datetime-edit-text,
  input[type="time"]::-webkit-datetime-edit-text {
    padding: 0 2px !important;
  }
  
  input[type="date"]::-webkit-datetime-edit-month-field,
  input[type="date"]::-webkit-datetime-edit-day-field,
  input[type="date"]::-webkit-datetime-edit-year-field,
  input[type="time"]::-webkit-datetime-edit-hour-field,
  input[type="time"]::-webkit-datetime-edit-minute-field,
  input[type="time"]::-webkit-datetime-edit-ampm-field {
    padding: 0 !important;
  }
  
  /* Firefox */
  input[type="date"]::-moz-calendar-picker-indicator,
  input[type="time"]::-moz-calendar-picker-indicator {
    display: none !important;
    opacity: 0 !important;
    width: 0 !important;
    height: 0 !important;
    pointer-events: none !important;
  }

  /* Webkit datetime input clear button */
  input[type="datetime-local"]::-webkit-clear-button {
    filter: invert(1) brightness(2) contrast(1.2);
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  input[type="datetime-local"]::-webkit-clear-button:hover {
    filter: invert(1) brightness(2.5) contrast(1.3);
    background: rgba(239, 68, 68, 0.3);
  }

  /* Inner spin button for time */
  input[type="datetime-local"]::-webkit-inner-spin-button {
    filter: invert(1) brightness(2) contrast(1.2);
  }

  input[type="datetime-local"]::-webkit-inner-spin-button:hover {
    filter: invert(1) brightness(2.5) contrast(1.3);
  }
  
  /* Custom Select Dropdown Options Styling */
  select {
    color-scheme: dark;
  }
  
  select option {
    background: #1a1a1a !important;
    color: #e5e7eb !important;
    padding: 12px 16px !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    border: none !important;
  }
  
  select option:hover,
  select option:focus,
  select option:checked {
    background: #3b82f6 !important;
    color: #ffffff !important;
  }
  
  /* Firefox specific */
  @-moz-document url-prefix() {
    select option {
      background-color: #1a1a1a !important;
      color: #e5e7eb !important;
    }
    select option:checked {
      background: linear-gradient(#3b82f6, #3b82f6) !important;
      color: #ffffff !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = dateTimePickerStyles;
  if (!document.head.querySelector('style[data-datetime-picker]')) {
    styleElement.setAttribute('data-datetime-picker', 'true');
    document.head.appendChild(styleElement);
  }
}

// Professional SVG Icons for Commercial Look
const Icons = {
  Parking: () => (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer square frame */}
      <rect x="2" y="2" width="36" height="36" rx="6" fill="url(#parkingGradient)" stroke="currentColor" strokeWidth="1.5"/>
      {/* Letter P */}
      <path d="M14 10 L14 30 M14 10 L22 10 C25 10 27 12 27 15 C27 18 25 20 22 20 L14 20" 
            stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Gradient definition */}
      <defs>
        <linearGradient id="parkingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v6m0 6v6M4.2 4.2l4.2 4.2m5.6 5.6l4.2 4.2M1 12h6m6 0h6M4.2 19.8l4.2-4.2m5.6-5.6l4.2-4.2"/>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  Car: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17h-2v-6l2-5h10l2 5v6h-2"/>
      <circle cx="7" cy="17" r="2"/>
      <circle cx="17" cy="17" r="2"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Tool: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  IndianRupee: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3h12"/>
      <path d="M6 8h12"/>
      <path d="M11 3v5c0 3.5 2 5 5 5"/>
      <path d="M8 13l8 8"/>
    </svg>
  ),
  FileText: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Clock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Moon: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Sun: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Info: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  )
};

// Professional Parking Logo Component (Larger version for header/login)
const ParkingLogo = ({ size = 40, isDarkMode = true }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle with gradient */}
    <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" stroke={isDarkMode ? '#3b82f6' : '#2563eb'} strokeWidth="2"/>
    
    {/* Letter P - Bold and Professional */}
    <path 
      d="M32 25 L32 75 M32 25 L58 25 C68 25 73 32 73 40 C73 48 68 55 58 55 L32 55" 
      stroke="white" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      fill="none"
    />
    
    {/* Small car icon at bottom for context */}
    <g transform="translate(55, 65) scale(0.8)">
      <rect x="0" y="0" width="20" height="10" rx="2" fill="white" opacity="0.6"/>
      <circle cx="5" cy="10" r="2" fill="white" opacity="0.8"/>
      <circle cx="15" cy="10" r="2" fill="white" opacity="0.8"/>
    </g>
    
    {/* Gradient definitions */}
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="1"/>
        <stop offset="50%" stopColor="#2563eb" stopOpacity="0.95"/>
        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9"/>
      </linearGradient>
    </defs>
  </svg>
);

// Add responsive CSS
const responsiveStyles = document.createElement('style');
responsiveStyles.innerHTML = `
  * {
    box-sizing: border-box;
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr !important;
      gap: 15px !important;
      padding: 20px 15px !important;
      margin-top: 20px !important;
    }
    
    .slot-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
      gap: 12px !important;
    }
    
    .analytics-container {
      flex-direction: column !important;
    }
    
    .header-container {
      flex-direction: row !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 12px 16px !important;
      margin-bottom: 0 !important;
    }
    
    .header-right {
      flex-direction: row !important;
    }
    
    .emergency-buttons {
      flex-direction: column !important;
    }
    
    .table-container {
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
    }
    
    table {
      min-width: 600px !important;
    }
  }
  
  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
      padding: 15px 12px !important;
      margin-top: 15px !important;
    }
    
    .slot-grid {
      grid-template-columns: 1fr !important;
    }
    
    .modal-content {
      width: 95% !important;
      margin: 10px !important;
    }
    
    .login-box {
      width: 95% !important;
      padding: 25px !important;
    }
  }
`;
if (!document.head.querySelector('style[data-responsive]')) {
  responsiveStyles.setAttribute('data-responsive', 'true');
  document.head.appendChild(responsiveStyles);
}

// --- NOTIFICATION SYSTEM ---
const NotificationCenter = ({ notifications, onDismiss }) => {
  return (
    <div style={styles.notificationContainer}>
      {notifications.map((notif, idx) => (
        <div key={idx} style={{...styles.notification, ...styles[`notification${notif.type}`]}}>
          <div style={styles.notificationContent}>
            <span style={styles.notificationIcon}>{notif.icon}</span>
            <span>{notif.message}</span>
          </div>
          <button onClick={() => onDismiss(idx)} style={styles.notificationClose}>×</button>
        </div>
      ))}
    </div>
  );
};

// --- QR CODE GENERATOR (Simple SVG-based) ---
const QRCodeDisplay = ({ data }) => {
  return (
    <div style={styles.qrContainer}>
      <svg width="150" height="150" viewBox="0 0 29 29">
        {/* Simplified QR pattern - in production use a real QR library */}
        <rect width="29" height="29" fill="white"/>
        <g fill="black">
          {/* Corner patterns */}
          <rect x="0" y="0" width="7" height="7"/>
          <rect x="22" y="0" width="7" height="7"/>
          <rect x="0" y="22" width="7" height="7"/>
          {/* Data pattern (simplified) */}
          {data.split('').map((char, i) => 
            char.charCodeAt(0) % 2 === 0 ? (
              <rect key={i} x={8 + (i % 13)} y={8 + Math.floor(i / 13)} width="1" height="1"/>
            ) : null
          )}
        </g>
      </svg>
      <p style={styles.qrText}>Booking: {data.substring(0, 8)}</p>
    </div>
  );
};


// --- ENHANCED BOOKING MODAL WITH QR CODE ---
function BookingModal({ slot, onClose, onBook, isDarkMode = true }) {
  const now = new Date();
  const [startDate, setStartDate] = useState(now.toISOString().slice(0, 10)); // YYYY-MM-DD
  const [startTime, setStartTime] = useState(now.toTimeString().slice(0, 5)); // HH:MM
  const [duration, setDuration] = useState(60); // Default duration 60 minutes
  const [customDuration, setCustomDuration] = useState(''); // Custom duration in minutes
  const [durationMode, setDurationMode] = useState('preset'); // 'preset' or 'custom'
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleBook = () => {
    // Combine date and time into datetime-local format
    const combinedDateTime = `${startDate}T${startTime}`;
    
    if (new Date(combinedDateTime) < new Date()) {
      alert("Booking time cannot be in the past.");
      return;
    }
    if (!vehicleNumber.trim()) {
      alert("Please enter vehicle number.");
      return;
    }
    
    // Determine final duration based on mode
    const finalDuration = durationMode === 'custom' ? Number(customDuration) : Number(duration);
    
    if (durationMode === 'custom' && (!customDuration || finalDuration <= 0)) {
      alert("Please enter a valid duration in minutes (greater than 0).");
      return;
    }
    
    onBook({ startTime: combinedDateTime, duration: finalDuration, vehicleNumber, phoneNumber });
  };

  // Calculate estimated cost based on mode
  const getEstimatedCost = () => {
    const mins = durationMode === 'custom' ? Number(customDuration) || 0 : Number(duration);
    return (mins / 60) * 50; // ₹50 per hour
  };
  
  const estimatedCost = getEstimatedCost();

  // Theme-aware colors
  const theme = {
    modalBg: isDarkMode ? '#1a1a1a' : '#ffffff',
    headerBg: isDarkMode ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    bodyBg: isDarkMode ? '#1a1a1a' : '#ffffff',
    labelColor: isDarkMode ? '#e5e5e5' : '#1f2937',
    inputBg: isDarkMode ? '#2d2d2d' : '#ffffff',
    inputBorder: isDarkMode ? '#3d3d3d' : '#e5e7eb',
    inputText: isDarkMode ? '#e5e5e5' : '#1f2937',
    inputFocusBorder: isDarkMode ? '#3b82f6' : '#3b82f6',
    costBg: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
    footerBg: isDarkMode ? '#111827' : '#f9fafb',
    footerBorder: isDarkMode ? '#2d2d2d' : '#f3f4f6',
    cancelBg: isDarkMode ? '#2d2d2d' : '#ffffff',
    cancelBorder: isDarkMode ? '#3d3d3d' : '#e5e7eb',
    cancelText: isDarkMode ? '#9ca3af' : '#6b7280',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(5px)',
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: theme.modalBg,
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '95vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isDarkMode ? '0 20px 60px rgba(0, 0, 0, 0.6)' : '0 20px 60px rgba(0, 0, 0, 0.4)',
        border: isDarkMode ? '1px solid #2d2d2d' : 'none'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: theme.headerBg,
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ParkingLogo size={28} isDarkMode={!isDarkMode} />
            </div>
            <h2 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: 'white'
            }}>Book Slot {slot.id}</h2>
          </div>
          <button onClick={onClose} style={{
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '300',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}
          >×</button>
        </div>

        {/* Body - Compact Grid Layout */}
        <div style={{padding: '20px 24px', overflowY: 'auto', flexGrow: 1}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            {/* Vehicle Number */}
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: '600',
                color: theme.labelColor
              }}>
                <Icons.Car /> Vehicle Number *
              </label>
              <input 
                type="text" 
                value={vehicleNumber} 
                onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
                placeholder="ABC-1234"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `2px solid ${theme.inputBorder}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  background: theme.inputBg,
                  color: theme.inputText
                }}
                onFocus={(e) => e.target.style.borderColor = theme.inputFocusBorder}
                onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
              />
            </div>

            {/* Phone Number */}
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: '600',
                color: theme.labelColor
              }}>
                <Icons.User /> Phone Number
              </label>
              <input 
                type="tel" 
                value={phoneNumber} 
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+1 234 567 8900"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `2px solid ${theme.inputBorder}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  background: theme.inputBg,
                  color: theme.inputText
                }}
                onFocus={(e) => e.target.style.borderColor = theme.inputFocusBorder}
                onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
              />
            </div>

            {/* Start Date */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: '600',
                color: theme.labelColor
              }}>
                <Icons.Calendar /> Start Date *
              </label>
              <div style={{position: 'relative'}}>
                <input 
                  id="startDateInput"
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 44px 11px 14px',
                    border: `2px solid ${theme.inputBorder}`,
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                    outline: 'none',
                    background: isDarkMode ? '#262626' : '#ffffff',
                    color: isDarkMode ? '#e5e7eb' : '#1f2937',
                    colorScheme: isDarkMode ? 'dark' : 'light',
                    cursor: 'pointer',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.inputFocusBorder;
                    e.target.style.background = isDarkMode ? '#2d2d2d' : '#f9fafb';
                    e.target.style.boxShadow = isDarkMode 
                      ? '0 0 0 3px rgba(59, 130, 246, 0.1)' 
                      : '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.inputBorder;
                    e.target.style.background = isDarkMode ? '#262626' : '#ffffff';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div 
                  onClick={() => document.getElementById('startDateInput').showPicker()}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    background: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#3b82f6' : '#3b82f6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
            </div>

            {/* Start Time */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: '600',
                color: theme.labelColor
              }}>
                <Icons.Clock /> Start Time *
              </label>
              <div style={{position: 'relative'}}>
                <input 
                  id="startTimeInput"
                  type="time" 
                  value={startTime} 
                  onChange={e => setStartTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 44px 11px 14px',
                    border: `2px solid ${theme.inputBorder}`,
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                    outline: 'none',
                    background: isDarkMode ? '#262626' : '#ffffff',
                    color: isDarkMode ? '#e5e7eb' : '#1f2937',
                    colorScheme: isDarkMode ? 'dark' : 'light',
                    cursor: 'pointer',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.inputFocusBorder;
                    e.target.style.background = isDarkMode ? '#2d2d2d' : '#f9fafb';
                    e.target.style.boxShadow = isDarkMode 
                      ? '0 0 0 3px rgba(59, 130, 246, 0.1)' 
                      : '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.inputBorder;
                    e.target.style.background = isDarkMode ? '#262626' : '#ffffff';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div 
                  onClick={() => document.getElementById('startTimeInput').showPicker()}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    background: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#3b82f6' : '#3b82f6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: theme.labelColor
              }}>
                <Icons.Clock /> Duration
              </label>
              
              {/* Duration Mode Tabs */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '10px'
              }}>
                <button
                  type="button"
                  onClick={() => setDurationMode('preset')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: `2px solid ${durationMode === 'preset' ? '#3b82f6' : theme.inputBorder}`,
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    background: durationMode === 'preset' ? 'rgba(59, 130, 246, 0.1)' : theme.inputBg,
                    color: durationMode === 'preset' ? '#3b82f6' : theme.inputText,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Quick Select
                </button>
                <button
                  type="button"
                  onClick={() => setDurationMode('custom')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: `2px solid ${durationMode === 'custom' ? '#3b82f6' : theme.inputBorder}`,
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    background: durationMode === 'custom' ? 'rgba(59, 130, 246, 0.1)' : theme.inputBg,
                    color: durationMode === 'custom' ? '#3b82f6' : theme.inputText,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Custom Minutes
                </button>
              </div>
              
              {/* Preset Duration Select */}
              {durationMode === 'preset' && (
                <select 
                  value={duration} 
                  onChange={e => setDuration(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `2px solid ${theme.inputBorder}`,
                    borderRadius: '8px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    background: theme.inputBg,
                    color: theme.inputText,
                    outline: 'none'
                  }}
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                  <option value={240}>4 hours</option>
                  <option value={480}>8 hours (Full day)</option>
                  <option value={720}>12 hours</option>
                  <option value={1440}>24 hours</option>
                </select>
              )}
              
              {/* Custom Duration Input */}
              {durationMode === 'custom' && (
                <div>
                  <input 
                    type="number" 
                    value={customDuration} 
                    onChange={e => setCustomDuration(e.target.value)}
                    placeholder="Enter minutes (e.g., 45, 75, 135)"
                    min="1"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `2px solid ${theme.inputBorder}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                      outline: 'none',
                      background: theme.inputBg,
                      color: theme.inputText
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.inputFocusBorder}
                    onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
                  />
                  {customDuration && Number(customDuration) > 0 && (
                    <div style={{
                      marginTop: '6px',
                      fontSize: '11px',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Icons.Info size={12} />
                      {`≈ ${(Number(customDuration) / 60).toFixed(1)} hours`}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cost Estimate - Compact */}
          <div style={{
            padding: '14px 16px',
            background: theme.costBg,
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: theme.labelColor
            }}>
              Estimated Cost
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#3b82f6'
            }}>₹{estimatedCost.toFixed(2)}</div>
          </div>
        </div>

        {/* Footer - Compact */}
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${theme.footerBorder}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          background: theme.footerBg,
          borderRadius: '0 0 16px 16px',
          flexShrink: 0
        }}>
          <button onClick={onClose} style={{
            padding: '10px 24px',
            background: theme.cancelBg,
            color: theme.cancelText,
            border: `2px solid ${theme.cancelBorder}`,
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>Cancel</button>
          <button onClick={handleBook} style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}>
            <Icons.CheckCircle /> Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminSlotModal({ slot, bookings, onClose, onUpdate }) {
    if (!slot) return null;
  
    const relevantBooking = bookings.find(b => (b.slot_id === slot.id) && (b.status === 'active' || b.status === 'entered'));
  
    const handleStatusChange = (newStatus) => {
      // This would call a new API endpoint to manually update a slot
      // For now, we just log it and close
      console.log(`Request to change slot ${slot.id} to ${newStatus}`);
      onUpdate(slot.id, newStatus);
      onClose();
    };

    const getStatusBadgeStyle = (status) => {
      const baseStyle = {
        display: 'inline-block',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      };
      
      switch(status) {
        case 'free':
          return {...baseStyle, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981'};
        case 'occupied':
          return {...baseStyle, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444'};
        case 'booked':
          return {...baseStyle, background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6'};
        case 'maintenance':
          return {...baseStyle, background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b'};
        default:
          return {...baseStyle, background: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af'};
      }
    };
  
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
        padding: '20px'
      }}>
        <div style={{
          background: '#1a1a1a',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          animation: 'scaleIn 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            padding: '24px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <Icons.Settings size={24} color="#fff" />
              <h3 style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: '700',
                color: '#ffffff'
              }}>
                Manage Slot {slot.id}
              </h3>
            </div>
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#fff',
                fontSize: '24px',
                cursor: 'pointer',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                fontWeight: '300'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div style={{padding: '28px'}}>
            {/* Current Status */}
            <div style={{
              background: '#262626',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <p style={{
                margin: '0 0 10px 0',
                fontSize: '13px',
                fontWeight: '600',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Current Status
              </p>
              <div style={getStatusBadgeStyle(slot.status)}>
                {slot.status.toUpperCase()}
              </div>
            </div>

            {/* Active Booking Info */}
            {relevantBooking && (
              <div style={{
                background: '#262626',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <Icons.User size={18} color="#3b82f6" />
                  <h4 style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#3b82f6'
                  }}>
                    Active Booking
                  </h4>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{fontSize: '13px', color: '#9ca3af'}}>User ID:</span>
                    <span style={{fontSize: '13px', color: '#e5e7eb', fontWeight: '600'}}>{relevantBooking.user_id}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{fontSize: '13px', color: '#9ca3af'}}>Start:</span>
                    <span style={{fontSize: '13px', color: '#e5e7eb'}}>{new Date(relevantBooking.start_time).toLocaleString()}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{fontSize: '13px', color: '#9ca3af'}}>End:</span>
                    <span style={{fontSize: '13px', color: '#e5e7eb'}}>{new Date(relevantBooking.end_time).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Override Section */}
            <div>
              <h4 style={{
                margin: '0 0 16px 0',
                fontSize: '15px',
                fontWeight: '600',
                color: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Icons.Settings size={18} />
                Manual Override
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px'
              }}>
                <button 
                  onClick={() => handleStatusChange('free')}
                  style={{
                    padding: '14px 12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '2px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '10px',
                    color: '#10b981',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(16, 185, 129, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(16, 185, 129, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <Icons.CheckCircle size={20} />
                  Free
                </button>
                <button 
                  onClick={() => handleStatusChange('occupied')}
                  style={{
                    padding: '14px 12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '2px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '10px',
                    color: '#ef4444',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <Icons.Car size={20} />
                  Occupied
                </button>
                <button 
                  onClick={() => handleStatusChange('maintenance')}
                  style={{
                    padding: '14px 12px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '2px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '10px',
                    color: '#f59e0b',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(245, 158, 11, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(245, 158, 11, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <Icons.Settings size={20} />
                  Maintenance
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '20px 28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button 
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#e5e7eb',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }


// --- ENHANCED LOGIN PAGE WITH MODERN UI ---
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth`, { username, password });
      onLogin(res.data);
    } catch (e) {
      alert('Login failed: ' + (e.response?.data?.error || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBoxEnhanced}>
        <div style={styles.loginHeader}>
          <div style={styles.logoCircle}>
            <ParkingLogo size={80} isDarkMode={false} />
          </div>
          <h1 style={styles.loginTitle}>Smart Parking System</h1>
          <p style={styles.loginSubtitle}>IoT-Powered Parking Management</p>
        </div>

        <div style={styles.loginForm}>
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <Icons.User />
            </span>
            <input 
              placeholder="Username" 
              value={username} 
              onChange={e=>setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.inputEnhanced}
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <Icons.Settings />
            </span>
            <input 
              placeholder="Password" 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.inputEnhanced}
            />
          </div>

          <button 
            onClick={submit} 
            disabled={loading}
            style={{...styles.loginButton, opacity: loading ? 0.6 : 1}}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div style={styles.demoAccountsToggle} onClick={() => setShowDemo(!showDemo)}>
            {showDemo ? '▼' : '▶'} Demo Accounts
          </div>

          {showDemo && (
            <div style={styles.demoAccounts}>
              <div style={styles.demoAccount} onClick={() => {setUsername('admin'); setPassword('admin123');}}>
                <strong>👨‍💼 Admin:</strong> admin / admin123
              </div>
              <div style={styles.demoAccount} onClick={() => {setUsername('user1'); setPassword('user123');}}>
                <strong>👤 User:</strong> user1 / user123
              </div>
            </div>
          )}
        </div>

        <div style={styles.loginFooter}>
          <div style={styles.feature}>✓ Real-time Monitoring</div>
          <div style={styles.feature}>✓ Smart Booking</div>
          <div style={styles.feature}>✓ Automated Payments</div>
        </div>
      </div>
    </div>
  );
}

function ConsumerView({ user, onLogout }) {
  const [slots, setSlots] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [now, setNow] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({ totalBookings: 0, totalSpent: 0, activeCount: 0 });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showProfile, setShowProfile] = useState(false);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addNotification = (message, type = 'success', icon = '✓') => {
    const notif = { message, type, icon, id: Date.now() };
    setNotifications(prev => [notif, ...prev].slice(0, 5)); // Keep max 5 notifications
    setTimeout(() => dismissNotification(notif.id), 5000); // Auto-dismiss after 5s
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const fetchAllForUser = async () => {
    try {
      const [slotsRes, historyRes] = await Promise.all([
        axios.get(`${API_BASE}/slots`),
        axios.get(`${API_BASE}/users/${user.id}/booking-history`)
      ]);
      
      setSlots(slotsRes.data);
      setBookingHistory(historyRes.data);

      const active = historyRes.data.filter(b => b.status === 'active' || b.status === 'entered');
      setActiveBookings(active);
      
      // Calculate stats
      const totalBookings = historyRes.data.length;
      const totalSpent = historyRes.data.reduce((sum, b) => sum + (b.amount || 0), 0);
      setStats({ totalBookings, totalSpent, activeCount: active.length });
      
      setNow(new Date());
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      addNotification('Failed to refresh data', 'error', '⚠️');
    }
  };

  useEffect(() => {
    fetchAllForUser();
    const t = setInterval(fetchAllForUser, 5000); // Fetch every 5 seconds
    return () => clearInterval(t);
  }, [user.id]);

  const handleBookClick = (slot) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSlot(null);
  };

  const handleBookingSubmit = async ({ startTime, duration, vehicleNumber, phoneNumber }) => {
    if (!selectedSlot) return;
    try {
      await axios.post(`${API_BASE}/book`, { 
        userId: user.id, 
        slotId: selectedSlot.id,
        startTime,
        duration,
        vehicleNumber,
        phoneNumber
      });
      addNotification(`✓ Slot ${selectedSlot.id} booked successfully!`, 'success', '🎉');
      fetchAllForUser(); 
      handleModalClose();
    } catch (e) {
      addNotification('Booking failed: ' + (e.response?.data?.error || e.message), 'error', '⚠️');
    }
  };

  const cancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.post(`${API_BASE}/cancel`, { bookingId });
      addNotification('Booking cancelled successfully', 'warning', 'ℹ️');
      fetchAllForUser();
    } catch (e) {
      addNotification('Cancellation failed: ' + (e.response?.data?.error || e.message), 'error', '⚠️');
    }
  };

  const requestAccess = async (bookingId) => {
    try {
      const res = await axios.post(`${API_BASE}/requestAccess`, { bookingId });
      addNotification(res.data.message + ' 🚗 Gate opening...', 'success', '🚪');
      fetchAllForUser();
    } catch (e) {
      addNotification('Access request failed: ' + (e.response?.data?.error || e.message), 'error', '⚠️');
    }
  };

  const isWithinGracePeriod = (startTime) => {
    const start = new Date(startTime);
    const graceStart = new Date(start.getTime() - 5 * 60 * 1000); // 5 mins before
    const graceEnd = new Date(start.getTime() + 5 * 60 * 1000); // 5 mins after
    return now >= graceStart && now <= graceEnd;
  };

  const handlePay = async (paymentId) => {
    try {
      const res = await axios.post(`${API_BASE}/payments/pay`, {
        paymentId,
        userId: user.id
      });
      addNotification(res.data.message, 'success', '💳');
      fetchAllForUser();
    } catch (e) {
      addNotification('Payment failed: ' + (e.response?.data?.error || e.message), 'error', '⚠️');
    }
  };

  // Filtering logic
  const filteredHistory = bookingHistory.filter(b => {
    const matchesSearch = b.slot_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const freeSlots = slots.filter(s => s.status === 'free');
  const occupiedSlots = slots.filter(s => s.status === 'occupied');

  const currentStyles = isDarkMode ? darkStyles : lightStyles;

  // Show Profile Page if requested
  if (showProfile) {
    return (
      <ProfilePage 
        user={user} 
        onClose={() => setShowProfile(false)} 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div style={currentStyles.container}>
      <NotificationCenter notifications={notifications} onDismiss={dismissNotification} />
      
      {isModalOpen && <BookingModal slot={selectedSlot} onClose={handleModalClose} onBook={handleBookingSubmit} isDarkMode={isDarkMode} />}
      
      {/* Professional Commercial Header */}
      <div 
        className="header-container"
        style={{
          ...currentStyles.header,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: windowWidth < 768 ? '12px 16px' : '12px 24px',
          flexWrap: 'nowrap'
        }}
      >
        {/* Left Side - Logo */}
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: windowWidth < 768 ? '10px' : '15px', 
          flex: windowWidth < 480 ? '0 1 auto' : '1', 
          minWidth: 0
        }}>
          <div style={{
            ...currentStyles.logoContainer,
            width: windowWidth < 768 ? '40px' : '46px',
            height: windowWidth < 768 ? '40px' : '46px',
            flexShrink: 0
          }}>
            <ParkingLogo size={windowWidth < 768 ? 32 : 42} isDarkMode={isDarkMode} />
          </div>
          {windowWidth >= 480 && (
            <div style={{overflow: 'hidden', flex: 1, minWidth: 0}}>
              <h2 style={{
                ...currentStyles.headerTitle, 
                fontSize: windowWidth < 768 ? '16px' : '20px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: 0
              }}>
                Smart Parking System
              </h2>
              <p style={{
                ...currentStyles.headerSubtitle, 
                fontSize: windowWidth < 768 ? '10px' : '12px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: 0
              }}>
                Customer Dashboard
              </p>
            </div>
          )}
        </div>

        {/* Right Side - Icons */}
        <div 
          className="header-right"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: windowWidth < 768 ? '8px' : '12px',
            flexShrink: 0
          }}
        >
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            style={{
              ...currentStyles.settingsBtn,
              width: windowWidth < 768 ? '36px' : '38px',
              height: windowWidth < 768 ? '36px' : '38px'
            }}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          <button 
            onClick={() => setShowProfile(true)} 
            style={{
              ...currentStyles.profileBtn,
              width: windowWidth < 768 ? '36px' : '38px',
              height: windowWidth < 768 ? '36px' : '38px'
            }}
            title="Profile & Settings"
          >
            <Icons.User />
          </button>
        </div>
      </div>

      {/* Statistics Cards - Professional */}
      <div style={{
        ...currentStyles.statsGrid,
        marginTop: windowWidth < 768 ? '20px' : '20px',
        padding: windowWidth < 480 ? '15px 12px' : windowWidth < 768 ? '20px 15px' : '30px 40px'
      }} className="stats-grid">
        <div style={{...currentStyles.statCard, borderLeft: '4px solid #3b82f6'}}>
          <div style={{...currentStyles.statIcon, color: '#3b82f6'}}>
            <Icons.FileText />
          </div>
          <div style={currentStyles.statContent}>
            <div style={{...currentStyles.statValue, fontSize: windowWidth < 480 ? '28px' : '36px'}}>{stats.totalBookings}</div>
            <div style={{...currentStyles.statLabel, fontSize: windowWidth < 480 ? '11px' : '13px'}}>Total Bookings</div>
          </div>
        </div>
        <div style={{...currentStyles.statCard, borderLeft: '4px solid #22c55e'}}>
          <div style={{...currentStyles.statIcon, color: '#22c55e'}}>
            <Icons.IndianRupee />
          </div>
          <div style={currentStyles.statContent}>
            <div style={{...currentStyles.statValue, fontSize: windowWidth < 480 ? '28px' : '36px'}}>₹{stats.totalSpent.toFixed(2)}</div>
            <div style={{...currentStyles.statLabel, fontSize: windowWidth < 480 ? '11px' : '13px'}}>Total Spent</div>
          </div>
        </div>
        <div style={{...currentStyles.statCard, borderLeft: '4px solid #f59e0b'}}>
          <div style={{...currentStyles.statIcon, color: '#f59e0b'}}>
            <Icons.Clock />
          </div>
          <div style={currentStyles.statContent}>
            <div style={{...currentStyles.statValue, fontSize: windowWidth < 480 ? '28px' : '36px'}}>{stats.activeCount}</div>
            <div style={{...currentStyles.statLabel, fontSize: windowWidth < 480 ? '11px' : '13px'}}>Active Bookings</div>
          </div>
        </div>
        <div style={{...currentStyles.statCard, borderLeft: '4px solid #22c55e'}}>
          <div style={{...currentStyles.statIcon, color: '#22c55e'}}>
            <Icons.CheckCircle />
          </div>
          <div style={currentStyles.statContent}>
            <div style={{...currentStyles.statValue, fontSize: windowWidth < 480 ? '28px' : '36px'}}>{freeSlots.length}/{slots.length}</div>
            <div style={{...currentStyles.statLabel, fontSize: windowWidth < 480 ? '11px' : '13px'}}>Available Slots</div>
          </div>
        </div>
      </div>

      {/* Available Slots Section */}
      <div style={{...currentStyles.section, margin: windowWidth < 768 ? '20px 15px' : '30px 40px'}}>
        <h2 style={{...currentStyles.sectionTitle, fontSize: windowWidth < 480 ? '18px' : '22px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
          <Icons.Parking />
          Available Parking Slots
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: windowWidth < 480 ? '1fr' : windowWidth < 768 ? 'repeat(2, 1fr)' : windowWidth < 1024 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)', gap: '20px'}}>
          {slots.map(s => (
            <div 
              key={s.id} 
              style={{
                ...currentStyles.slotCard,
                cursor: s.status === 'free' ? 'pointer' : 'default',
                opacity: s.status === 'free' ? 1 : 0.7,
                borderLeft: `4px solid ${s.status === 'free' ? '#22c55e' : s.status === 'occupied' ? '#ef4444' : s.status === 'booked' ? '#f59e0b' : '#6b7280'}`
              }}
              onClick={() => s.status === 'free' && handleBookClick(s)}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                <span style={{fontSize: '20px', fontWeight: '700', color: isDarkMode ? '#fff' : '#1f2937'}}>{s.id}</span>
                <span>{getStatusIcon(s.status)}</span>
              </div>
              <div style={{fontSize: '12px', color: isDarkMode ? '#888' : '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px'}}>{s.status}</div>
              {s.status === 'free' && (
                <button style={{width: '100%', padding: '10px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600'}}>
                  Book Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Bookings Section */}
      <div style={{...currentStyles.section, margin: windowWidth < 768 ? '20px 15px' : '30px 40px'}}>
        <h2 style={{...currentStyles.sectionTitle, fontSize: windowWidth < 480 ? '18px' : '22px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
          <Icons.Clock /> Active Bookings
        </h2>
        {activeBookings.length === 0 ? (
          <div style={{textAlign: 'center', padding: '60px 20px', background: isDarkMode ? '#1a1a1a' : '#fff', borderRadius: '16px', border: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📭</div>
            <p style={{fontSize: '18px', color: isDarkMode ? '#fff' : '#1f2937', marginBottom: '10px'}}>No active bookings</p>
            <p style={{fontSize: '14px', color: isDarkMode ? '#888' : '#6b7280'}}>Book a slot above to get started!</p>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: windowWidth < 768 ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px'}}>
            {activeBookings.map(b => (
              <div key={b.id} style={{...currentStyles.slotCard, borderLeft: `4px solid ${b.status === 'active' ? '#f59e0b' : '#22c55e'}`}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                  <span style={{fontSize: '18px', fontWeight: '700', color: isDarkMode ? '#fff' : '#1f2937'}}>
                    <Icons.Parking /> Slot {b.slot_id}
                  </span>
                  <span style={{padding: '4px 12px', background: b.status === 'active' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)', color: b.status === 'active' ? '#f59e0b' : '#22c55e', borderRadius: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase'}}>{b.status}</span>
                </div>
                <div style={{marginBottom: '15px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: isDarkMode ? '#888' : '#6b7280'}}>
                    <Icons.Clock />
                    <span>{new Date(b.start_time).toLocaleString()}</span>
                  </div>
                  {b.end_time && (
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: isDarkMode ? '#888' : '#6b7280'}}>
                      <Icons.CheckCircle />
                      <span>{new Date(b.end_time).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                  <button onClick={() => cancel(b.id)} style={{flex: 1, padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'}}>
                    Cancel
                  </button>
                  {isWithinGracePeriod(b.start_time) && b.status === 'active' && (
                    <button onClick={() => requestAccess(b.id)} style={{flex: 1, padding: '10px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'}}>
                      Access Parking
                    </button>
                  )}
                  {b.status === 'entered' && (
                    <div style={{flex: 1, padding: '10px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '8px', textAlign: 'center', fontSize: '13px', fontWeight: '600'}}>✓ Parked</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking History Section */}
      <div style={{...currentStyles.section, margin: windowWidth < 768 ? '20px 15px' : '30px 40px'}}>
        <h2 style={{...currentStyles.sectionTitle, fontSize: windowWidth < 480 ? '18px' : '22px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
          <Icons.FileText /> Booking History
        </h2>
        
        {/* Search and Filter Controls */}
        <div style={{display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap'}}>
          <input 
            type="text"
            placeholder="🔍 Search by Slot ID or Booking ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              flex: 1, 
              minWidth: windowWidth < 480 ? '100%' : '250px', 
              padding: '12px 16px', 
              background: isDarkMode ? '#0f0f0f' : '#fff', 
              border: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb', 
              borderRadius: '8px', 
              color: isDarkMode ? '#fff' : '#1f2937', 
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              padding: '12px 16px', 
              background: isDarkMode ? '#0f0f0f' : '#fff', 
              border: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb', 
              borderRadius: '8px', 
              color: isDarkMode ? '#fff' : '#1f2937', 
              fontSize: '14px', 
              fontWeight: '500',
              cursor: 'pointer',
              minWidth: windowWidth < 480 ? '100%' : '150px',
              outline: 'none',
              lineHeight: '1.5',
              verticalAlign: 'middle',
              boxSizing: 'border-box',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='${isDarkMode ? '%23ffffff' : '%231f2937'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '12px',
              paddingRight: '36px'
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="entered">Entered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Desktop Table View */}
        {windowWidth >= 768 ? (
          <div style={{
            background: isDarkMode ? '#1a1a1a' : '#fff', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            border: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb', 
            boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', minWidth: '800px'}}>
                <thead>
                  <tr>
                    <th style={{padding: '16px 20px', textAlign: 'left', background: isDarkMode ? '#0f0f0f' : '#f9fafb', color: isDarkMode ? '#e5e5e5' : '#374151', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap'}}>BOOKING ID</th>
                    <th style={{padding: '16px 20px', textAlign: 'center', background: isDarkMode ? '#0f0f0f' : '#f9fafb', color: isDarkMode ? '#e5e5e5' : '#374151', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap'}}>SLOT</th>
                    <th style={{padding: '16px 20px', textAlign: 'left', background: isDarkMode ? '#0f0f0f' : '#f9fafb', color: isDarkMode ? '#e5e5e5' : '#374151', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap'}}>START TIME</th>
                    <th style={{padding: '16px 20px', textAlign: 'left', background: isDarkMode ? '#0f0f0f' : '#f9fafb', color: isDarkMode ? '#e5e5e5' : '#374151', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap'}}>END TIME</th>
                    <th style={{padding: '16px 20px', textAlign: 'center', background: isDarkMode ? '#0f0f0f' : '#f9fafb', color: isDarkMode ? '#e5e5e5' : '#374151', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap'}}>STATUS</th>
                    <th style={{padding: '16px 20px', textAlign: 'right', background: isDarkMode ? '#0f0f0f' : '#f9fafb', color: isDarkMode ? '#e5e5e5' : '#374151', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap'}}>CHARGE</th>
                    <th style={{padding: '16px 20px', textAlign: 'center', background: isDarkMode ? '#0f0f0f' : '#f9fafb', color: isDarkMode ? '#e5e5e5' : '#374151', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap'}}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{padding: '50px 20px', textAlign: 'center', color: isDarkMode ? '#888' : '#6b7280', fontSize: '14px'}}>
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((b, index) => (
                      <tr key={b.id} style={{
                        borderBottom: index < filteredHistory.length - 1 ? (isDarkMode ? '1px solid #2d2d2d' : '1px solid #f3f4f6') : 'none',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#222' : '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{padding: '16px 20px', fontSize: '13px', color: isDarkMode ? '#9ca3af' : '#6b7280', fontFamily: 'monospace'}}>
                          {b.id.substring(0, 8)}...
                        </td>
                        <td style={{padding: '16px 20px', fontSize: '15px', color: isDarkMode ? '#e5e5e5' : '#1f2937', fontWeight: '700', textAlign: 'center'}}>
                          {b.slot_id}
                        </td>
                        <td style={{padding: '16px 20px', fontSize: '13px', color: isDarkMode ? '#e5e5e5' : '#1f2937', whiteSpace: 'nowrap'}}>
                          {new Date(b.start_time).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}, {new Date(b.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </td>
                        <td style={{padding: '16px 20px', fontSize: '13px', color: isDarkMode ? '#e5e5e5' : '#1f2937', whiteSpace: 'nowrap'}}>
                          {b.exit_time ? `${new Date(b.exit_time).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}, ${new Date(b.exit_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}` : 'N/A'}
                        </td>
                        <td style={{padding: '16px 20px', fontSize: '13px', textAlign: 'center'}}>
                          <span style={{
                            display: 'inline-block',
                            padding: '5px 14px', 
                            borderRadius: '20px', 
                            fontSize: '11px', 
                            fontWeight: '700', 
                            textTransform: 'lowercase',
                            background: b.status === 'active' ? 'rgba(245, 158, 11, 0.15)' : b.status === 'completed' ? 'rgba(34, 197, 94, 0.15)' : b.status === 'entered' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
                            color: b.status === 'active' ? '#f59e0b' : b.status === 'completed' ? '#22c55e' : b.status === 'entered' ? '#3b82f6' : '#ef4444',
                            border: `1px solid ${b.status === 'active' ? 'rgba(245, 158, 11, 0.3)' : b.status === 'completed' ? 'rgba(34, 197, 94, 0.3)' : b.status === 'entered' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                          }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{padding: '16px 20px', fontSize: '14px', color: isDarkMode ? '#e5e5e5' : '#1f2937', fontWeight: '600', textAlign: 'right'}}>
                          {b.amount ? `₹${Number(b.amount).toFixed(2)}` : '-'}
                        </td>
                        <td style={{padding: '16px 20px', fontSize: '13px', textAlign: 'center'}}>
                          {b.payment_status === 'pending' && (
                            <button onClick={() => handlePay(b.payment_id)} style={{
                              padding: '7px 16px', 
                              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', 
                              color: '#fff', 
                              border: 'none', 
                              borderRadius: '8px', 
                              cursor: 'pointer', 
                              fontSize: '12px', 
                              fontWeight: '600',
                              transition: 'transform 0.2s, box-shadow 0.2s',
                              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-1px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
                            }}
                            >
                              Pay Now
                            </button>
                          )}
                          {b.payment_status === 'paid' && (
                            <span style={{color: '#22c55e', fontWeight: '700', fontSize: '13px'}}>✓ Paid</span>
                          )}
                          {!b.payment_status && '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Mobile Card View */
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {filteredHistory.length === 0 ? (
              <div style={{
                background: isDarkMode ? '#1a1a1a' : '#fff',
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
                color: isDarkMode ? '#888' : '#6b7280',
                border: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb'
              }}>
                No bookings found
              </div>
            ) : (
              filteredHistory.map(b => (
                <div key={b.id} style={{
                  background: isDarkMode ? '#1a1a1a' : '#fff',
                  borderRadius: '12px',
                  padding: '16px',
                  border: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb',
                  boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  {/* Header Row */}
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: isDarkMode ? '1px solid #2d2d2d' : '1px solid #f3f4f6'}}>
                    <div>
                      <div style={{fontSize: '11px', color: isDarkMode ? '#888' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px'}}>Booking ID</div>
                      <div style={{fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280', fontFamily: 'monospace'}}>{b.id.substring(0, 10)}...</div>
                    </div>
                    <div style={{fontSize: '24px', fontWeight: '700', color: isDarkMode ? '#e5e5e5' : '#1f2937'}}>{b.slot_id}</div>
                  </div>

                  {/* Details Grid */}
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
                    <div>
                      <div style={{fontSize: '11px', color: isDarkMode ? '#888' : '#6b7280', textTransform: 'uppercase', marginBottom: '4px'}}>Start Time</div>
                      <div style={{fontSize: '12px', color: isDarkMode ? '#e5e5e5' : '#1f2937', fontWeight: '500'}}>
                        {new Date(b.start_time).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}<br/>
                        {new Date(b.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </div>
                    </div>
                    <div>
                      <div style={{fontSize: '11px', color: isDarkMode ? '#888' : '#6b7280', textTransform: 'uppercase', marginBottom: '4px'}}>End Time</div>
                      <div style={{fontSize: '12px', color: isDarkMode ? '#e5e5e5' : '#1f2937', fontWeight: '500'}}>
                        {b.exit_time ? (
                          <>
                            {new Date(b.exit_time).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}<br/>
                            {new Date(b.exit_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </>
                        ) : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Status and Charge Row */}
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                    <div>
                      <div style={{fontSize: '11px', color: isDarkMode ? '#888' : '#6b7280', textTransform: 'uppercase', marginBottom: '4px'}}>Status</div>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        textTransform: 'lowercase',
                        background: b.status === 'active' ? 'rgba(245, 158, 11, 0.15)' : b.status === 'completed' ? 'rgba(34, 197, 94, 0.15)' : b.status === 'entered' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
                        color: b.status === 'active' ? '#f59e0b' : b.status === 'completed' ? '#22c55e' : b.status === 'entered' ? '#3b82f6' : '#ef4444',
                        border: `1px solid ${b.status === 'active' ? 'rgba(245, 158, 11, 0.3)' : b.status === 'completed' ? 'rgba(34, 197, 94, 0.3)' : b.status === 'entered' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                      }}>
                        {b.status}
                      </span>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={{fontSize: '11px', color: isDarkMode ? '#888' : '#6b7280', textTransform: 'uppercase', marginBottom: '4px'}}>Charge</div>
                      <div style={{fontSize: '16px', fontWeight: '700', color: isDarkMode ? '#e5e5e5' : '#1f2937'}}>
                        {b.amount ? `₹${Number(b.amount).toFixed(2)}` : '-'}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {b.payment_status === 'pending' && (
                    <button onClick={() => handlePay(b.payment_id)} style={{
                      width: '100%',
                      padding: '10px', 
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      fontSize: '13px', 
                      fontWeight: '600',
                      boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
                    }}>
                      Pay Now
                    </button>
                  )}
                  {b.payment_status === 'paid' && (
                    <div style={{
                      width: '100%',
                      padding: '10px',
                      textAlign: 'center',
                      color: '#22c55e',
                      fontWeight: '700',
                      fontSize: '13px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}>
                      ✓ Payment Complete
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Profile & Settings Page Component
function ProfilePage({ user, onClose, isDarkMode, setIsDarkMode, onLogout }) {
  const [apiBase, setApiBase] = useState(API_BASE);
  const [refreshRate, setRefreshRate] = useState(5000);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const currentStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isDarkMode ? '#0f0f0f' : '#f3f4f6',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{...currentStyles.header}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <button 
            onClick={onClose} 
            style={{
              background: 'transparent',
              border: 'none',
              color: isDarkMode ? '#fff' : '#1f2937',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            ←
          </button>
          <div>
            <h2 style={{...currentStyles.headerTitle, fontSize: '20px'}}>Profile & Settings</h2>
            <p style={{...currentStyles.headerSubtitle, fontSize: '12px'}}>Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div style={{maxWidth: '900px', margin: '30px auto', padding: '0 20px'}}>
        {/* Profile Information Card */}
        <div style={{
          background: isDarkMode ? '#1a1a1a' : '#ffffff',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '20px',
          boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)',
          border: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: isDarkMode ? '#fff' : '#1f2937',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Icons.User /> Profile Information
          </h3>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px'}}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: user.role === 'admin' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
              boxShadow: user.role === 'admin'
                ? '0 4px 20px rgba(102, 126, 234, 0.4)'
                : '0 4px 20px rgba(59, 130, 246, 0.4)'
            }}>
              <Icons.User size={40} color="#ffffff" />
            </div>
            <div>
              <div style={{fontSize: '24px', fontWeight: '600', color: isDarkMode ? '#fff' : '#1f2937'}}>{user.username}</div>
              <div style={{fontSize: '14px', color: isDarkMode ? '#888' : '#6b7280', marginTop: '5px'}}>
                {user.role === 'admin' ? 'Administrator Account' : 'Consumer Account'}
              </div>
              <div style={{
                display: 'inline-block',
                marginTop: '10px',
                padding: '4px 12px',
                background: user.role === 'admin' 
                  ? 'rgba(102, 126, 234, 0.15)' 
                  : 'rgba(59, 130, 246, 0.15)',
                color: user.role === 'admin' ? '#667eea' : '#3b82f6',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {user.role === 'admin' ? '👑 Admin' : '👤 User'}
              </div>
            </div>
          </div>
          
          {/* Additional Profile Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb'
          }}>
            <div>
              <div style={{fontSize: '12px', color: isDarkMode ? '#888' : '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                Username
              </div>
              <div style={{fontSize: '15px', fontWeight: '500', color: isDarkMode ? '#e5e7eb' : '#1f2937'}}>
                {user.username}
              </div>
            </div>
            <div>
              <div style={{fontSize: '12px', color: isDarkMode ? '#888' : '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                Role
              </div>
              <div style={{fontSize: '15px', fontWeight: '500', color: isDarkMode ? '#e5e7eb' : '#1f2937'}}>
                {user.role === 'admin' ? 'Administrator' : 'Consumer'}
              </div>
            </div>
            {user.role === 'admin' && (
              <>
                <div>
                  <div style={{fontSize: '12px', color: isDarkMode ? '#888' : '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                    Access Level
                  </div>
                  <div style={{fontSize: '15px', fontWeight: '500', color: '#22c55e'}}>
                    Full Access
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '12px', color: isDarkMode ? '#888' : '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                    Permissions
                  </div>
                  <div style={{fontSize: '15px', fontWeight: '500', color: isDarkMode ? '#e5e7eb' : '#1f2937'}}>
                    All Systems
                  </div>
                </div>
              </>
            )}
            {user.role !== 'admin' && (
              <>
                <div>
                  <div style={{fontSize: '12px', color: isDarkMode ? '#888' : '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                    Account Type
                  </div>
                  <div style={{fontSize: '15px', fontWeight: '500', color: isDarkMode ? '#e5e7eb' : '#1f2937'}}>
                    Standard
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '12px', color: isDarkMode ? '#888' : '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                    Member Since
                  </div>
                  <div style={{fontSize: '15px', fontWeight: '500', color: isDarkMode ? '#e5e7eb' : '#1f2937'}}>
                    {new Date().getFullYear()}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Theme Settings Card */}
        <div style={{
          background: isDarkMode ? '#1a1a1a' : '#ffffff',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '20px',
          boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)',
          border: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: isDarkMode ? '#fff' : '#1f2937',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Icons.Settings /> Appearance
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 0',
            borderBottom: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb'
          }}>
            <div>
              <div style={{fontSize: '16px', fontWeight: '500', color: isDarkMode ? '#fff' : '#1f2937'}}>Dark Mode</div>
              <div style={{fontSize: '13px', color: isDarkMode ? '#888' : '#6b7280', marginTop: '3px'}}>Toggle dark/light theme</div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                width: '50px',
                height: '28px',
                background: isDarkMode ? '#3b82f6' : '#d1d5db',
                border: 'none',
                borderRadius: '14px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                background: '#fff',
                borderRadius: '50%',
                position: 'absolute',
                top: '3px',
                left: isDarkMode ? '25px' : '3px',
                transition: 'all 0.3s'
              }} />
            </button>
          </div>
        </div>

        {/* System Settings Card - Admin Only */}
        {user.role === 'admin' && (
          <div style={{
            background: isDarkMode ? '#1a1a1a' : '#ffffff',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)',
            border: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: isDarkMode ? '#fff' : '#1f2937',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Icons.Settings /> System Settings
            </h3>
            
            <div style={{marginBottom: '20px'}}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: isDarkMode ? '#fff' : '#1f2937',
                marginBottom: '8px'
              }}>API Base URL</label>
              <input
                type="text"
                value={apiBase}
                onChange={(e) => setApiBase(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: isDarkMode ? '#0f0f0f' : '#f9fafb',
                  border: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: isDarkMode ? '#fff' : '#1f2937',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="http://192.168.1.19:3000/api"
              />
              <div style={{fontSize: '12px', color: isDarkMode ? '#888' : '#6b7280', marginTop: '5px'}}>
                Backend server address
              </div>
            </div>

            <div style={{marginBottom: '20px'}}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: isDarkMode ? '#fff' : '#1f2937',
                marginBottom: '8px'
              }}>Refresh Rate (ms)</label>
              <input
                type="number"
                value={refreshRate}
                onChange={(e) => setRefreshRate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: isDarkMode ? '#0f0f0f' : '#f9fafb',
                  border: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: isDarkMode ? '#fff' : '#1f2937',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="5000"
              />
              <div style={{fontSize: '12px', color: isDarkMode ? '#888' : '#6b7280', marginTop: '5px'}}>
                How often data refreshes (default: 5000ms)
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px 0',
              borderBottom: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb'
            }}>
              <div>
                <div style={{fontSize: '16px', fontWeight: '500', color: isDarkMode ? '#fff' : '#1f2937'}}>Auto Refresh</div>
                <div style={{fontSize: '13px', color: isDarkMode ? '#888' : '#6b7280', marginTop: '3px'}}>Automatically refresh data</div>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                style={{
                  width: '50px',
                  height: '28px',
                  background: autoRefresh ? '#3b82f6' : '#d1d5db',
                  border: 'none',
                  borderRadius: '14px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  background: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '3px',
                  left: autoRefresh ? '25px' : '3px',
                  transition: 'all 0.3s'
                }} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px 0',
              borderBottom: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb'
            }}>
              <div>
                <div style={{fontSize: '16px', fontWeight: '500', color: isDarkMode ? '#fff' : '#1f2937'}}>Push Notifications</div>
                <div style={{fontSize: '13px', color: isDarkMode ? '#888' : '#6b7280', marginTop: '3px'}}>Receive browser notifications</div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                style={{
                  width: '50px',
                  height: '28px',
                  background: notifications ? '#3b82f6' : '#d1d5db',
                  border: 'none',
                  borderRadius: '14px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  background: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '3px',
                  left: notifications ? '25px' : '3px',
                  transition: 'all 0.3s'
                }} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px 0'
            }}>
              <div>
                <div style={{fontSize: '16px', fontWeight: '500', color: isDarkMode ? '#fff' : '#1f2937'}}>Email Notifications</div>
                <div style={{fontSize: '13px', color: isDarkMode ? '#888' : '#6b7280', marginTop: '3px'}}>Receive email alerts</div>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                style={{
                  width: '50px',
                  height: '28px',
                  background: emailNotifications ? '#3b82f6' : '#d1d5db',
                  border: 'none',
                  borderRadius: '14px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  background: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '3px',
                  left: emailNotifications ? '25px' : '3px',
                  transition: 'all 0.3s'
                }} />
              </button>
            </div>
          </div>
        )}

        {/* Logout Section */}
        <div style={{
          background: isDarkMode ? '#1a1a1a' : '#ffffff',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '20px',
          boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)',
          border: isDarkMode ? '1px solid #2d2d2d' : '1px solid #e5e7eb'
        }}>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to logout?')) {
                onLogout();
              }
            }}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.2)';
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.1)';
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
          >
            <Icons.Logout /> Logout
          </button>
        </div>

        <div style={{textAlign: 'center', padding: '20px 0', color: isDarkMode ? '#666' : '#9ca3af', fontSize: '13px'}}>
          Smart Parking System v1.0 • © 2025
        </div>
      </div>
    </div>
  );
}

function AdminView({ user, onLogout }) {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [occupancyData, setOccupancyData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showProfile, setShowProfile] = useState(false);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAll = async () => {
    const [sRes, bRes, aRes] = await Promise.all([
      axios.get(`${API_BASE}/slots`),
      axios.get(`${API_BASE}/bookings`),
      axios.get(`${API_BASE}/analytics/occupancy`).catch(() => ({ data: [] }))
    ]);
    setSlots(sRes.data);
    setBookings(bRes.data);
    setOccupancyData(aRes.data);
  };

  useEffect(() => {
    fetchAll();
    const t = setInterval(fetchAll, 5000);
    return () => clearInterval(t);
  }, []);

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSlot(null);
  };

  const handleUpdateSlot = async (slotId, newStatus) => {
    try {
        const res = await axios.post(`${API_BASE}/slots/updateStatus`, { slotId, status: newStatus });
        alert(res.data.message || 'Slot updated successfully');
        fetchAll();
    } catch (e) {
        alert('Failed to update slot status: ' + (e.response?.data?.error || e.message));
    }
  };

  const handleEmergencyGateOpen = async (gate) => {
    try {
        await axios.post(`${API_BASE}/gate/emergency-open`, { gate });
        alert(`${gate.charAt(0).toUpperCase() + gate.slice(1)} gate opened successfully!`);
    } catch (e) {
        alert('Failed to open gate: ' + (e.response?.data?.error || e.message));
    }
  };

  const freeSlots = slots.filter(s => s.status === 'free').length;
  const occupiedSlots = slots.filter(s => s.status === 'occupied').length;
  const bookedSlots = slots.filter(s => s.status === 'booked').length;
  const maintenanceSlots = slots.filter(s => s.status === 'maintenance').length;

  const pieData = [
    { name: 'Free', value: freeSlots },
    { name: 'Occupied', value: occupiedSlots },
    { name: 'Reserved', value: bookedSlots },
    { name: 'Maintenance', value: maintenanceSlots }
  ];
  const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#6b7280'];

  const currentStyles = isDarkMode ? darkStyles : lightStyles;

  // Show Profile Page if requested
  if (showProfile) {
    return (
      <ProfilePage 
        user={user} 
        onClose={() => setShowProfile(false)} 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div style={currentStyles.container}>
      <AdminSlotModal slot={selectedSlot} bookings={bookings} onClose={handleModalClose} onUpdate={handleUpdateSlot} />
      
      {/* Professional Commercial Header */}
      <div 
        className="header-container"
        style={{
          ...currentStyles.header,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: windowWidth < 768 ? '12px 16px' : '12px 24px',
          flexWrap: 'nowrap'
        }}
      >
        {/* Left Side - Logo */}
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: windowWidth < 768 ? '10px' : '15px', 
          flex: windowWidth < 480 ? '0 1 auto' : '1', 
          minWidth: 0
        }}>
          <div style={{
            ...currentStyles.logoContainer,
            width: windowWidth < 768 ? '40px' : '46px',
            height: windowWidth < 768 ? '40px' : '46px',
            flexShrink: 0
          }}>
            <ParkingLogo size={windowWidth < 768 ? 32 : 42} isDarkMode={isDarkMode} />
          </div>
          {windowWidth >= 480 && (
            <div style={{overflow: 'hidden', flex: 1, minWidth: 0}}>
              <h2 style={{
                ...currentStyles.headerTitle, 
                fontSize: windowWidth < 768 ? '16px' : '20px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: 0
              }}>
                Smart Parking System
              </h2>
              <p style={{
                ...currentStyles.headerSubtitle, 
                fontSize: windowWidth < 768 ? '10px' : '12px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                margin: 0
              }}>
                Administrator Dashboard
              </p>
            </div>
          )}
        </div>

        {/* Right Side - Icons */}
        <div 
          className="header-right"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: windowWidth < 768 ? '8px' : '12px',
            flexShrink: 0
          }}
        >
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            style={{
              ...currentStyles.settingsBtn,
              width: windowWidth < 768 ? '36px' : '38px',
              height: windowWidth < 768 ? '36px' : '38px'
            }}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          <button 
            onClick={() => setShowProfile(true)} 
            style={{
              ...currentStyles.profileBtn,
              width: windowWidth < 768 ? '36px' : '38px',
              height: windowWidth < 768 ? '36px' : '38px'
            }}
            title="Profile & Settings"
          >
            <Icons.User />
          </button>
        </div>
      </div>

      {/* Stats Bar - Professional */}
      <div style={{
        ...currentStyles.statsGrid,
        marginTop: windowWidth < 768 ? '20px' : '20px',
        padding: windowWidth < 480 ? '15px 12px' : windowWidth < 768 ? '20px 15px' : '30px 40px'
      }} className="stats-grid">
        <div style={{...currentStyles.statCard, borderLeft: '4px solid #22c55e'}}>
          <div style={{...currentStyles.statIcon, color: '#22c55e'}}>
            <Icons.CheckCircle />
          </div>
          <div style={currentStyles.statContent}>
            <div style={{...currentStyles.statValue, fontSize: windowWidth < 480 ? '28px' : '36px'}}>{freeSlots}</div>
            <div style={{...currentStyles.statLabel, fontSize: windowWidth < 480 ? '11px' : '13px'}}>Available Slots</div>
          </div>
        </div>
        <div style={{...currentStyles.statCard, borderLeft: '4px solid #ef4444'}}>
          <div style={{...currentStyles.statIcon, color: '#ef4444'}}>
            <Icons.Car />
          </div>
          <div style={currentStyles.statContent}>
            <div style={{...currentStyles.statValue, fontSize: windowWidth < 480 ? '28px' : '36px'}}>{occupiedSlots}</div>
            <div style={{...currentStyles.statLabel, fontSize: windowWidth < 480 ? '11px' : '13px'}}>Occupied Slots</div>
          </div>
        </div>
        <div style={{...currentStyles.statCard, borderLeft: '4px solid #f59e0b'}}>
          <div style={{...currentStyles.statIcon, color: '#f59e0b'}}>
            <Icons.Calendar />
          </div>
          <div style={currentStyles.statContent}>
            <div style={{...currentStyles.statValue, fontSize: windowWidth < 480 ? '28px' : '36px'}}>{bookedSlots}</div>
            <div style={{...currentStyles.statLabel, fontSize: windowWidth < 480 ? '11px' : '13px'}}>Reserved Slots</div>
          </div>
        </div>
        <div style={{...currentStyles.statCard, borderLeft: '4px solid #6b7280'}}>
          <div style={{...currentStyles.statIcon, color: '#6b7280'}}>
            <Icons.Tool />
          </div>
          <div style={currentStyles.statContent}>
            <div style={currentStyles.statValue}>{maintenanceSlots}</div>
            <div style={currentStyles.statLabel}>Maintenance</div>
          </div>
        </div>
      </div>

      {/* Emergency Controls - Professional */}
      <div style={{...currentStyles.emergencyPanel, margin: windowWidth < 768 ? '0 15px 20px' : '0 40px 30px'}}>
        <div style={{...currentStyles.emergencyHeader, flexDirection: windowWidth < 480 ? 'column' : 'row', alignItems: windowWidth < 480 ? 'flex-start' : 'center', gap: windowWidth < 480 ? '10px' : '0'}}>
          <h3 style={{...currentStyles.sectionTitle, fontSize: windowWidth < 480 ? '16px' : '20px', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span style={{color: '#ef4444'}}><Icons.AlertTriangle /></span>
            Emergency Controls
          </h3>
          <span style={currentStyles.emergencyBadge}>Critical Access</span>
        </div>
        <div style={currentStyles.emergencyButtons} className="emergency-buttons">
          <button onClick={() => handleEmergencyGateOpen('entrance')} style={{...currentStyles.emergencyBtnEntrance, padding: windowWidth < 480 ? '15px' : '20px'}}>
            <span style={{fontSize: windowWidth < 480 ? '20px' : '24px'}}><Icons.AlertTriangle /></span>
            <div>
              <div style={{fontWeight: 'bold', marginBottom: '4px', fontSize: windowWidth < 480 ? '13px' : '14px'}}>Emergency Entrance</div>
              <div style={{fontSize: windowWidth < 480 ? '11px' : '12px', opacity: 0.8}}>Override entrance gate</div>
            </div>
          </button>
          <button onClick={() => handleEmergencyGateOpen('exit')} style={{...currentStyles.emergencyBtnExit, padding: windowWidth < 480 ? '15px' : '20px'}}>
            <span style={{fontSize: windowWidth < 480 ? '20px' : '24px'}}>🚨</span>
            <div>
              <div style={{fontWeight: 'bold', marginBottom: '4px', fontSize: windowWidth < 480 ? '13px' : '14px'}}>Emergency Exit</div>
              <div style={{fontSize: windowWidth < 480 ? '11px' : '12px', opacity: 0.8}}>Override exit gate</div>
            </div>
          </button>
        </div>
      </div>

      {/* Analytics Charts - Professional */}
      <div style={{...currentStyles.analyticsContainer, padding: windowWidth < 768 ? '0 15px 20px' : '0 40px 30px'}} className="analytics-container">
        <div style={currentStyles.chartCard}>
          <h3 style={{...currentStyles.chartTitle, display: 'flex', alignItems: 'center', gap: '10px'}}>
            <Icons.TrendingUp />
            Occupancy Trends
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#2a2a2a' : '#e5e7eb'} />
              <XAxis dataKey="time" stroke={isDarkMode ? '#a0a0a0' : '#6b7280'} style={{fontSize: '12px'}} />
              <YAxis allowDecimals={false} stroke={isDarkMode ? '#a0a0a0' : '#6b7280'} style={{fontSize: '12px'}} />
              <Tooltip 
                contentStyle={{
                  background: isDarkMode ? '#2d2d2d' : 'white',
                  border: `2px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                  boxShadow: isDarkMode ? '0 8px 24px rgba(0, 0, 0, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
                labelStyle={{
                  color: isDarkMode ? '#f3f4f6' : '#1f2937',
                  fontWeight: '600',
                  fontSize: '13px',
                  marginBottom: '6px'
                }}
                itemStyle={{
                  color: isDarkMode ? '#e5e7eb' : '#374151',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              />
              <Line type="monotone" dataKey="occupied" stroke="#6366f1" strokeWidth={3} dot={{fill: '#6366f1', r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={currentStyles.chartCard}>
          <h3 style={currentStyles.chartTitle}>🎯 Slot Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {pieData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
              </Pie>
              <Legend 
                wrapperStyle={{color: isDarkMode ? '#e5e5e5' : '#2c3e50', fontSize: '13px'}}
                iconType="circle"
              />
              <Tooltip 
                contentStyle={{
                  background: isDarkMode ? '#2d2d2d' : 'white',
                  border: `2px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                  boxShadow: isDarkMode ? '0 8px 24px rgba(0, 0, 0, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
                labelStyle={{
                  color: isDarkMode ? '#f3f4f6' : '#1f2937',
                  fontWeight: '600',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}
                itemStyle={{
                  color: isDarkMode ? '#e5e7eb' : '#374151',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Parking Map - Responsive */}
      <div style={{...currentStyles.section, padding: windowWidth < 768 ? '0 15px 20px' : '0 40px 30px'}}>
        <h3 style={{...currentStyles.sectionTitle, fontSize: windowWidth < 480 ? '18px' : '20px'}}>🅿️ Parking Lot Overview</h3>
        <div style={currentStyles.slotGrid} className="slot-grid">
          {slots.map(s => (
            <div 
              key={s.id} 
              style={{
                ...currentStyles.slot,
                ...getSlotStyleByTheme(s.status, isDarkMode),
                padding: windowWidth < 480 ? '15px' : '20px'
              }} 
              onClick={() => handleSlotClick(s)}
            >
              <div style={currentStyles.slotHeader}>
                <div style={currentStyles.slotId}>{s.id}</div>
                <div style={currentStyles.slotBadge}>{getSlotEmoji(s.status)}</div>
              </div>
              <div style={currentStyles.slotStatus}>{s.status.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings Table - Professional */}
      <div style={{...currentStyles.section, padding: windowWidth < 768 ? '0 15px 20px' : '0 40px 30px'}}>
        <h3 style={{...currentStyles.sectionTitle, fontSize: windowWidth < 480 ? '18px' : '20px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
          <Icons.FileText />
          All Bookings
        </h3>
        <div style={currentStyles.tableContainer} className="table-container">
          <table style={currentStyles.table}>
            <thead>
              <tr style={currentStyles.tableHeaderRow}>
                <th style={{
                  ...currentStyles.tableHeader, 
                  padding: windowWidth < 768 ? '12px 10px' : '16px 18px', 
                  fontSize: windowWidth < 480 ? '11px' : '13px',
                  width: '12%'
                }}>ID</th>
                <th style={{
                  ...currentStyles.tableHeader, 
                  padding: windowWidth < 768 ? '12px 10px' : '16px 18px', 
                  fontSize: windowWidth < 480 ? '11px' : '13px',
                  width: '7%',
                  textAlign: 'center'
                }}>SLOT</th>
                <th style={{
                  ...currentStyles.tableHeader, 
                  padding: windowWidth < 768 ? '12px 10px' : '16px 18px', 
                  fontSize: windowWidth < 480 ? '11px' : '13px',
                  width: '11%'
                }}>USER</th>
                <th style={{
                  ...currentStyles.tableHeader, 
                  padding: windowWidth < 768 ? '12px 10px' : '16px 18px', 
                  fontSize: windowWidth < 480 ? '11px' : '13px',
                  width: '18%'
                }}>TIME</th>
                <th style={{
                  ...currentStyles.tableHeader, 
                  padding: windowWidth < 768 ? '12px 10px' : '16px 18px', 
                  fontSize: windowWidth < 480 ? '11px' : '13px',
                  width: '14%',
                  textAlign: 'center'
                }}>STATUS</th>
                <th style={{
                  ...currentStyles.tableHeader, 
                  padding: windowWidth < 768 ? '12px 10px' : '16px 18px', 
                  fontSize: windowWidth < 480 ? '11px' : '13px',
                  width: '12%',
                  textAlign: 'right'
                }}>AMOUNT</th>
                <th style={{
                  ...currentStyles.tableHeader, 
                  padding: windowWidth < 768 ? '12px 10px' : '16px 18px', 
                  fontSize: windowWidth < 480 ? '11px' : '13px',
                  width: '14%',
                  textAlign: 'center'
                }}>PAYMENT</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" style={currentStyles.noData}>
                    <div style={{fontSize: '48px', marginBottom: '10px'}}>📭</div>
                    <div>No bookings found</div>
                  </td>
                </tr>
              ) : (
                bookings.map((b, idx) => (
                  <tr key={b.id} style={{
                    ...currentStyles.tableRow,
                    background: idx % 2 === 0 ? (isDarkMode ? '#1e1e1e' : '#f9fafb') : (isDarkMode ? '#1a1a1a' : 'white')
                  }}>
                    <td style={{
                      ...currentStyles.tableCell, 
                      padding: windowWidth < 768 ? '12px 10px' : '14px 18px', 
                      fontSize: windowWidth < 480 ? '12px' : '14px',
                      verticalAlign: 'middle'
                    }}>
                      <span style={{
                        ...currentStyles.idBadge, 
                        fontSize: windowWidth < 480 ? '10px' : '11px', 
                        padding: windowWidth < 480 ? '4px 8px' : '5px 10px',
                        display: 'inline-block'
                      }}>{b.id.substring(0, 8)}</span>
                    </td>
                    <td style={{
                      ...currentStyles.tableCell, 
                      padding: windowWidth < 768 ? '12px 10px' : '14px 18px', 
                      fontSize: windowWidth < 480 ? '12px' : '14px',
                      textAlign: 'center',
                      verticalAlign: 'middle'
                    }}>
                      <span style={{
                        ...currentStyles.slotBadge,
                        display: 'inline-block',
                        minWidth: '40px'
                      }}>{b.slot_id}</span>
                    </td>
                    <td style={{
                      ...currentStyles.tableCell, 
                      padding: windowWidth < 768 ? '12px 10px' : '14px 18px', 
                      fontSize: windowWidth < 480 ? '11px' : '13px',
                      fontFamily: 'monospace',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      verticalAlign: 'middle'
                    }}>
                      {windowWidth < 768 ? `${b.user_id.substring(0, 6)}...` : `${b.user_id.substring(0, 10)}...`}
                    </td>
                    <td style={{
                      ...currentStyles.tableCell, 
                      padding: windowWidth < 768 ? '12px 10px' : '14px 18px', 
                      fontSize: windowWidth < 480 ? '12px' : '14px',
                      verticalAlign: 'middle'
                    }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: windowWidth < 768 ? 'column' : 'row',
                        alignItems: windowWidth < 768 ? 'flex-start' : 'center',
                        gap: windowWidth < 768 ? '2px' : '8px'
                      }}>
                        <span style={{
                          fontSize: windowWidth < 480 ? '12px' : '13px',
                          fontWeight: '600',
                          color: isDarkMode ? '#e5e5e5' : '#1f2937'
                        }}>
                          {new Date(b.start_time).toLocaleDateString('en-US', { 
                            month: '2-digit', 
                            day: '2-digit', 
                            year: 'numeric' 
                          })}
                        </span>
                        <span style={{
                          fontSize: windowWidth < 480 ? '11px' : '12px',
                          color: isDarkMode ? '#9ca3af' : '#6b7280',
                          fontWeight: '500'
                        }}>
                          {new Date(b.start_time).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </span>
                      </div>
                    </td>
                    <td style={{
                      ...currentStyles.tableCell, 
                      padding: windowWidth < 768 ? '12px 10px' : '14px 18px', 
                      fontSize: windowWidth < 480 ? '12px' : '14px',
                      textAlign: 'center',
                      verticalAlign: 'middle'
                    }}>
                      <span style={{
                        ...currentStyles.statusBadge,
                        ...getStatusBadgeStyle(b.status),
                        padding: windowWidth < 480 ? '5px 10px' : '6px 14px',
                        fontSize: windowWidth < 480 ? '10px' : '11px',
                        display: 'inline-block',
                        minWidth: windowWidth < 768 ? '80px' : '90px'
                      }}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{
                      ...currentStyles.tableCell, 
                      padding: windowWidth < 768 ? '12px 10px' : '14px 18px', 
                      fontSize: windowWidth < 480 ? '12px' : '14px',
                      textAlign: 'right',
                      verticalAlign: 'middle'
                    }}>
                      {b.payment_amount ? (
                        <span style={{
                          fontWeight: '600',
                          color: isDarkMode ? '#10b981' : '#059669',
                          fontSize: windowWidth < 480 ? '13px' : '14px'
                        }}>
                          ₹{Number(b.payment_amount).toFixed(2)}
                        </span>
                      ) : (
                        <span style={{
                          fontSize: windowWidth < 480 ? '11px' : '12px',
                          color: isDarkMode ? '#6b7280' : '#9ca3af',
                          fontStyle: 'italic'
                        }}>
                          -
                        </span>
                      )}
                    </td>
                    <td style={{
                      ...currentStyles.tableCell, 
                      padding: windowWidth < 768 ? '12px 10px' : '14px 18px', 
                      fontSize: windowWidth < 480 ? '12px' : '14px',
                      textAlign: 'center',
                      verticalAlign: 'middle'
                    }}>
                      {b.payment_status ? (
                        <span style={{
                          padding: windowWidth < 480 ? '4px 8px' : '5px 12px',
                          borderRadius: '16px',
                          fontSize: windowWidth < 480 ? '10px' : '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'inline-block',
                          minWidth: windowWidth < 768 ? '70px' : '80px',
                          background: b.payment_status === 'paid' 
                            ? (isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)')
                            : b.payment_status === 'pending'
                            ? (isDarkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)')
                            : (isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)'),
                          color: b.payment_status === 'paid' 
                            ? '#10b981'
                            : b.payment_status === 'pending'
                            ? '#f59e0b'
                            : '#ef4444',
                          border: `1px solid ${
                            b.payment_status === 'paid' 
                            ? (isDarkMode ? '#10b981' : '#059669')
                            : b.payment_status === 'pending'
                            ? (isDarkMode ? '#f59e0b' : '#d97706')
                            : (isDarkMode ? '#ef4444' : '#dc2626')
                          }`
                        }}>
                          {b.payment_status}
                        </span>
                      ) : (
                        <span style={{
                          fontSize: windowWidth < 480 ? '11px' : '12px',
                          color: isDarkMode ? '#6b7280' : '#9ca3af',
                          fontStyle: 'italic'
                        }}>
                          N/A
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper functions for theme-aware slot styling
const getSlotStyleByTheme = (status, isDark = true) => {
  if (isDark) {
    switch (status) {
      case 'free':
        return {
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          border: '2px solid #10b981',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
        };
      case 'occupied':
        return {
          background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
          border: '2px solid #ef4444',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
        };
      case 'booked':
        return {
          background: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
          border: '2px solid #f59e0b',
          boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
        };
      case 'maintenance':
        return {
          background: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
          border: '2px solid #6b7280',
          boxShadow: '0 0 20px rgba(107, 114, 128, 0.3)'
        };
      default:
        return {
          background: '#2a2a2a',
          border: '2px solid #444'
        };
    }
  } else {
    // Light mode styles
    switch (status) {
      case 'free':
        return {
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          border: '2px solid #10b981',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
        };
      case 'occupied':
        return {
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          border: '2px solid #ef4444',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
        };
      case 'booked':
        return {
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '2px solid #f59e0b',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
        };
      case 'maintenance':
        return {
          background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
          border: '2px solid #6b7280',
          boxShadow: '0 4px 12px rgba(107, 114, 128, 0.2)'
        };
      default:
        return {
          background: 'white',
          border: '2px solid #e5e7eb'
        };
    }
  }
};

// Keep backward compatibility
const getDarkSlotStyle = (status) => getSlotStyleByTheme(status, true);

const getSlotEmoji = (status) => {
  switch (status) {
    case 'free': return '✅';
    case 'occupied': return '🚗';
    case 'booked': return '📅';
    case 'maintenance': return '🔧';
    default: return '❓';
  }
};

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'active':
      return {
        background: 'rgba(16, 185, 129, 0.2)',
        color: '#10b981',
        border: '1px solid #10b981'
      };
    case 'completed':
      return {
        background: 'rgba(59, 130, 246, 0.2)',
        color: '#3b82f6',
        border: '1px solid #3b82f6'
      };
    case 'cancelled':
      return {
        background: 'rgba(239, 68, 68, 0.2)',
        color: '#ef4444',
        border: '1px solid #ef4444'
      };
    default:
      return {
        background: 'rgba(107, 114, 128, 0.2)',
        color: '#6b7280',
        border: '1px solid #6b7280'
      };
  }
};

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userObj) => setUser(userObj);
  const handleLogout = () => setUser(null);

  if (!user) return <Login onLogin={handleLogin} />;
  if (user.role === 'consumer') return <ConsumerView user={user} onLogout={handleLogout} />;
  return <AdminView user={user} onLogout={handleLogout} />;
}

// --- HELPER FUNCTIONS ---

const getSlotStyle = (status) => {
    switch (status) {
      case 'free': return { backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' };
      case 'occupied': return { backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24' };
      case 'booked': return { backgroundColor: '#fff3cd', borderColor: '#ffeeba', color: '#856404' };
      case 'maintenance': return { backgroundColor: '#e2e3e5', borderColor: '#d6d8db', color: '#383d41', cursor: 'not-allowed' };
      default: return {};
    }
};

const getSlotStyleEnhanced = (status) => {
    const baseStyle = {
      background: '#fff',
      borderLeft: '4px solid'
    };
    switch (status) {
      case 'free': return { ...baseStyle, borderLeftColor: '#28a745', boxShadow: '0 2px 8px rgba(40,167,69,0.2)' };
      case 'occupied': return { ...baseStyle, borderLeftColor: '#dc3545', boxShadow: '0 2px 8px rgba(220,53,69,0.2)' };
      case 'booked': return { ...baseStyle, borderLeftColor: '#ffc107', boxShadow: '0 2px 8px rgba(255,193,7,0.2)' };
      case 'maintenance': return { ...baseStyle, borderLeftColor: '#6c757d', boxShadow: '0 2px 8px rgba(108,117,125,0.2)', opacity: 0.6 };
      default: return baseStyle;
    }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'free': return <span style={{color: '#22c55e', fontWeight: 'bold'}}>●</span>;
    case 'occupied': return <span style={{color: '#ef4444', fontWeight: 'bold'}}>●</span>;
    case 'booked': return <span style={{color: '#f59e0b', fontWeight: 'bold'}}>●</span>;
    case 'maintenance': return <span style={{color: '#6b7280', fontWeight: 'bold'}}>●</span>;
    default: return <span style={{color: '#9ca3af', fontWeight: 'bold'}}>●</span>;
  }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'active': return '#ffc107';
        case 'entered': return '#007bff';
        case 'completed': return '#28a745';
        case 'cancelled': return '#dc3545';
        default: return '#6c757d';
    }
};

// --- DARK THEME STYLES FOR ADMIN (Responsive) ---
const darkStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)',
    padding: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#e5e5e5',
    overflowX: 'hidden'
  },
  header: {
    background: '#1a1a1a',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    borderBottom: '1px solid #2d2d2d',
    flexWrap: 'wrap',
    minHeight: '60px'
  },
  logoContainer: {
    width: '46px',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoIcon: {
    fontSize: '24px',
    color: '#ffffff'
  },
  headerTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#fff',
    letterSpacing: '-0.5px'
  },
  headerSubtitle: {
    margin: '2px 0 0',
    fontSize: '12px',
    color: '#888',
    fontWeight: '400'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  settingsBtn: {
    width: '38px',
    height: '38px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    color: '#ffffff',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)'
    }
  },
  profileBtn: {
    width: '38px',
    height: '38px',
    background: 'rgba(59, 130, 246, 0.15)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    color: '#3b82f6',
    '&:hover': {
      background: 'rgba(59, 130, 246, 0.25)'
    }
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 12px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  profileAvatar: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff'
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  profileName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    lineHeight: '1'
  },
  profileRole: {
    fontSize: '11px',
    color: '#888',
    lineHeight: '1'
  },
  userName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff'
  },
  userRole: {
    fontSize: '12px',
    color: '#a0a0a0'
  },
  logoutBtn: {
    padding: '8px 16px',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    padding: '30px 40px',
    marginTop: '20px'
  },
  statCard: {
    background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
    borderRadius: '16px',
    padding: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    border: '1px solid #333'
  },
  statIcon: {
    fontSize: '42px'
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 1
  },
  statLabel: {
    fontSize: '13px',
    color: '#a0a0a0',
    marginTop: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  emergencyPanel: {
    margin: '0 40px 30px',
    padding: '25px',
    background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
    borderRadius: '16px',
    border: '2px solid #dc2626',
    boxShadow: '0 0 40px rgba(220, 38, 38, 0.3)'
  },
  emergencyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  emergencyBadge: {
    padding: '6px 14px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  emergencyButtons: {
    display: 'flex',
    gap: '15px'
  },
  emergencyBtnEntrance: {
    flex: 1,
    padding: '20px',
    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    color: '#fff',
    border: '2px solid #f87171',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)'
  },
  emergencyBtnExit: {
    flex: 1,
    padding: '20px',
    background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
    color: '#fff',
    border: '2px solid #fb923c',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 16px rgba(234, 88, 12, 0.4)'
  },
  analyticsContainer: {
    display: 'flex',
    gap: '20px',
    padding: '0 40px 30px'
  },
  chartCard: {
    flex: 1,
    background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    border: '1px solid #333'
  },
  chartTitle: {
    margin: '0 0 20px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff'
  },
  section: {
    padding: '0 40px 30px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '20px'
  },
  slotCard: {
    background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    border: '1px solid #333'
  },
  slotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '15px'
  },
  slot: {
    padding: '20px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    position: 'relative',
    overflow: 'hidden'
  },
  slotHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  slotId: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#fff'
  },
  slotBadge: {
    fontSize: '28px'
  },
  slotStatus: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  tableContainer: {
    background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    border: '1px solid #333'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeaderRow: {
    background: 'linear-gradient(135deg, #2d2d2d 0%, #333 100%)',
    borderBottom: '2px solid #444'
  },
  tableHeader: {
    padding: '18px 20px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#a0a0a0',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  tableRow: {
    transition: 'background 0.2s',
    borderBottom: '1px solid #2d2d2d'
  },
  tableCell: {
    padding: '16px 20px',
    fontSize: '14px',
    color: '#e5e5e5'
  },
  idBadge: {
    padding: '4px 10px',
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#818cf8',
    borderRadius: '6px',
    fontSize: '12px',
    fontFamily: 'monospace',
    fontWeight: 'bold'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  noData: {
    textAlign: 'center',
    padding: '60px',
    color: '#777',
    fontSize: '14px'
  },
  themeToggle: {
    width: '38px',
    height: '38px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

// --- LIGHT THEME STYLES FOR ADMIN (Responsive) ---
const lightStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f5f7fa 0%, #e8ecf1 100%)',
    padding: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#2c3e50',
    overflowX: 'hidden'
  },
  header: {
    background: '#ffffff',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    borderBottom: '1px solid #e5e7eb',
    flexWrap: 'wrap',
    minHeight: '60px'
  },
  logoContainer: {
    width: '46px',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoIcon: {
    fontSize: '24px',
    color: '#ffffff'
  },
  headerTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    letterSpacing: '-0.5px'
  },
  headerSubtitle: {
    margin: '2px 0 0',
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '400'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  settingsBtn: {
    width: '38px',
    height: '38px',
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    '&:hover': {
      background: '#e5e7eb'
    }
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 12px',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  profileAvatar: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff'
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  profileName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: '1'
  },
  profileRole: {
    fontSize: '11px',
    color: '#6b7280',
    lineHeight: '1'
  },
  userName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1f2937'
  },
  userRole: {
    fontSize: '12px',
    color: '#6b7280'
  },
  logoutBtn: {
    padding: '8px 16px',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  themeToggle: {
    width: '38px',
    height: '38px',
    background: '#f3f4f6',
    color: '#1f2937',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileBtn: {
    width: '38px',
    height: '38px',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    color: '#3b82f6',
    '&:hover': {
      background: 'rgba(59, 130, 246, 0.2)'
    }
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    padding: '30px 40px',
    marginTop: '20px'
  },
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb'
  },
  statIcon: {
    fontSize: '42px'
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#2c3e50',
    lineHeight: 1
  },
  statLabel: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  emergencyPanel: {
    margin: '0 40px 30px',
    padding: '25px',
    background: 'linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)',
    borderRadius: '16px',
    border: '2px solid #fca5a5',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.15)'
  },
  emergencyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  emergencyBadge: {
    padding: '6px 14px',
    background: '#fee2e2',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#dc2626',
    border: '1px solid #fca5a5'
  },
  emergencyButtons: {
    display: 'flex',
    gap: '15px'
  },
  emergencyBtnEntrance: {
    flex: 1,
    padding: '20px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
    border: '2px solid #f87171',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
  },
  emergencyBtnExit: {
    flex: 1,
    padding: '20px',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#fff',
    border: '2px solid #fbbf24',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
  },
  analyticsContainer: {
    display: 'flex',
    gap: '20px',
    padding: '0 40px 30px'
  },
  chartCard: {
    flex: 1,
    background: 'white',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb'
  },
  chartTitle: {
    margin: '0 0 20px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  section: {
    padding: '0 40px 30px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '20px'
  },
  slotCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    border: '1px solid #e5e7eb'
  },
  slotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '15px'
  },
  slot: {
    padding: '20px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    position: 'relative',
    overflow: 'hidden'
  },
  slotHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  slotId: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  slotBadge: {
    fontSize: '28px'
  },
  slotStatus: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  tableContainer: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeaderRow: {
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    borderBottom: '2px solid #e5e7eb'
  },
  tableHeader: {
    padding: '18px 20px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  tableRow: {
    transition: 'background 0.2s',
    borderBottom: '1px solid #f3f4f6'
  },
  tableCell: {
    padding: '16px 20px',
    fontSize: '14px',
    color: '#2c3e50'
  },
  idBadge: {
    padding: '4px 10px',
    background: 'rgba(99, 102, 241, 0.1)',
    color: '#6366f1',
    borderRadius: '6px',
    fontSize: '12px',
    fontFamily: 'monospace',
    fontWeight: 'bold'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  noData: {
    textAlign: 'center',
    padding: '60px',
    color: '#9ca3af',
    fontSize: '14px'
  }
};

// --- ENHANCED STYLES ---

const styles = {
  // Login Page
  loginContainer: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  loginBoxEnhanced: {
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    width: '420px',
    overflow: 'hidden',
    animation: 'slideIn 0.3s ease-out'
  },
  loginHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '40px 30px',
    textAlign: 'center'
  },
  logoCircle: {
    width: '100px',
    height: '100px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
  },
  loginTitle: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold'
  },
  loginSubtitle: {
    margin: '10px 0 0',
    fontSize: '14px',
    opacity: 0.9
  },
  loginForm: {
    padding: '30px'
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '20px'
  },
  inputIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '18px',
    zIndex: 1
  },
  inputEnhanced: {
    width: '100%',
    padding: '12px 15px 12px 45px',
    border: '2px solid #e1e8ed',
    borderRadius: '10px',
    fontSize: '15px',
    transition: 'all 0.3s',
    boxSizing: 'border-box',
    outline: 'none'
  },
  loginButton: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
  },
  demoAccountsToggle: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#667eea',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  demoAccounts: {
    marginTop: '15px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '10px',
    fontSize: '13px'
  },
  demoAccount: {
    padding: '10px',
    marginBottom: '8px',
    background: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #e1e8ed'
  },
  loginFooter: {
    background: '#f8f9fa',
    padding: '20px 30px',
    display: 'flex',
    justifyContent: 'space-around',
    fontSize: '12px',
    color: '#6c757d'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },

  // Dashboard
  dashboardContainer: {
    minHeight: '100vh',
    background: '#f5f7fa',
    padding: '0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  headerEnhanced: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '30px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  headerLeft: {
    flex: 1
  },
  dashboardTitle: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 'bold'
  },
  dashboardSubtitle: {
    margin: '5px 0 0',
    fontSize: '16px',
    opacity: 0.9
  },
  logoutBtn: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
    backdropFilter: 'blur(10px)'
  },

  // Statistics Cards
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    padding: '30px 40px',
    marginTop: '20px'
  },
  statCard: {
    background: '#fff',
    borderRadius: '15px',
    padding: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  statIcon: {
    fontSize: '48px',
    width: '70px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    boxShadow: '0 4px 12px rgba(102,126,234,0.3)'
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2c3e50',
    lineHeight: 1
  },
  statLabel: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginTop: '5px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  // Sections
  section: {
    padding: '0 40px 30px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  // Slot Grid
  slotGridEnhanced: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px'
  },
  slotEnhanced: {
    padding: '20px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    border: '1px solid #e1e8ed'
  },
  slotHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  slotIdEnhanced: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  slotBadge: {
    fontSize: '24px'
  },
  slotStatus: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#7f8c8d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '15px'
  },
  slotAction: {
    marginTop: '10px'
  },
  bookBtn: {
    width: '100%',
    padding: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'transform 0.2s'
  },

  // Active Bookings
  activeBookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  activeBookingCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e1e8ed',
    transition: 'transform 0.3s, box-shadow 0.3s'
  },
  bookingCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f0f0f0'
  },
  bookingSlot: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  statusBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: '1px solid'
  },
  bookingCardBody: {
    marginBottom: '15px'
  },
  bookingTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#5a6c7d'
  },
  timeIcon: {
    fontSize: '16px'
  },
  bookingCardActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  btnDanger: {
    flex: 1,
    padding: '10px',
    background: '#fff',
    color: '#dc3545',
    border: '2px solid #dc3545',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  btnSuccess: {
    flex: 1,
    padding: '10px',
    background: '#28a745',
    color: '#fff',
    border: '2px solid #28a745',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(40,167,69,0.3)'
  },
  parkedIndicator: {
    flex: 1,
    padding: '10px',
    background: '#cce5ff',
    color: '#004085',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '600'
  },

  // Controls
  controls: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px'
  },
  searchInput: {
    flex: 1,
    padding: '12px 15px',
    border: '2px solid #e1e8ed',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  filterSelect: {
    padding: '12px 15px',
    border: '2px solid #e1e8ed',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    background: '#fff',
    cursor: 'pointer',
    minWidth: '150px'
  },

  // Table
  tableContainer: {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  tableEnhanced: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableRow: {
    transition: 'background 0.2s'
  },
  tableCell: {
    padding: '15px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '14px',
    color: '#2c3e50'
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    color: '#7f8c8d',
    fontSize: '14px'
  },
  btnPay: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'transform 0.2s'
  },
  paidIndicator: {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: '13px'
  },

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  emptyHint: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginTop: '10px'
  },

  // Notification System
  notificationContainer: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px'
  },
  notification: {
    padding: '15px 20px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    animation: 'slideInRight 0.3s ease-out',
    border: '1px solid'
  },
  notificationsuccess: {
    background: '#d4edda',
    borderColor: '#c3e6cb',
    color: '#155724'
  },
  notificationerror: {
    background: '#f8d7da',
    borderColor: '#f5c6cb',
    color: '#721c24'
  },
  notificationwarning: {
    background: '#fff3cd',
    borderColor: '#ffeeba',
    color: '#856404'
  },
  notificationContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1
  },
  notificationIcon: {
    fontSize: '20px'
  },
  notificationClose: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    opacity: 0.5,
    transition: 'opacity 0.2s',
    padding: '0 5px'
  },

  // Modal Enhancement
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)'
  },
  modalContentEnhanced: {
    background: '#fff',
    borderRadius: '20px',
    width: '500px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    animation: 'scaleIn 0.3s ease-out'
  },
  modalHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '25px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '20px 20px 0 0'
  },
  modalTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 'bold'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '32px',
    cursor: 'pointer',
    lineHeight: 1,
    padding: 0,
    width: '30px',
    height: '30px'
  },
  modalBody: {
    padding: '30px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  costEstimate: {
    marginTop: '25px',
    padding: '15px',
    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  costLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  costValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#667eea'
  },
  modalActions: {
    padding: '20px 30px',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  },
  btnSecondary: {
    padding: '12px 24px',
    background: '#fff',
    color: '#6c757d',
    border: '2px solid #e1e8ed',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  btnPrimary: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
  },

  // QR Code
  qrContainer: {
    textAlign: 'center',
    padding: '20px'
  },
  qrText: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#7f8c8d'
  },

  // Legacy styles (for backward compatibility)
  loginBox: {padding:20,background:'#fff',boxShadow:'0 2px 8px rgba(0,0,0,0.1)',borderRadius:8,width:320},
  input: {width:'100%',margin:'6px 0', padding: '8px', boxSizing: 'border-box'},
  header: {display:'flex',justifyContent:'space-between',alignItems:'center', marginBottom: '20px'},
  slotGrid: {display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px'},
  slot: {padding:12,border:'1px solid #ddd',borderRadius:8,textAlign:'center', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s'},
  slotId: {fontSize:18,fontWeight:700, marginBottom: '8px'},
  modalContent: {background:'white', padding:'20px 30px', borderRadius:8, width: 400, boxShadow: '0 4px 15px rgba(0,0,0,0.2)'},
  statsContainer: {display: 'flex', gap: '20px', marginBottom: '25px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'},
  statBox: {fontSize: '1.1em'},
  table: {width: '100%', borderCollapse: 'collapse', marginTop: '10px'},
  activeBookingsContainer: { display: 'flex', gap: '15px', flexWrap: 'wrap'},
  activeBooking: { padding: '15px', border: '1px solid #007bff', borderRadius: '8px', background: '#e7f3ff', minWidth: '300px'},
  emergencyControls: { padding: '20px', background: '#fff3cd', borderRadius: '8px', marginBottom: '20px', border: '2px solid #ffc107' },
  emergencyBtn: { background: '#dc3545', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', marginRight: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }
};
