import React, { useState } from 'react';
import { 
  Wand2, Upload, Loader2, Image as ImageIcon, Plus, 
  Megaphone, Search, Facebook, Instagram, Video, Copy, 
  RefreshCw, DollarSign, BarChart3, CheckCircle2, Languages
} from 'lucide-react';
import { generateProductDetails, analyzeProductImport, generateMarketingCopy, generateSEOData } from '../services/geminiService';

interface GeneratedData {
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
}

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

const ProductGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'marketing' | 'seo'>('create');
  const [loading, setLoading] = useState(false);
  
  // Product State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [tone, setTone] = useState('Persuasive');
  const [language, setLanguage] = useState('English');
  const [importText, setImportText] = useState('');
  
  // Results State
  const [generatedProduct, setGeneratedProduct] = useState<GeneratedData | null>(null);
  const [marketingCopy, setMarketingCopy] = useState<Record<string, string>>({});
  const [seoData, setSeoData] = useState<SEOData | null>(null);

  // Profit Calculator State
  const [costPrice, setCostPrice] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<string>('');

  const handleGenerate = async () => {
    if (!name) return;
    setLoading(true);
    try {
      const result = await generateProductDetails(name, category, tone, language);
      
      setGeneratedProduct({
        name,
        category,
        description: result.description,
        imageUrl: result.imageBase64 ? `data:image/png;base64,${result.imageBase64}` : 'https://picsum.photos/400/400',
        price: 0
      });
      // Reset other tools
      setMarketingCopy({});
      setSeoData(null);
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
      setImportText(''); // Clear
      // Switch to main view
      setActiveTab('create');
    } catch (err) {
      alert("Could not analyze text");
    } finally {
      setLoading(false);
    }
  };

  const generateAd = async (platform: 'Facebook' | 'Instagram' | 'TikTok') => {
    if (!generatedProduct) return;
    setLoading(true);
    try {
      const copy = await generateMarketingCopy(generatedProduct.name, platform, language);
      setMarketingCopy(prev => ({ ...prev, [platform]: copy }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSEO = async () => {
    if (!generatedProduct) return;
    setLoading(true);
    try {
      const data = await generateSEOData(generatedProduct.name, generatedProduct.description);
      setSeoData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfit = () => {
    const cost = parseFloat(costPrice) || 0;
    const sell = parseFloat(sellingPrice) || 0;
    const profit = sell - cost;
    const margin = sell > 0 ? ((profit / sell) * 100).toFixed(1) : '0';
    return { profit, margin };
  };

  const { profit, margin } = calculateProfit();

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Wand2 className="w-8 h-8 text-indigo-600" />
            AI Product Studio
          </h1>
          <p className="text-slate-500 mt-2">Generate, Optimize, and Market your products with advanced AI tools.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: TOOLS (8 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tool Navigation */}
          <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex overflow-x-auto no-scrollbar">
            {[
              { id: 'create', label: 'Generator', icon: Wand2 },
              { id: 'marketing', label: 'Marketing Suite', icon: Megaphone },
              { id: 'seo', label: 'SEO Optimizer', icon: Search },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* MAIN WORKSPACE CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
            
            {/* TAB: GENERATOR */}
            {activeTab === 'create' && (
              <div className="p-6 md:p-8 space-y-6 animate-fade-in">
                <div className="flex gap-4 mb-6">
                  <button onClick={() => setImportText('')} className={`pb-2 border-b-2 font-medium text-sm ${!importText ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}>Create New</button>
                  <button onClick={() => setImportText(' ')} className={`pb-2 border-b-2 font-medium text-sm ${importText ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400'}`}>Smart Import</button>
                </div>

                {!importText ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Wireless Noise Cancelling Headphones"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                        <select 
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 outline-none appearance-none"
                        >
                          <option>Fashion</option>
                          <option>Electronics</option>
                          <option>Beauty & Cosmetics</option>
                          <option>Home & Decor</option>
                          <option>Kids & Toys</option>
                          <option>Automotive</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Target Language</label>
                         <div className="relative">
                            <Languages className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                            <select 
                              value={language}
                              onChange={(e) => setLanguage(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 outline-none appearance-none"
                            >
                              <option>English</option>
                              <option>French</option>
                              <option>Arabic</option>
                              <option>Darija</option>
                              <option>Spanish</option>
                            </select>
                         </div>
                      </div>
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Brand Tone</label>
                       <div className="flex gap-2">
                          {['Persuasive', 'Luxury', 'Friendly', 'Professional'].map(t => (
                             <button 
                                key={t}
                                onClick={() => setTone(t)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${tone === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                             >
                                {t}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleGenerate}
                        disabled={loading || !name}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 flex items-center justify-center transition-all transform active:scale-95"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Generating Assets...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-5 h-5 mr-2" /> Generate Product Magic
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                       <Upload className="w-5 h-5 text-emerald-600 mt-1" />
                       <div>
                          <h4 className="font-bold text-emerald-800 text-sm">Smart Importer</h4>
                          <p className="text-xs text-emerald-600">Paste text from AliExpress, Amazon, or supplier emails. AI will extract the structured data.</p>
                       </div>
                    </div>
                    <textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="Paste raw product text here..."
                      className="w-full h-48 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none resize-none"
                    />
                    <button
                      onClick={handleSmartImport}
                      disabled={loading || importText.length < 10}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center transition-all"
                    >
                       {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze & Extract"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: MARKETING */}
            {activeTab === 'marketing' && (
              <div className="p-6 md:p-8 space-y-8 animate-fade-in">
                 {!generatedProduct ? (
                   <div className="text-center py-12 text-slate-400">
                      <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Generate a product first to create marketing assets.</p>
                      <button onClick={() => setActiveTab('create')} className="mt-4 text-indigo-600 font-bold hover:underline">Go to Generator</button>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <h3 className="font-bold text-slate-800 mb-4">Select Platform</h3>
                         <button 
                            onClick={() => generateAd('Facebook')}
                            className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-[#1877F2] hover:bg-blue-50 transition-all group"
                         >
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white"><Facebook className="w-5 h-5" /></div>
                               <span className="font-bold text-slate-700 group-hover:text-[#1877F2]">Facebook Ad</span>
                            </div>
                            <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">Copywriting</span>
                         </button>
                         
                         <button 
                            onClick={() => generateAd('Instagram')}
                            className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-[#E1306C] hover:bg-pink-50 transition-all group"
                         >
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full flex items-center justify-center text-white"><Instagram className="w-5 h-5" /></div>
                               <span className="font-bold text-slate-700 group-hover:text-[#E1306C]">Insta Caption</span>
                            </div>
                            <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">Viral Hook</span>
                         </button>

                         <button 
                            onClick={() => generateAd('TikTok')}
                            className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-black hover:bg-slate-50 transition-all group"
                         >
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white"><Video className="w-5 h-5" /></div>
                               <span className="font-bold text-slate-700 group-hover:text-black">TikTok Script</span>
                            </div>
                            <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">Video Script</span>
                         </button>
                      </div>

                      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 relative min-h-[300px]">
                         <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">AI Output</h4>
                         {loading ? (
                           <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                           </div>
                         ) : Object.keys(marketingCopy).length > 0 ? (
                           <div className="space-y-4">
                              {Object.entries(marketingCopy).map(([plat, text]) => (
                                <div key={plat} className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 animate-fade-in">
                                   <div className="flex justify-between items-center mb-2">
                                      <span className="text-xs font-bold text-indigo-600">{plat}</span>
                                      <button className="text-slate-400 hover:text-indigo-600" onClick={() => navigator.clipboard.writeText(text as string)}><Copy className="w-4 h-4" /></button>
                                   </div>
                                   <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{text}</p>
                                </div>
                              ))}
                           </div>
                         ) : (
                           <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                              <Megaphone className="w-10 h-10 mb-2" />
                              <p className="text-sm">Select a platform to generate copy</p>
                           </div>
                         )}
                      </div>
                   </div>
                 )}
              </div>
            )}

             {/* TAB: SEO */}
             {activeTab === 'seo' && (
              <div className="p-6 md:p-8 space-y-6 animate-fade-in">
                 {!generatedProduct ? (
                    <div className="text-center py-12 text-slate-400">
                       <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                       <p>Generate a product first to optimize SEO.</p>
                       <button onClick={() => setActiveTab('create')} className="mt-4 text-indigo-600 font-bold hover:underline">Go to Generator</button>
                    </div>
                 ) : (
                    <div className="space-y-6">
                       {!seoData ? (
                          <div className="text-center py-8">
                             <p className="text-slate-600 mb-4">Generate optimized meta tags and keywords for search engines.</p>
                             <button 
                                onClick={generateSEO}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto transition-colors"
                             >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                Generate SEO Metadata
                             </button>
                          </div>
                       ) : (
                          <div className="space-y-6">
                             <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                <label className="block text-xs font-bold text-indigo-600 uppercase mb-2">Meta Title</label>
                                <div className="flex items-center gap-2">
                                   <input readOnly value={seoData.metaTitle} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-blue-700" />
                                   <button className="text-slate-400 hover:text-indigo-600"><Copy className="w-4 h-4" /></button>
                                </div>
                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Perfect Length</p>
                             </div>

                             <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                <label className="block text-xs font-bold text-indigo-600 uppercase mb-2">Meta Description</label>
                                <textarea readOnly value={seoData.metaDescription} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 h-24 resize-none" />
                             </div>

                             <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                <label className="block text-xs font-bold text-indigo-600 uppercase mb-2">Focus Keywords</label>
                                <div className="flex flex-wrap gap-2">
                                   {seoData.keywords.split(',').map((k, i) => (
                                      <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                                         {k.trim()}
                                      </span>
                                   ))}
                                </div>
                             </div>
                             
                             <button onClick={generateSEO} className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline">
                                <RefreshCw className="w-3 h-3" /> Regenerate
                             </button>
                          </div>
                       )}
                    </div>
                 )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW & PROFIT (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Preview Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-fit sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
               <span>Result Preview</span>
               {generatedProduct && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Ready to publish</span>}
            </h3>
            
            {generatedProduct ? (
              <div className="flex-1 flex flex-col animate-fade-in group">
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 bg-slate-50 border border-slate-100 shadow-inner">
                  <img 
                    src={generatedProduct.imageUrl} 
                    alt={generatedProduct.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[10px] font-black px-3 py-1.5 rounded-full text-slate-900 shadow-sm border border-white">
                    AI GENERATED
                  </div>
                </div>
                
                <div className="space-y-3">
                   <h2 className="text-2xl font-black text-slate-900 leading-tight">{generatedProduct.name}</h2>
                   
                   <div className="flex flex-wrap gap-2">
                      <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-xs font-bold">{generatedProduct.category}</span>
                      <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-md text-xs font-bold">{tone} Tone</span>
                   </div>

                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed text-justify">
                      {generatedProduct.description}
                   </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                   <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-500" />
                      Profit Calculator
                   </h4>
                   <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                         <label className="text-xs text-slate-500 mb-1 block">Cost (MAD)</label>
                         <input 
                           type="number" 
                           value={costPrice}
                           onChange={(e) => setCostPrice(e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
                           placeholder="0.00"
                         />
                      </div>
                      <div>
                         <label className="text-xs text-slate-500 mb-1 block">Selling (MAD)</label>
                         <input 
                           type="number" 
                           value={sellingPrice}
                           onChange={(e) => setSellingPrice(e.target.value)}
                           className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
                           placeholder="0.00"
                         />
                      </div>
                   </div>
                   
                   <div className="bg-slate-900 rounded-xl p-4 text-white flex justify-between items-center">
                      <div>
                         <p className="text-xs text-slate-400">Net Profit</p>
                         <p className="text-xl font-bold">{profit > 0 ? profit.toFixed(2) : '0.00'} DH</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-slate-400">Margin</p>
                         <p className={`text-xl font-bold ${Number(margin) > 30 ? 'text-emerald-400' : 'text-yellow-400'}`}>{margin}%</p>
                      </div>
                   </div>
                </div>

                <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-200/50">
                   <Plus className="w-5 h-5"/> Push to Store
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 min-h-[300px] bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">
                <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-sm font-medium">Your masterpiece will appear here</p>
                <p className="text-xs opacity-70 mt-1">Ready to be customized</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGenerator;