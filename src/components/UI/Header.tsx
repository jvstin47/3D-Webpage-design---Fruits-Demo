import React from 'react';
import { ShoppingCart, Leaf, TreePine } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { cart, setIsCartOpen } = useStore();
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.fruit.price * item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 w-full z-10 px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-3 pointer-events-auto cursor-pointer select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-orchard-dark flex items-center justify-center text-white shadow-lg shadow-orchard-dark/20 rotate-[-3deg]">
            <TreePine size={22} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-orchard-dark leading-none tracking-tight">
              Justin's Orchard
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Leaf size={10} className="text-orchard-default" />
              <p className="text-[10px] font-semibold text-orchard-default uppercase tracking-[0.15em]">
                Premium Organic
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cart button */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          onClick={() => setIsCartOpen(true)}
          className="glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-3 hover:bg-white/90 transition-all duration-300 shadow-medium group pointer-events-auto"
        >
          <div className="relative">
            <ShoppingCart className="text-orchard-dark group-hover:scale-110 transition-transform duration-200" size={18} />
            {cartItemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2.5 bg-orchard-accent text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1"
              >
                {cartItemCount}
              </motion.span>
            )}
          </div>
          {cartItemCount > 0 ? (
            <span className="font-semibold text-sm text-orchard-dark">${cartTotal.toFixed(2)}</span>
          ) : (
            <span className="font-medium text-sm text-orchard-dark/70">Basket</span>
          )}
        </motion.button>
        
      </div>
    </header>
  );
};
