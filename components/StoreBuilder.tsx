
import React, { useState, useEffect } from 'react';
import { 
  Palette, Layout, Smartphone, Monitor, Check, ShoppingCart, 
  Menu, Search, Eye, X, ChevronLeft, Minus, Plus, 
  MapPin, User, Phone, Share2, Facebook, Instagram, MessageCircle, Star,
  Dumbbell, Gamepad2, Heart, Sparkles, Car, Dog, Zap, Award, Bell,
  Trash2, ArrowRight
} from 'lucide-react';

// --- Types & Data ---

interface Theme {
  id: string;
  niche: string;
  name: string;
  description: string;
  colors: {
    bg: string;
    card: string;
    text: string;
    primary: string; // Buttons, Accents
    primaryText: string;
    inputBg: string;
    inputBorder: string;
    price: string;
  };
  font: string;
  radius: string;
}

const themes: Theme[] = [
  {
    id: 'modern',
    niche: 'General',
    name: 'Casablanca Clean',
    description: 'Minimalist white styling for general stores.',
    colors: {
      bg: 'bg-slate-50',
      card: 'bg-white',
      text: 'text-slate-900',
      primary: 'bg-slate-900',
      primaryText: 'text-white',
      inputBg: 'bg-white',
      inputBorder: 'border-slate-300',
      price: 'text-slate-900'
    },
    font: 'font-sans',
    radius: 'rounded-xl'
  },
  {
    id: 'cosmetic',
    niche: 'Cosmetics',
    name: 'Rose Gold Glow',
    description: 'Elegant soft pinks and serif fonts for beauty.',
    colors: {
      bg: 'bg-[#faf7f5]',
      card: 'bg-white',
      text: 'text-[#4a4a4a]',
      primary: 'bg-[#d4a5a5]',
      primaryText: 'text-white',
      inputBg: 'bg-white',
      inputBorder: 'border-[#ebd4d4]',
      price: 'text-[#d4a5a5]'
    },
    font: 'font-[Playfair_Display]',
    radius: 'rounded-2xl'
  },
  {
    id: 'fitness',
    niche: 'Fitness',
    name: 'Iron Gym Dark',
    description: 'High energy dark mode with neon accents.',
    colors: {
      bg: 'bg-[#1a1a1a]',
      card: 'bg-[#252525]',
      text: 'text-white',
      primary: 'bg-[#ccff00]',
      primaryText: 'text-black',
      inputBg: 'bg-white', // Requested white inputs
      inputBorder: 'border-slate-300',
      price: 'text-[#ccff00]'
    },
    font: 'font-sans',
    radius: 'rounded-sm'
  },
  {
    id: 'gaming',
    niche: 'Gaming',
    name: 'Cyberpunk Neon',
    description: 'Futuristic purple/blue vibes for tech & gaming.',
    colors: {
      bg: 'bg-[#0f0f16]',
      card: 'bg-[#181824]',
      text: 'text-white',
      primary: 'bg-[#7000ff]',
      primaryText: 'text-white',
      inputBg: 'bg-white',
      inputBorder: 'border-[#7000ff]',
      price: 'text-[#00ffe1]'
    },
    font: 'font-mono',
    radius: 'rounded-none'
  },
  {
    id: 'health',
    niche: 'Health',
    name: 'MediCare Pure',
    description: 'Trustworthy blues and greens for health products.',
    colors: {
      bg: 'bg-[#f0f9ff]',
      card: 'bg-white',
      text: 'text-[#0f172a]',
      primary: 'bg-[#0ea5e9]',
      primaryText: 'text-white',
      inputBg: 'bg-white',
      inputBorder: 'border-[#bae6fd]',
      price: 'text-[#0284c7]'
    },
    font: 'font-sans',
    radius: 'rounded-lg'
  },
  {
    id: 'car',
    niche: 'Automotive',
    name: 'Turbo Carbon',
    description: 'Sleek grays and reds for car accessories.',
    colors: {
      bg: 'bg-[#e5e5e5]',
      card: 'bg-white',
      text: 'text-slate-900',
      primary: 'bg-[#ef4444]',
      primaryText: 'text-white',
      inputBg: 'bg-white',
      inputBorder: 'border-slate-300',
      price: 'text-[#ef4444]'
    },
    font: 'font-sans italic',
    radius: 'rounded-md'
  },
  {
    id: 'animals',
    niche: 'Pets',
    name: 'Happy Paws',
    description: 'Warm yellows and browns for pet stores.',
    colors: {
      bg: 'bg-[#fffbeb]',
      card: 'bg-white',
      text: 'text-[#78350f]',
      primary: 'bg-[#f59e0b]',
      primaryText: 'text-white',
      inputBg: 'bg-white',
      inputBorder: 'border-[#fde68a]',
      price: 'text-[#d97706]'
    },
    font: 'font-sans',
    radius: 'rounded-[2rem]'
  }
];

