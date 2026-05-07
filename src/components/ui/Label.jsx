// src/components/ui/Label.jsx
import React from 'react'

const Label = ({ children, style = {}, ...props }) => {
  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#94a3b8',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    ...style,
  }

  return <label style={labelStyle} {...props}>{children}</label>
}

export default Label