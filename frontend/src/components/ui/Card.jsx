import React from 'react';

export default function Card({ className = '', children }) {
  return <div className={`glass rounded-2xl p-5 ${className}`}>{children}</div>;
}

