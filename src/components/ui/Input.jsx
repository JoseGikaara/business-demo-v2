// src/components/ui/Input.jsx
import React from 'react'

const Input = ({ style = {}, ...props }) => {
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1.5px solid #334155',
    background: '#0f172a',
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
    ...style,
  }

  return <input style={inputStyle} {...props} />
}

export default Input