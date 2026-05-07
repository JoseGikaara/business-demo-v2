// src/components/ui/Button.jsx
import React from 'react'

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style = {},
  ...props
}) => {
  const baseStyle = {
    border: 'none',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    ...style,
  }

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
      color: '#fff',
    },
    secondary: {
      background: 'linear-gradient(135deg, #64748b, #475569)',
      color: '#fff',
    },
    success: {
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      color: '#fff',
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: '#fff',
    },
    outline: {
      background: 'transparent',
      border: '1px solid #334155',
      color: '#e2e8f0',
    },
  }

  const sizes = {
    small: { padding: '8px 16px', fontSize: 12 },
    medium: { padding: '10px 20px' },
    large: { padding: '12px 24px', fontSize: 16 },
  }

  const variantStyle = variants[variant] || variants.primary
  const sizeStyle = sizes[size] || sizes.medium

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variantStyle, ...sizeStyle }}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button