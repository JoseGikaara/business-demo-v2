// src/components/ui/Card.jsx
import React from 'react'

const Card = ({ children, title, style = {}, ...props }) => {
  const cardStyle = {
    background: '#1e293b',
    borderRadius: 12,
    padding: '24px',
    marginBottom: 20,
    border: '1px solid #334155',
    ...style,
  }

  const titleStyle = {
    fontSize: 16,
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '1px solid #334155',
  }

  return (
    <div style={cardStyle} {...props}>
      {title && <div style={titleStyle}>{title}</div>}
      {children}
    </div>
  )
}

export default Card