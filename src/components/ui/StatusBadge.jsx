// src/components/ui/StatusBadge.jsx
import React from 'react'

const StatusBadge = ({ status, color, textColor, style = {}, ...props }) => {
  const badgeStyle = {
    padding: '4px 10px',
    borderRadius: '12px',
    background: color,
    color: textColor,
    fontSize: '12px',
    fontWeight: '500',
    ...style,
  }

  return <span style={badgeStyle} {...props}>{status}</span>
}

export default StatusBadge