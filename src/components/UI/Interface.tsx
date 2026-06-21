import React from 'react';
import { Header } from './Header';
import { ProductPanel } from './ProductPanel';
import { CartSidebar } from './CartSidebar';
import { FruitCatalog } from './FruitCatalog';
import { WelcomeOverlay } from './WelcomeOverlay';

export const Interface: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 font-sans">
      <Header />
      <ProductPanel />
      <FruitCatalog />
      <CartSidebar />
      <WelcomeOverlay />
    </div>
  );
};
