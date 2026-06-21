export interface Fruit {
  id: string;
  name: string;
  description: string;
  nutrition: string[];
  origin: string;
  certification: string;
  price: number;
  inventory: number;
  modelPath: string;
  position: [number, number, number];
  color: string;
}

export const fruits: Fruit[] = [
  {
    id: 'apple',
    name: 'Apple',
    description: 'Exceptionally crisp and juicy, offering a perfect balance of sweet and tart flavors. Hand-picked at peak ripeness.',
    nutrition: ['95 Calories', '25g Carbs', '4g Fiber', '14% DV Vitamin C'],
    origin: 'Washington State Orchard Valley',
    certification: 'USDA Certified Organic',
    price: 1.50,
    inventory: 142,
    modelPath: '/models/apple.glb',
    position: [-4.2, 1.0, 1.2],
    color: '#e74c3c'
  },
  {
    id: 'orange',
    name: 'Orange',
    description: 'Bright, sweet, and incredibly juicy. The gold standard for fresh juice, bursting with sunny flavor.',
    nutrition: ['62 Calories', '15g Carbs', '3g Fiber', '116% DV Vitamin C'],
    origin: 'Sunny Citrus Groves, California',
    certification: 'Certified Organic',
    price: 1.25,
    inventory: 85,
    modelPath: '/models/orange.glb',
    position: [-2.2, 1.0, 0.4],
    color: '#f39c12'
  },
  {
    id: 'lemon',
    name: 'Lemon',
    description: 'A sweeter, more fragrant variety of lemon. Perfect for culinary masterpieces and refreshing beverages.',
    nutrition: ['17 Calories', '5g Carbs', '2g Fiber', '51% DV Vitamin C'],
    origin: 'Coastal Valley Farms, California',
    certification: 'USDA Certified Organic',
    price: 0.90,
    inventory: 210,
    modelPath: '/models/lemon.glb',
    position: [-0.5, 1.0, 1.5],
    color: '#f1c40f'
  },
  {
    id: 'mango',
    name: 'Mango',
    description: 'Known as the King of Mangos. Rich, creamy, tender texture with a sweet, luxurious flavor profile.',
    nutrition: ['202 Calories', '50g Carbs', '5g Fiber', '122% DV Vitamin C'],
    origin: 'Tropical Heritage Orchards, India',
    certification: 'Fair Trade Organic',
    price: 3.50,
    inventory: 45,
    modelPath: '/models/mango.glb',
    position: [1.2, 1.0, 0.6],
    color: '#e67e22'
  },
  {
    id: 'banana',
    name: 'Banana',
    description: 'Naturally sweet and perfectly ripe. A quintessential energy source packed with essential potassium.',
    nutrition: ['105 Calories', '27g Carbs', '3g Fiber', '10% DV Potassium'],
    origin: 'Equatorial Cloud Forests, Ecuador',
    certification: 'Rainforest Alliance Certified',
    price: 0.50,
    inventory: 350,
    modelPath: '/models/banana.glb',
    position: [2.8, 1.6, 0.2], // Higher for hanging
    color: '#f1c40f'
  },
  {
    id: 'grapes',
    name: 'Grapes',
    description: 'Plump, highly aromatic, and bursting with robust flavor. Perfect for snacking or artisanal creations.',
    nutrition: ['62 Calories', '16g Carbs', '1g Fiber', '6% DV Vitamin C'],
    origin: 'Vineyard Estates, New York',
    certification: 'Certified Organic',
    price: 5.50,
    inventory: 110,
    modelPath: '/models/grapes.glb',
    position: [4.4, 1.0, 1.0],
    color: '#8e44ad'
  }
];
