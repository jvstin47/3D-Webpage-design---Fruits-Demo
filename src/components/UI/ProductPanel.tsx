import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { fruits } from '../../data/fruits';
import { CheckCircle, MapPin, Award, Plus, Minus, X, ShieldCheck, Truck } from 'lucide-react';

export const ProductPanel: React.FC = () => {
  const { selectedFruitId, hoveredFruitId, setSelectedFruitId, setCameraPosition, setCameraTarget, addToCart, setIsCameraTransitioning } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const activeId = selectedFruitId || hoveredFruitId;
  const activeFruit = fruits.find(f => f.id === activeId);

  // Reset quantity when fruit changes
  useEffect(() => {
    setQuantity(1);
  }, [activeId]);

  const handleClose = () => {
    setSelectedFruitId(null);
    setCameraPosition([0, 2, 8]);
    setCameraTarget([0, 1, 0]);
    setIsCameraTransitioning(true);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (activeFruit) {
      addToCart(activeFruit, quantity);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
      setQuantity(1);
    }
  };

  return (
    <AnimatePresence>
      {activeFruit && (
        <motion.div
          key={activeFruit.id}
          initial={{ opacity: 0, x: 60, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.92 }}
          transition={{ type: "spring", damping: 28, stiffness: 220 }}
          className="fixed top-20 right-6 w-[370px] max-h-[calc(100vh-6rem)] bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-y-auto pointer-events-auto z-10"
        >
          {/* Close button - only show if explicitly selected */}
          {selectedFruitId && (
            <button 
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 text-gray-500 hover:text-gray-800 bg-white/60 hover:bg-white rounded-xl p-1.5 transition-colors z-20"
            >
              <X size={16} />
            </button>
          )}

          {/* Color header band */}
          <div 
            className="h-2 rounded-t-[20px]"
            style={{ background: `linear-gradient(90deg, ${activeFruit.color}80, ${activeFruit.color}30)` }}
          />

          <div className="p-7">
            {/* Organic badge */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
              <span className="organic-badge">
                <ShieldCheck size={10} /> Certified Organic
              </span>
            </motion.div>

            {/* Name & Price */}
            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-3"
            >
              <h2 className="text-2xl font-serif font-bold text-orchard-dark leading-tight">
                {activeFruit.name}
              </h2>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-orchard-accent">${activeFruit.price.toFixed(2)}</span>
                <span className="text-xs text-gray-400 font-medium">per lb</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-gray-500 leading-relaxed mt-4 text-[13px]"
            >
              {activeFruit.description}
            </motion.p>

            {/* Info cards */}
            <div className="mt-5 space-y-3">
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} 
                className="flex items-center gap-3 bg-orchard-lightest rounded-xl px-4 py-3"
              >
                <MapPin className="text-orchard-default shrink-0" size={16} />
                <div>
                  <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Origin</span>
                  <p className="text-xs text-gray-700 font-medium leading-tight">{activeFruit.origin}</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} 
                className="flex items-center gap-3 bg-orchard-lightest rounded-xl px-4 py-3"
              >
                <Award className="text-orchard-default shrink-0" size={16} />
                <div>
                  <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Certification</span>
                  <p className="text-xs text-gray-700 font-medium leading-tight">{activeFruit.certification}</p>
                </div>
              </motion.div>
            </div>

            {/* Nutrition */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5">
              <h4 className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Nutrition per serving</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {activeFruit.nutrition.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-600 bg-gray-50 rounded-lg px-2.5 py-1.5">
                    <CheckCircle size={10} className="text-orchard-default shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quantity + Add to cart */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-6 pt-5 border-t border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">Quantity (lbs)</span>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-1 border border-gray-100">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-orchard-dark hover:bg-white rounded-lg transition-all"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-orchard-dark hover:bg-white rounded-lg transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                className={`btn-orchard w-full flex items-center justify-center gap-2 text-sm ${justAdded ? '!bg-green-600' : ''}`}
              >
                {justAdded ? (
                  <><CheckCircle size={16} /> Added to Basket!</>
                ) : (
                  <><Plus size={16} /> Add to Basket — ${(activeFruit.price * quantity).toFixed(2)}</>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-3">
                <Truck size={12} className="text-gray-400" />
                <p className="text-[11px] text-gray-400">
                    {activeFruit.inventory} lbs in stock · Free delivery over $25
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
