import React from 'react';

interface BankBadgeProps {
  bankId: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BankBadge({ bankId, size = 'sm' }: BankBadgeProps) {
  const b = bankId.toLowerCase();

  const getStyle = () => {
    switch (b) {
      case 'hbl':
        return { bg: '#00833D', text: '#FFFFFF', name: 'HBL', border: 'none' };
      case 'ubl':
        return { bg: '#E31837', text: '#FFFFFF', name: 'UBL', border: 'none' };
      case 'meezan':
        return { bg: '#00594C', text: '#FFD700', name: '☪ Meezan', border: 'none' };
      case 'mcb':
        return { bg: '#005936', text: '#FFFFFF', name: 'MCB', border: 'none' };
      case 'alfalah':
        return { bg: '#ED1C24', text: '#FFFFFF', name: '▲ Alfalah', border: 'none' };
      case 'sadapay':
        return { bg: '#1ED760', text: '#000000', name: 'SadaPay', border: 'none' };
      case 'nayapay':
        return { bg: '#6C63FF', text: '#FFFFFF', name: 'NayaPay', border: 'none' };
      case 'faysal':
        return { bg: '#1E3A5F', text: '#FFFFFF', name: 'faysalbank', border: '1px solid #1E3A5F' };
      case 'allied':
      case 'abl':
        return { bg: '#00447C', text: '#FF6B00', name: 'ABL Allied', border: 'none' };
      case 'askari':
        return { bg: '#FFFFFF', text: '#003976', name: 'askaribank 💠', border: '1.5px solid #003976' };
      case 'bah':
      case 'alhabib':
        return { bg: '#004225', text: '#FFD700', name: '🦁 AL HABIB', border: 'none' };
      case 'bop':
        return { bg: '#FFFFFF', text: '#1D4289', name: 'BOP', border: '1.5px solid #1D4289' };
      case 'bankislami':
        return { bg: '#FFFFFF', text: '#2E7D32', name: 'BankIslami', border: '1.5px solid #2E7D32' };
      case 'sc':
        return { bg: '#0072AA', text: '#FFFFFF', name: 'Standard Chartered', border: 'none' };
      case 'easypaisa':
        return { bg: '#4CAF50', text: '#FFFFFF', name: 'easypaisa', border: 'none' };
      case 'jazzcash':
        return { bg: '#E53935', text: '#FFFFFF', name: 'JazzCash', border: 'none' };
      case 'habibmetro':
        return { bg: '#004D40', text: '#FFD700', name: 'HabibMetro', border: 'none' };
      case 'albaraka':
        return { bg: '#FFFFFF', text: '#C59B27', name: 'albaraka ⚜️', border: '1.5px solid #C59B27' };
      default:
        return { bg: '#007AFF', text: '#FFFFFF', name: bankId.toUpperCase(), border: 'none' };
    }
  };

  const styleConfig = getStyle();
  const fontSize = size === 'sm' ? '10px' : size === 'md' ? '12px' : '14px';
  const padding = size === 'sm' ? '3px 8px' : size === 'md' ? '4px 10px' : '6px 14px';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: styleConfig.bg,
        color: styleConfig.text,
        border: styleConfig.border,
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize,
        padding,
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        letterSpacing: '0.3px',
      }}
    >
      {styleConfig.name}
    </div>
  );
}
