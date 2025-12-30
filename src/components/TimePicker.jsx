import { useState, useEffect } from 'react';

export function TimePicker({ value, onChange }) {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');

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

  const updateTotalSeconds = (h, m, s) => {
    const hNum = parseInt(h, 10) || 0;
    const mNum = parseInt(m, 10) || 0;
    const sNum = parseInt(s, 10) || 0;
    const total = hNum * 3600 + mNum * 60 + sNum;
    onChange(String(total));
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
          onChange={(e) => {
            const val = e.target.value;
            setHours(val);
            updateTotalSeconds(val, minutes, seconds);
          }}
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
          onChange={(e) => {
            const val = e.target.value;
            setMinutes(val);
            updateTotalSeconds(hours, val, seconds);
          }}
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
          onChange={(e) => {
            const val = e.target.value;
            setSeconds(val);
            updateTotalSeconds(hours, minutes, val);
          }}
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

