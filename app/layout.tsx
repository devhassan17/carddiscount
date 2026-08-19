import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';

export const metadata: Metadata = {
  title: 'CardSaver — 30+ Pakistani Bank Card & Wallet Deals',
  description: 'Discover 100+ exclusive deals and discounts on your Pakistani bank debit & credit cards, SadaPay, NayaPay, Easypaisa & JazzCash. HBL, UBL, Meezan, MCB & 25+ banks.',
  keywords: 'Pakistan bank deals, SadaPay discounts, NayaPay deals, Easypaisa offers, JazzCash deals, HBL discounts, UBL card deals, Meezan deals',
  manifest: '/manifest.json',
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="app-container">
          <Header userName="Ali Hassan" unreadCount={2} />
          <main className="page-content">{children}</main>
          <TabBar />
        </div>
      </body>
    </html>
  );
}
