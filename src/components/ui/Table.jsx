// src/components/ui/Table.jsx
import React from 'react'

const Table = ({ children, style = {}, ...props }) => {
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    ...style,
  }

  return <table style={tableStyle} {...props}>{children}</table>
}

const Thead = ({ children, ...props }) => <thead {...props}>{children}</thead>
const Tbody = ({ children, ...props }) => <tbody {...props}>{children}</tbody>
const Tr = ({ children, isHeader = false, style = {}, ...props }) => {
  const trStyle = {
    ...(isHeader ? { background: '#020617' } : { borderTop: '1px solid #1e293b' }),
    ...style,
  }
  return <tr style={trStyle} {...props}>{children}</tr>
}
const Th = ({ children, style = {}, ...props }) => {
  const thStyle = {
    padding: '14px 12px',
    textAlign: 'left',
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    ...style,
  }
  return <th style={thStyle} {...props}>{children}</th>
}
const Td = ({ children, style = {}, ...props }) => {
  const tdStyle = {
    padding: '14px 12px',
    color: '#fff',
    ...style,
  }
  return <td style={tdStyle} {...props}>{children}</td>
}

Table.Thead = Thead
Table.Tbody = Tbody
Table.Tr = Tr
Table.Th = Th
Table.Td = Td

export default Table