'use client';

import React, { useState } from 'react';
import DealModal from './DealModal';
import BankBadge from './BankBadge';

export interface DealType {
  id: string;
  merchant: string;
  category: string;
  discount: number;
  discountType: string;
  description: string;
  banksJson?: string;
  banks?: string[];
  cardTypesJson?: string;
  tiersJson?: string;
  citiesJson?: string;
  logo: string;
  banner: string;
  validFrom: string;
  validTo: string;
  termsJson?: string;
  featured?: boolean;
  trending?: boolean;
  merchantColor?: string;
  merchantInitial?: string;
}

export default function DealCard({ deal }: { deal: DealType }) {
  const [isOpen, setIsOpen] = useState(false);

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

  const banks = getBanksList();

  return (
    <>
      <div className="deal-card" onClick={() => setIsOpen(true)}>
        <div className="deal-card__hero" style={{ backgroundColor: deal.merchantColor || '#007AFF' }}>
          <div className="deal-card__hero-gradient" />
          {deal.logo && deal.logo.startsWith('http') ? (
            <img
              src={deal.logo}
              alt={deal.merchant}
              className="deal-card__merchant-icon"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : deal.logo ? (
            <img
              src={deal.logo}
              alt={deal.merchant}
              className="deal-card__merchant-icon"
            />
          ) : (
            <div className="deal-card__merchant-icon">
              {deal.merchantInitial || deal.merchant[0]}
            </div>
          )}

          <div className="deal-card__discount-badge">
            {deal.discountType === 'bogo' ? 'BUY 1 GET 1' : `${deal.discount}% OFF`}
          </div>
        </div>

        <div className="deal-card__body">
          <div className="deal-card__merchant">{deal.merchant}</div>
          <div className="deal-card__description line-clamp-2">{deal.description}</div>

          <div className="deal-card__meta" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
            {banks.slice(0, 3).map((b) => (
              <BankBadge key={b} bankId={b} size="sm" />
            ))}
            {banks.length > 3 && (
              <span className="deal-card__bank-tag" style={{ background: 'rgba(0,122,255,0.1)', color: '#007AFF', fontWeight: 'bold' }}>
                +{banks.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {isOpen && <DealModal deal={deal} onClose={() => setIsOpen(false)} />}
    </>
  );
}
