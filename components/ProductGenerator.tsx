import React, { useState } from 'react';
import { Wand2, Upload, Loader2, Image as ImageIcon, Plus } from 'lucide-react';
import { generateProductDetails, analyzeProductImport } from '../services/geminiService';
import { Product } from '../types';

const ProductGenerator: React.FC = () => {
  const [mode, setMode] = useState<'create' | 'import'>('create');
  const [loading, setLoading] = useState(false);
  const [generatedProduct, setGeneratedProduct] = useState<Partial<Product> | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [tone, setTone] = useState('Persuasive');
  const [importText, setImportText] = useState('');

  const handleGenerate = async () => {
    if (!name) return;
    setLoading(true);
    setGeneratedProduct(null);
    try {
      const result = await generateProductDetails(name, category, tone);
      
      setGeneratedProduct({
        name,
        category,
        description: result.description,
        imageUrl: result.imageBase64 ? `data:image/png;base64,${result.imageBase64}` : 'https://picsum.photos/400/400',
        price: 0
      });
    } catch (error) {
      console.error(error);
      alert("Failed to generate content. Check API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSmartImport = async () => {
    if (!importText) return;
    setLoading(true);
    try {
      const analysis = await analyzeProductImport(importText);
      if (analysis.error) throw new Error("Analysis failed");
      
      setName(analysis.suggestedName || '');
      setCategory(analysis.category || 'General');
      // Switch to create mode effectively to verify
      setMode('create');
    } catch (err) {
      alert("Could not analyze text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">AI Product Studio</h1>
        <p className="text-slate-500">Generate stunning product images and descriptions in seconds.</p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-xl flex space-x-1">
          <button
            onClick={() => setMode('create')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'create' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Wand2 className="w-4 h-4 inline mr-2" />
            Generate New
          </button>
          <button
            onClick={() => setMode('import')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'import' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Smart Import
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          {mode === 'create' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Moroccan Argan Oil Shampoo"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>Fashion</option>
                    <option>Electronics</option>
                    <option>Beauty</option>
                    <option>Home & Decor</option>
                    <option>Food</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Brand Tone</label>
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>Persuasive</option>
                    <option>Professional</option>
                    <option>Luxury</option>
                    <option>Friendly</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !name}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3 rounded-xl font-medium flex items-center justify-center transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Wand2 className="w-5 h-5 mr-2" />}
                Generate with AI
              </button>
            </div>
          ) : (
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Paste Raw Product Data</label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste description from AliExpress, a supplier email, or raw text here..."
                  className="w-full h-32 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
              <button
                onClick={handleSmartImport}
                disabled={loading || !importText}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white py-3 rounded-xl font-medium flex items-center justify-center transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
                Analyze & Import
              </button>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Live Preview</h3>
          
          {generatedProduct ? (
            <div className="flex-1 flex flex-col animate-fade-in">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-50 border border-slate-100">
                <img 
                  src={generatedProduct.imageUrl} 
                  alt={generatedProduct.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-slate-700">
                  AI Generated
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 mb-2">{generatedProduct.name}</h2>
              <div className="flex items-center mb-4">
                 <span className="text-emerald-600 font-bold text-lg">199.00 MAD</span>
                 <span className="text-slate-400 text-sm line-through ml-2">299.00 MAD</span>
              </div>
              
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {generatedProduct.description}
              </p>

              <div className="mt-auto pt-4">
                <button className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 flex items-center justify-center gap-2">
                   <Plus className="w-4 h-4"/> Add to Store
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-xl">
              <ImageIcon className="w-12 h-12 mb-2" />
              <p className="text-sm">Product preview will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGenerator;