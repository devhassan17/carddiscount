'use client';

import React from 'react';
import Link from 'next/link';
import { DealType } from './DealCard';
import BankBadge from './BankBadge';

interface DealModalProps {
  deal: DealType;
  onClose: () => void;
}

export default function DealModal({ deal, onClose }: DealModalProps) {
  const getBanksList = (): string[] => {
    if (deal.banks && Array.isArray(deal.banks)) return deal.banks;
    if (deal.banksJson) {
      try {
        return JSON.parse(deal.banksJson);
      } catch {
        return [];
      }
    }
    return [];
  };

  const getTermsList = (): string[] => {
    if (deal.termsJson) {
      try {
        return JSON.parse(deal.termsJson);
      } catch {
        return [];
      }
    }
    return ['Present valid bank card at billing', 'Source: Peekaboo Guru Partner Network'];
  };

  const banks = getBanksList();
  const terms = getTermsList();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex-between align-center mb-4">
          <div className="badge" style={{ background: deal.discountType === 'bogo' ? '#AF52DE' : '#FF3B30', color: 'white' }}>
            {deal.discountType === 'bogo' ? '🎉 BUY 1 GET 1 FREE' : `🔥 ${deal.discount}% DISCOUNT`}
          </div>
          <button className="btn btn--ghost btn--sm" onClick={onClose} style={{ fontSize: '18px' }}>
            ✕
          </button>
        </div>

        <div className="text-center mb-4">
          <div className="deal-detail__merchant-icon" style={{ backgroundColor: deal.merchantColor || '#007AFF', width: 68, height: 68 }}>
            {deal.logo && (deal.logo.startsWith('http') || deal.logo.startsWith('/')) ? (
              <img src={deal.logo} alt={deal.merchant} style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
            ) : (
              deal.merchantInitial || deal.merchant[0]
            )}
          </div>
          <h2 style={{ fontSize: '22px', marginTop: '8px' }}>{deal.merchant}</h2>
          <p className="text-sm text-secondary" style={{ marginTop: '4px' }}>Category: {deal.category.toUpperCase()}</p>
        </div>

        <div className="card card--glass p-4 mb-4">
          <div className="font-semibold mb-2 text-primary">{deal.description}</div>
          <div className="text-xs text-secondary">Valid from {deal.validFrom} to {deal.validTo}</div>
        </div>

        <div className="mb-4">
          <div className="text-xs font-semibold text-secondary uppercase mb-2">Eligible Bank Cards</div>
          <div className="flex flex-wrap gap-2">
            {banks.map((b) => (
              <BankBadge key={b} bankId={b} size="md" />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-secondary uppercase mb-2">Terms & Conditions</div>
          <ul className="deal-detail__terms">
            {terms.map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/merchant/${encodeURIComponent(deal.merchant)}`}
            className="btn btn--primary btn--full btn--pill"
            onClick={onClose}
          >
            View Outlet Menu & Reviews ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