// Mock Reviews Generator
const generateReviews = (niche: string) => {
  const commonNames = ["Ahmed B.", "Fatima Z.", "Karim M.", "Sara L.", "Omar K.", "Yasmine R.", "Mehdi T.", "Khadija S."];
  const genericReviews = [
      "Excellent quality, delivered fast to Casa.",
      "Exactement comme sur la photo. Merci!",
      "Good product for the price. Recommended.",
      "Service client top, j'ai reçu ma commande en 24h.",
      "J'adore! Je vais commander encore.",
      "Produit magnifique, merci pour le cadeau.",
      "Top quality, very satisfied."
  ];

  const nicheReviews: Record<string, string[]> = {
    'Fitness': ["Solid grip, great for workouts.", "The material is sweat resistant. Love it.", "Best gym gear I've bought in Morocco.", "Perfect fit."],
    'Cosmetics': ["Texture incroyable, ça sent très bon.", "Ma peau est plus douce après une semaine.", "Le packaging est magnifique.", "Couleur parfaite."],
    'Gaming': ["RGB lights are insane!", "Improved my aim significantly.", "Very responsive click feel.", "Works great with PS5."],
    'Automotive': ["Fits my car perfectly.", "Very shiny finish, easy to apply.", "Makes the interior look brand new.", "High quality material."],
    'Pets': ["My cat loves it!", "Durable toy, my dog can't destroy it.", "Super cute design.", "Easy to clean."]
  };

  const specific = nicheReviews[niche] || [];
  const pool = [...specific, ...genericReviews];

  return Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    name: commonNames[i % commonNames.length],
    text: pool[i % pool.length],
    stars: 5,
    date: `${Math.floor(Math.random() * 5) + 1} days ago`
  }));
};

const products = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  name: i === 0 ? "Premium Ultra Product X" : `Trending Item ${i + 1}`,
  price: 199 + (i * 20),
  image: `https://picsum.photos/seed/${i + 400}/800/800`,
  thumbnails: [
    `https://picsum.photos/seed/${i + 400}/800/800`,
    `https://picsum.photos/seed/${i + 401}/800/800`,
    `https://picsum.photos/seed/${i + 402}/800/800`,
    `https://picsum.photos/seed/${i + 403}/800/800`,
    `https://picsum.photos/seed/${i + 404}/800/800`,
  ]
}));

// Fomo Data
const fomoSales = [
  { name: 'Salma', city: 'Casablanca', time: '1 min ago' },
  { name: 'Omar', city: 'Rabat', time: 'Just now' },
  { name: 'Fatima', city: 'Marrakech', time: '2 mins ago' },
  { name: 'Youssef', city: 'Tanger', time: '5 mins ago' },
  { name: 'Hajar', city: 'Agadir', time: 'Just now' },
];

