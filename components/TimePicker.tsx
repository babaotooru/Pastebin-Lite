'use client';

import { useState, useEffect } from 'react';

interface TimePickerProps {
  value: string; // seconds as string
  onChange: (seconds: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');

  // Convert seconds to hours, minutes, seconds
  useEffect(() => {
    if (value) {
      const totalSeconds = parseInt(value, 10) || 0;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      setHours(String(h));
      setMinutes(String(m));
      setSeconds(String(s));
    } else {
      setHours('0');
      setMinutes('0');
      setSeconds('0');
    }
  }, [value]);

  // Convert hours, minutes, seconds to total seconds
  const updateTotalSeconds = (h: string, m: string, s: string) => {
    const hNum = parseInt(h, 10) || 0;
    const mNum = parseInt(m, 10) || 0;
    const sNum = parseInt(s, 10) || 0;
    const total = hNum * 3600 + mNum * 60 + sNum;
    onChange(String(total));
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHours(val);
    updateTotalSeconds(val, minutes, seconds);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinutes(val);
    updateTotalSeconds(hours, val, seconds);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSeconds(val);
    updateTotalSeconds(hours, minutes, val);
  };

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: '80px' }}>
        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Hours</label>
        <input
          type="number"
          min="0"
          max="8760"
          value={hours}
          onChange={handleHoursChange}
          style={{
            padding: '0.5rem',
            border: '2px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            background: 'var(--bg-secondary)',
            width: '100%',
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: '80px' }}>
        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Minutes</label>
        <input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={handleMinutesChange}
          style={{
            padding: '0.5rem',
            border: '2px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            background: 'var(--bg-secondary)',
            width: '100%',
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: '80px' }}>
        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Seconds</label>
        <input
          type="number"
          min="0"
          max="59"
          value={seconds}
          onChange={handleSecondsChange}
          style={{
            padding: '0.5rem',
            border: '2px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            background: 'var(--bg-secondary)',
            width: '100%',
          }}
        />
      </div>
    </div>
  );
}

