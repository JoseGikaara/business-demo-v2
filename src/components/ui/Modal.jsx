// src/components/ui/Modal.jsx
import React from 'react'

const Modal = ({ isOpen, onClose, children, style = {}, ...props }) => {
  if (!isOpen) return null

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  }

  const modalStyle = {
    background: '#1e293b',
    borderRadius: 12,
    padding: '24px',
    border: '1px solid #334155',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
    ...style,
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()} {...props}>
        {children}
      </div>
    </div>
  )
}

export default Modal