const StoreBuilder: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [storeName, setStoreName] = useState('My Awesome Store');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'product'>('home');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Cart & Search State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cart, setCart] = useState<Array<{product: typeof products[0], qty: number}>>([]);
  
  // FOMO State
  const [fomoVisible, setFomoVisible] = useState(false);
  const [fomoData, setFomoData] = useState(fomoSales[0]);

  // FOMO Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFomoVisible(true);
      setFomoData(fomoSales[Math.floor(Math.random() * fomoSales.length)]);
      
      setTimeout(() => {
        setFomoVisible(false);
      }, 4000); // Show for 4 seconds
    }, 10000); // Trigger every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleProductClick = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setQuantity(1);
    setCurrentView('product');
  };

  const addToCart = () => {
    if (selectedProduct) {
      setCart([...cart, { product: selectedProduct, qty: quantity }]);
      setIsCartOpen(true);
    }
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedProduct(null);
  };

  const isMobileView = device === 'mobile' || isPreviewOpen;

  // --- RENDERERS ---

  const RenderCartDrawer = () => (
    <>
      {isCartOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="w-4/5 max-w-sm ml-auto bg-white h-full relative z-10 shadow-2xl flex flex-col animate-slide-in-right">
             <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                   <ShoppingCart className="w-5 h-5" /> Your Cart
                </h3>
                <button onClick={() => setIsCartOpen(false)}><X className="w-6 h-6 text-slate-500" /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                     <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
                     <p>Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item, i) => (
                    <div key={i} className="flex gap-3 border-b border-slate-100 pb-3">
                       <img src={item.product.image} className="w-16 h-16 rounded-md object-cover" alt="" />
                       <div className="flex-1">
                          <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.product.name}</h4>
                          <p className="text-xs text-slate-500">{item.qty} x {item.product.price} DH</p>
                          <p className="font-bold text-emerald-600 text-sm mt-1">{item.qty * item.product.price} DH</p>
                       </div>
                       <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  ))
                )}
             </div>
             <div className="p-4 border-t bg-slate-50">
                <div className="flex justify-between font-bold text-lg mb-4 text-slate-800">
                   <span>Total</span>
                   <span>{cart.reduce((acc, item) => acc + (item.product.price * item.qty), 0)} DH</span>
                </div>
                <button className={`w-full ${selectedTheme.colors.primary} ${selectedTheme.colors.primaryText} py-3 rounded-lg font-bold`}>
                   Checkout Now
                </button>
             </div>
          </div>
        </div>
      )}
    </>
  );

  const RenderSearchOverlay = () => (
    <>
      {isSearchOpen && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md p-6 animate-fade-in flex flex-col">
           <div className="flex justify-end mb-4">
              <button onClick={() => setIsSearchOpen(false)} className="p-2 bg-slate-100 rounded-full">
                 <X className="w-6 h-6 text-slate-600" />
              </button>
           </div>
           <div className="max-w-md mx-auto w-full mt-10">
              <h3 className={`text-2xl font-bold mb-6 text-center ${selectedTheme.colors.text} ${selectedTheme.font}`}>Search Products</h3>
              <div className="relative">
                 <input 
                    type="text" 
                    placeholder="What are you looking for..." 
                    autoFocus
                    className={`w-full text-xl py-4 border-b-2 border-slate-300 focus:border-indigo-600 outline-none bg-transparent placeholder:text-slate-300 ${selectedTheme.font} ${selectedTheme.colors.text}`}
                 />
                 <Search className="absolute right-0 top-4 text-slate-400 w-6 h-6" />
              </div>
              <div className="mt-8">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Popular</p>
                 <div className="flex flex-wrap gap-2">
                    {['Summer', 'New', 'Best Seller', 'Discount'].map(tag => (
                       <span key={tag} className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600 cursor-pointer hover:bg-slate-200">
                          {tag}
                       </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );

  const RenderHeader = () => (
    <div className={`px-4 py-4 flex items-center justify-between shadow-sm transition-colors border-b border-black/5 ${selectedTheme.colors.card}`}>
      <div className="flex items-center gap-3">
        {currentView === 'product' ? (
          <button onClick={goHome} className={`p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors ${selectedTheme.colors.text}`}>
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <Menu className={`w-6 h-6 ${selectedTheme.colors.text}`} />
        )}
        <span className={`text-xl font-bold ${selectedTheme.colors.text} ${selectedTheme.font}`}>
          {storeName}
        </span>
      </div>
      <div className={`flex gap-4 ${selectedTheme.colors.text}`}>
        <button onClick={() => setIsSearchOpen(true)} className="hover:opacity-70">
           <Search className="w-6 h-6" />
        </button>
        <button onClick={() => setIsCartOpen(true)} className="relative hover:opacity-70">
           <ShoppingCart className="w-6 h-6" />
           {cart.length > 0 && (
             <span className={`absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] rounded-full ${selectedTheme.colors.primary} ${selectedTheme.colors.primaryText}`}>
                {cart.length}
             </span>
           )}
        </button>
      </div>
    </div>
  );

  const RenderFOMO = () => (
    <div 
      className={`absolute bottom-20 md:bottom-24 left-4 z-40 max-w-[250px] md:max-w-xs transition-all duration-500 transform ${fomoVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
    >
      <div className={`${selectedTheme.colors.card} rounded-xl shadow-2xl p-3 flex items-center gap-3 border border-slate-100`}>
        <div className={`w-10 h-10 rounded-full ${selectedTheme.colors.primary} flex items-center justify-center`}>
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className={`text-xs md:text-sm font-bold ${selectedTheme.colors.text} ${selectedTheme.font}`}>
            {fomoData.name} from {fomoData.city}
          </p>
          <p className="text-[10px] md:text-xs text-slate-500 flex items-center gap-1">
            Just bought <span className="font-bold">1 item</span> • {fomoData.time}
          </p>
        </div>
      </div>
    </div>
  );

  const RenderStickyFooter = () => {
    if (!selectedProduct) return null;
    return (
      <div className={`md:hidden bg-white border-t border-slate-200 p-3 z-50 shadow-[0_-5px_25px_rgba(0,0,0,0.15)] flex items-center gap-3 pb-safe`}>
          <div className="flex items-center bg-slate-100 rounded-lg px-1 h-[60px] border border-slate-300 w-1/3">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full flex items-center justify-center text-slate-800 active:bg-slate-200 rounded">
              <Minus className="w-5 h-5 font-bold" />
            </button>
            <span className="w-8 text-center font-black text-slate-900 text-xl">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-full flex items-center justify-center text-slate-800 active:bg-slate-200 rounded">
              <Plus className="w-5 h-5 font-bold" />
            </button>
          </div>
          
          <button 
            onClick={addToCart}
            className={`flex-1 ${selectedTheme.colors.primary} ${selectedTheme.colors.primaryText} h-[60px] ${selectedTheme.radius} font-black text-xl shadow-lg active:scale-95 transition-transform flex items-center justify-between px-4 ${selectedTheme.font}`}
          >
            <span>اضغط هنا للطلب</span>
            <span className="bg-black/20 px-2 py-1 rounded text-sm">{selectedProduct.price * quantity} DH</span>
          </button>
      </div>
    );
  };

  const RenderStoreHome = () => (
    <div className={`animate-fade-in pb-12 ${selectedTheme.colors.bg}`}>
      {/* Hero */}
      <div className={`relative overflow-hidden h-64 md:h-96 group mb-6`}>
        <img 
          src={`https://picsum.photos/seed/${selectedTheme.id}/1200/600`} 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6 text-white`}>
          <span className="text-sm font-bold uppercase tracking-[0.2em] mb-2 opacity-90">{selectedTheme.niche} Deals</span>
          <h2 className={`text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg ${selectedTheme.font}`}>
            Level Up Your Life
          </h2>
          <button className={`px-8 py-3 ${selectedTheme.colors.primary} ${selectedTheme.colors.primaryText} ${selectedTheme.radius} font-medium shadow-xl hover:scale-105 transition-transform text-sm md:text-base`}>
            Shop Now
          </button>
        </div>
      </div>

      {/* Grid: 2 cols Mobile/Preview, 5 cols Desktop */}
      <div className="px-3 md:px-8">
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className={`text-2xl font-bold ${selectedTheme.colors.text} ${selectedTheme.font}`}>
            Best Sellers
          </h3>
          <span className={`text-sm font-medium opacity-70 cursor-pointer underline ${selectedTheme.colors.text}`}>View All</span>
        </div>
        
        {/* Forces 2 columns if in mobile mode OR in preview mode */}
        <div className={`grid gap-3 md:gap-6 ${isMobileView ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-5'}`}>
          {products.map((product) => (
            <div 
              key={product.id} 
              onClick={() => handleProductClick(product)}
              className={`group cursor-pointer flex flex-col ${selectedTheme.colors.card} ${selectedTheme.radius} shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                    alt={product.name}
                  />
                  {product.id === 0 && (
                    <div className={`absolute top-2 left-2 ${selectedTheme.colors.primary} ${selectedTheme.colors.primaryText} text-[10px] font-bold px-2 py-1 ${selectedTheme.radius}`}>
                      HOT
                    </div>
                  )}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h4 className={`font-medium text-sm leading-snug mb-2 line-clamp-2 ${selectedTheme.colors.text} ${selectedTheme.font}`}>{product.name}</h4>
                <div className="mt-auto flex items-center justify-between">
                  <span className={`font-bold text-base ${selectedTheme.colors.price} ${selectedTheme.font}`}>
                    {product.price} DH
                  </span>
                  <div className={`w-8 h-8 ${selectedTheme.radius} flex items-center justify-center ${selectedTheme.colors.primary} ${selectedTheme.colors.primaryText}`}>
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className={`mt-12 border-t border-black/5 py-10 px-6 text-center ${selectedTheme.colors.card}`}>
        <h4 className={`text-xl font-bold mb-2 ${selectedTheme.colors.text} ${selectedTheme.font}`}>{storeName}</h4>
        <div className="flex justify-center gap-6 mb-8 mt-4">
           <Facebook className="w-6 h-6 text-blue-600 cursor-pointer" />
           <Instagram className="w-6 h-6 text-pink-600 cursor-pointer" />
           <MessageCircle className="w-6 h-6 text-emerald-500 cursor-pointer" />
        </div>
        <p className={`text-xs opacity-50 ${selectedTheme.colors.text}`}>© 2024 {storeName}. All rights reserved.</p>
      </div>
    </div>
  );

  const RenderReviews = () => {
    const reviews = generateReviews(selectedTheme.niche);
    return (
      <div className="mt-12 px-4 md:px-0 max-w-2xl mx-auto">
        <h3 className={`text-xl font-bold mb-6 flex items-center justify-center gap-2 ${selectedTheme.colors.text} ${selectedTheme.font}`}>
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Customer Reviews ({reviews.length})
        </h3>
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className={`${selectedTheme.colors.card} p-5 ${selectedTheme.radius} border border-black/5 shadow-sm`}>
               <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full ${selectedTheme.colors.primary} flex items-center justify-center text-sm text-white font-bold`}>
                     {rev.name.charAt(0)}
                   </div>
                   <div>
                      <span className={`text-sm font-bold block ${selectedTheme.colors.text} ${selectedTheme.font}`}>{rev.name}</span>
                      <div className="flex text-yellow-400">
                          {[...Array(5)].map((_,i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                      </div>
                   </div>
                 </div>
                 <span className="text-xs text-slate-400">{rev.date}</span>
               </div>
               <p className={`text-sm opacity-80 italic mb-2 ${selectedTheme.colors.text} ${selectedTheme.font}`}>"{rev.text}"</p>
               <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <Check className="w-3 h-3" /> Verified Purchase
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const RenderProductPage = () => {
    if (!selectedProduct) return null;
    
    return (
      <div className={`animate-fade-in min-h-full ${selectedTheme.colors.bg} ${selectedTheme.font} pb-24`}>
        
        <div className="max-w-4xl mx-auto">
          
          {/* 1. Square Image Container (Framed) */}
          <div className={`${selectedTheme.colors.card} shadow-sm mb-6 pb-6`}>
             <div className="p-4 md:p-8 flex justify-center bg-slate-50/50">
               <div className={`relative w-full max-w-[450px] aspect-square bg-white shadow-xl ${selectedTheme.radius} overflow-hidden border-4 border-white`}>
                  <img 
                      src={selectedProduct.thumbnails[activeImageIndex]} 
                      alt="Main"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Award className="w-3 h-3 text-yellow-400" /> Best Seller
                  </div>
               </div>
             </div>
             
             {/* Thumbnails Strip - Larger Images */}
             <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar justify-center mt-2">
                {selectedProduct.thumbnails.map((thumb, idx) => (
                <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 ${selectedTheme.radius} border-2 overflow-hidden transition-all duration-200 bg-white shadow-sm ${activeImageIndex === idx ? `border-${selectedTheme.colors.primary.replace('bg-', '')} scale-105 ring-2 ring-offset-2 ring-transparent` : 'border-slate-200 opacity-60 hover:opacity-100'}`}
                    style={{ borderColor: activeImageIndex === idx ? 'currentColor' : '' }}
                >
                    <img src={thumb} className="w-full h-full object-cover" alt="Thumbnail" />
                </button>
                ))}
             </div>
          </div>

          {/* 2. Product Title & Price */}
          <div className={`px-6 text-center mb-6`}>
            <h1 className={`text-2xl md:text-4xl font-extrabold leading-tight mb-3 ${selectedTheme.colors.text} ${selectedTheme.font}`}>
              {selectedProduct.name}
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-4">
               <span className={`text-4xl font-black ${selectedTheme.colors.price} ${selectedTheme.font}`}>
                 {selectedProduct.price} MAD
               </span>
               <span className="text-lg text-slate-400 line-through decoration-red-500 decoration-2">
                 {selectedProduct.price + 100}
               </span>
            </div>

            <p className={`text-sm md:text-base leading-relaxed opacity-80 ${selectedTheme.colors.text} ${selectedTheme.font} max-w-xl mx-auto`}>
              Premium quality design tailored for your needs. Authentic materials and verified durability.
              <span className="block mt-2 font-bold text-green-500 flex items-center justify-center gap-1">
                <Check className="w-4 h-4" /> In Stock & Ready to Ship
              </span>
            </p>
          </div>

          {/* 3. BIG FORM Section - IMPROVED LAYOUT */}
          <div className={`mx-4 md:mx-auto md:max-w-2xl bg-white ${selectedTheme.radius} p-6 md:p-8 shadow-2xl border-2 border-slate-100 mb-12 relative overflow-hidden`} dir="rtl">
            
            {/* Decorative Header for Form */}
            <div className={`absolute top-0 left-0 right-0 h-2 ${selectedTheme.colors.primary}`}></div>
            
            <div className="text-center mb-8 bg-slate-50 p-4 rounded-lg border border-slate-100">
                 <h3 className={`text-2xl font-black flex items-center justify-center gap-2 text-slate-900 ${selectedTheme.font}`}>
                    <Zap className="w-6 h-6 text-yellow-500 fill-current" />
                    للطلب املأ الاستمارة
                </h3>
                <p className={`text-slate-500 font-bold text-sm mt-1 ${selectedTheme.font}`}>الدفع عند الاستلام - التوصيل مجاني</p>
            </div>
            
            <div className="mb-8">
              {/* Layout: Stack on mobile, Side-by-side on desktop */}
              <div className={isMobileView ? "space-y-4" : "grid grid-cols-2 gap-4"}>
                 
                 {/* Name Field */}
                 <div className="relative">
                    <label className={`block text-sm font-bold mb-2 text-slate-700 ${selectedTheme.font}`}>الاسم الكامل</label>
                    <div className="relative group">
                        <div className="absolute top-3.5 right-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                            <User className="w-5 h-5" />
                        </div>
                        <input 
                          type="text" 
                          className={`w-full pr-10 pl-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-black focus:ring-0 outline-none transition-all text-slate-900 font-bold text-right placeholder:text-slate-400 placeholder:font-normal ${selectedTheme.font}`} 
                          placeholder="الاسم هنا..." 
                        />
                    </div>
                 </div>

                 {/* Phone Field */}
                 <div className="relative">
                    <label className={`block text-sm font-bold mb-2 text-slate-700 ${selectedTheme.font}`}>رقم الهاتف</label>
                    <div className="relative group">
                        <div className="absolute top-3.5 right-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                            <Phone className="w-5 h-5" />
                        </div>
                        <input 
                          type="tel" 
                          className={`w-full pr-10 pl-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-black focus:ring-0 outline-none transition-all text-slate-900 font-bold text-right placeholder:text-slate-400 placeholder:font-normal ${selectedTheme.font}`} 
                          placeholder="06XXXXXXXX" 
                        />
                    </div>
                 </div>

                 {/* Address Field - Full Width */}
                 <div className={isMobileView ? "" : "col-span-2"}>
                    <label className={`block text-sm font-bold mb-2 text-slate-700 ${selectedTheme.font}`}>العنوان و المدينة</label>
                    <div className="relative group">
                        <div className="absolute top-3.5 right-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <input 
                          type="text" 
                          className={`w-full pr-10 pl-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-black focus:ring-0 outline-none transition-all text-slate-900 font-bold text-right placeholder:text-slate-400 placeholder:font-normal ${selectedTheme.font}`} 
                          placeholder="المدينة / العنوان..." 
                        />
                    </div>
                 </div>
              </div>
            </div>

            {/* Action Bar Inside Form */}
            <div className={`flex flex-col gap-4 mt-6`} dir="ltr">
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className={`font-bold text-slate-800 text-lg ${selectedTheme.font}`}>الكمية</span>
                  <div className="flex items-center bg-white border-2 border-slate-300 rounded-lg h-12 shadow-sm">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full hover:bg-slate-50 text-slate-900 rounded-l-lg flex items-center justify-center"><Minus className="w-5 h-5" /></button>
                    <span className="w-12 text-center font-black text-xl text-slate-900">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full hover:bg-slate-50 text-slate-900 rounded-r-lg flex items-center justify-center"><Plus className="w-5 h-5" /></button>
                  </div>
               </div>
               
               <button 
                 onClick={addToCart}
                 className={`w-full ${selectedTheme.colors.primary} ${selectedTheme.colors.primaryText} py-4 ${selectedTheme.radius} font-black text-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-4 ${selectedTheme.font}`}
                >
                 <span>اضغط هنا للطلب</span>
                 <span className="bg-white/20 px-3 py-1 rounded text-lg">{selectedProduct.price * quantity} MAD</span>
               </button>
            </div>
          </div>
          
          {/* AI Generated Reviews */}
          <RenderReviews />

          {/* Share Section */}
          <div className="flex flex-col items-center justify-center gap-4 mb-10 mt-12">
            <span className={`text-xs font-bold opacity-50 uppercase tracking-widest ${selectedTheme.colors.text}`}>Share with friends</span>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Facebook className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6" />
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={`h-full flex flex-col ${selectedTheme.colors.bg} relative overflow-hidden`}>
        {/* Header - Fixed at top */}
        <div className="flex-none z-20">
           <RenderHeader />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative">
           {currentView === 'home' ? <RenderStoreHome /> : <RenderProductPage />}
        </div>
        
        {/* Absolute Overlays */}
        <RenderFOMO />
        <RenderSearchOverlay />
        <RenderCartDrawer />

        {/* Sticky Mobile Footer - Anchored to bottom of simulated screen */}
        {currentView === 'product' && isMobileView && (
           <div className="flex-none z-30">
              <RenderStickyFooter />
           </div>
        )}
      </div>
    );
  };

  if (isPreviewOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col animate-fade-in">
        <div className="bg-slate-800 p-4 flex justify-between items-center shadow-md">
           <div className="flex items-center text-white gap-2">
              <Eye className="w-5 h-5 text-emerald-400" />
              <span className="font-bold">Live Preview Mode</span>
           </div>
           <button 
             onClick={() => setIsPreviewOpen(false)}
             className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
           >
             <X className="w-4 h-4" /> Close Preview
           </button>
        </div>
        <div className="flex-1 overflow-hidden flex justify-center bg-slate-900 p-0 md:p-8">
           <div className="w-full h-full md:max-w-[450px] lg:max-w-[500px] bg-white md:rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative">
              {renderContent()}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] animate-fade-in gap-6">
      
      {/* Editor Panel */}
      <div className="w-full lg:w-80 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-600" />
            Store Editor
          </h2>
          <p className="text-xs text-slate-500 mt-1">Customize for your specific niche.</p>
        </div>
        
        <div className="p-5 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
          
          {/* Store Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Store Name</label>
            <input 
              type="text" 
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Select Niche Theme
            </label>
            <div className="space-y-3">
              {themes.map(theme => (
                <div 
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${selectedTheme.id === theme.id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        {theme.id === 'fitness' && <Dumbbell className="w-3 h-3" />}
                        {theme.id === 'cosmetic' && <Sparkles className="w-3 h-3" />}
                        {theme.id === 'gaming' && <Gamepad2 className="w-3 h-3" />}
                        {theme.id === 'health' && <Heart className="w-3 h-3" />}
                        {theme.id === 'car' && <Car className="w-3 h-3" />}
                        {theme.id === 'animals' && <Dog className="w-3 h-3" />}
                        {theme.name}
                    </span>
                    {selectedTheme.id === theme.id && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-xs text-slate-500 leading-tight">{theme.description}</p>
                  
                  {/* Color Preview Swatches */}
                  <div className="flex gap-1 mt-2">
                    <div className={`w-4 h-4 rounded-full border border-slate-100 ${theme.colors.bg}`}></div>
                    <div className={`w-4 h-4 rounded-full border border-slate-100 ${theme.colors.primary}`}></div>
                    <div className={`w-4 h-4 rounded-full border border-slate-100 ${theme.colors.card}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
          >
            <Eye className="w-4 h-4" /> Open Live Preview
          </button>
        </div>
      </div>

      {/* Editor Preview Area */}
      <div className="flex-1 bg-slate-200/50 rounded-2xl border border-slate-200 p-4 md:p-8 flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
        
        {/* Device Toggle */}
        <div className="absolute top-4 right-4 bg-white p-1 rounded-lg shadow-sm border border-slate-200 hidden lg:flex z-10">
          <button 
            onClick={() => setDevice('desktop')}
            className={`p-2 rounded-md transition-colors ${device === 'desktop' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            title="Desktop View"
          >
            <Monitor className="w-5 h-5" />
          </button>
          <div className="w-px bg-slate-200 mx-1 my-1"></div>
          <button 
            onClick={() => setDevice('mobile')}
            className={`p-2 rounded-md transition-colors ${device === 'mobile' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            title="Mobile View"
          >
            <Smartphone className="w-5 h-5" />
          </button>
        </div>

        {/* Device Frame */}
        <div className={`
          bg-white relative transition-all duration-500 mx-auto overflow-hidden shadow-2xl border-slate-900
          ${device === 'mobile' 
            ? 'w-[375px] h-[650px] rounded-[3rem] border-[8px]' 
            : 'w-full h-full max-w-5xl rounded-lg border border-slate-200'}
        `}>
          {device === 'mobile' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>}
          
          <div className="h-full w-full overflow-hidden">
             {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreBuilder;
