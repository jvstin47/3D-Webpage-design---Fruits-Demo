import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { fruits } from '../../data/fruits';

export const FruitCatalog: React.FC = () => {
  const { selectedFruitId, setSelectedFruitId, setCameraPosition, setCameraTarget, setIsCameraTransitioning } = useStore();

  const handleSelect = (fruitId: string) => {
    const fruit = fruits.find(f => f.id === fruitId);
    if (!fruit) return;

    if (selectedFruitId === fruitId) {
      setSelectedFruitId(null);
      setCameraPosition([0, 5, 20]);
      setCameraTarget([0, 0, 0]);
    } else {
      setSelectedFruitId(fruitId);
      const [fx, fy, fz] = fruit.position;
      setCameraPosition([fx + 1.5, fy + 1.5, fz + 3.5]);
      setCameraTarget([fx, fy, fz]);
    }
    setIsCameraTransitioning(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="fixed bottom-0 left-0 w-full z-10 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto px-6 pb-5">
        <div className="glass-panel px-4 py-3 pointer-events-auto">
          <div className="catalog-strip">
            {fruits.map((fruit) => {
              const isActive = selectedFruitId === fruit.id;
              return (
                <button
                  key={fruit.id}
                  onClick={() => handleSelect(fruit.id)}
                  className={`
                    flex items-center gap-2.5 shrink-0 px-3.5 py-2 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-orchard-dark text-white shadow-lg shadow-orchard-dark/20' 
                      : 'bg-gray-50/80 hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <div 
                    className={`w-5 h-5 rounded-full shrink-0 transition-shadow duration-200 ${isActive ? 'shadow-md' : ''}`}
                    style={{ 
                      backgroundColor: fruit.color,
                      boxShadow: isActive ? `0 0 8px ${fruit.color}60` : undefined 
                    }}
                  />
                  <span className="text-xs font-semibold whitespace-nowrap">{fruit.name.split(' ').pop()}</span>
                  <span className={`text-[10px] font-bold ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                    ${fruit.price.toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
