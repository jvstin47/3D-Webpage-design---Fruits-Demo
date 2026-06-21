import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreePine, ArrowDown } from 'lucide-react';

export const WelcomeOverlay: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center pointer-events-auto"
          >
            <div className="glass-panel-solid px-12 py-10 rounded-3xl max-w-md mx-auto">
              <motion.div
                animate={{ rotate: [0, -5, 5, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <TreePine size={36} className="text-orchard-dark mx-auto mb-4" strokeWidth={1.5} />
              </motion.div>
              
              <h2 className="text-3xl font-serif font-bold text-orchard-dark mb-2">
                Welcome to the Orchard
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Explore our handpicked organic fruits.
                <br />Click any fruit to discover its story.
              </p>
              
              <button 
                onClick={() => setVisible(false)}
                className="btn-orchard text-sm px-8"
              >
                Start Exploring
              </button>

              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-5"
              >
                <ArrowDown size={16} className="text-gray-300 mx-auto" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
