import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const CartSidebar: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity } = useStore();

  const subtotal = cart.reduce((sum, item) => sum + (item.fruit.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 pointer-events-auto"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orchard-lightest to-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orchard-dark/10 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="text-orchard-dark" size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-orchard-dark leading-none">Your Basket</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-3">
                  <ShoppingBag size={44} strokeWidth={1} />
                  <p className="text-sm text-gray-400">Your basket is empty</p>
                  <p className="text-xs text-gray-300">Click on a fruit to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.fruit.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        className="flex gap-3.5 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100/80"
                      >
                        {/* Fruit swatch */}
                        <div className="w-14 h-14 bg-white rounded-xl shadow-soft border border-gray-50 flex items-center justify-center shrink-0">
                          <div 
                            className="w-8 h-8 rounded-full shadow-sm" 
                            style={{ 
                              backgroundColor: item.fruit.color,
                              boxShadow: `0 2px 8px ${item.fruit.color}40`
                            }} 
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-sm text-gray-800 truncate pr-2">{item.fruit.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.fruit.id)}
                              className="text-gray-300 hover:text-red-400 transition-colors shrink-0 p-0.5"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">${item.fruit.price.toFixed(2)} / lb</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center bg-white rounded-lg border border-gray-150 overflow-hidden">
                              <button 
                                onClick={() => updateQuantity(item.fruit.id, Math.max(1, item.quantity - 1))}
                                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-orchard-dark hover:bg-gray-50 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-7 text-center text-xs font-bold text-gray-700">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.fruit.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-orchard-dark hover:bg-gray-50 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="font-bold text-sm text-orchard-dark">
                              ${(item.fruit.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-gradient-to-t from-gray-50/50 to-white">
                {subtotal >= 25 && (
                  <div className="flex items-center gap-2 mb-3 bg-green-50 text-green-700 rounded-xl px-3 py-2 text-xs font-medium">
                    <span>🚚</span> You qualify for free delivery!
                  </div>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 text-sm">Subtotal</span>
                  <span className="text-xl font-bold text-orchard-dark font-serif">${subtotal.toFixed(2)}</span>
                </div>
                <button className="btn-orchard w-full text-sm">
                  Proceed to Checkout
                </button>
                <p className="text-center text-[11px] text-gray-300 mt-2.5">🌿 100% Organic · Farm to Table</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
