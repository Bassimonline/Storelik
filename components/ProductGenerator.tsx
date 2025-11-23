import React, { useState } from 'react';
import { 
  Wand2, Upload, Loader2, Image as ImageIcon, Plus, 
  Megaphone, Search, Facebook, Instagram, Video, Copy, 
  RefreshCw, DollarSign, BarChart3, CheckCircle2, Languages,
  Sparkles, Zap, ArrowRight, MousePointer2, Smartphone
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
  const [importMode, setImportMode] = useState(false);
  
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
  const [activePlatform, setActivePlatform] = useState<'Facebook' | 'Instagram' | 'TikTok' | null>(null);

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
      setActivePlatform(null);
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
      setImportText(''); 
      setImportMode(false);
    } catch (err) {
      alert("Could not analyze text");
    } finally {
      setLoading(false);
    }
  };

  const generateAd = async (platform: 'Facebook' | 'Instagram' | 'TikTok') => {
    if (!generatedProduct) return;
    setActivePlatform(platform);
    if (marketingCopy[platform]) return; // Already generated

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
    const margin = sell > 0 ? ((profit / sell) * 100) : 0;
    return { profit, margin };
  };

  const { profit, margin } = calculateProfit();

  // Helper to render platform preview
  const RenderPlatformPreview = () => {
    if (!activePlatform || !marketingCopy[activePlatform]) return null;
    
    const text = marketingCopy[activePlatform];

    return (
      <div className="animate-fade-in mt-4">
        <div className="flex justify-between items-center mb-2">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preview</span>
           <button 
             onClick={() => navigator.clipboard.writeText(text)}
             className="text-xs flex items-center gap-1 text-indigo-600 font-bold hover:underline"
           >
             <Copy className="w-3 h-3" /> Copy
           </button>
        </div>

        {activePlatform === 'Facebook' && (
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm max-w-sm mx-auto font-sans">
             <div className="flex items-center gap-2 mb-3">
               <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
               <div>
                 <div className="font-bold text-sm text-[#050505]">My Store</div>
                 <div className="text-xs text-slate-500 flex items-center gap-1">Sponsored <span className="text-[10px]">🌍</span></div>
               </div>
             </div>
             <div className="text-sm text-[#050505] whitespace-pre-line mb-3">{text}</div>
             <div className="bg-slate-100 h-48 rounded flex items-center justify-center text-slate-400 mb-2 overflow-hidden">
                {generatedProduct?.imageUrl ? <img src={generatedProduct.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon />}
             </div>
             <div className="bg-slate-50 p-2 flex justify-between items-center rounded border border-slate-100">
                <span className="text-xs font-bold text-slate-500">SHOP NOW</span>
                <button className="bg-slate-200 text-slate-700 px-3 py-1 rounded text-xs font-bold">Learn More</button>
             </div>
          </div>
        )}

        {activePlatform === 'Instagram' && (
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm max-w-sm mx-auto font-sans">
             <div className="flex items-center justify-between mb-3">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px] rounded-full">
                    <div className="w-full h-full bg-white rounded-full"></div>
                 </div>
                 <span className="font-bold text-sm">mystore.ma</span>
               </div>
             </div>
             <div className="bg-slate-100 h-64 rounded mb-3 overflow-hidden">
                {generatedProduct?.imageUrl ? <img src={generatedProduct.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon />}
             </div>
             <div className="text-sm text-slate-900">
               <span className="font-bold mr-2">mystore.ma</span>
               <span className="whitespace-pre-line">{text}</span>
             </div>
          </div>
        )}

        {activePlatform === 'TikTok' && (
          <div className="bg-black text-white border border-slate-800 rounded-lg p-4 shadow-sm max-w-sm mx-auto font-sans relative overflow-hidden h-80">
             <div className="absolute inset-0 opacity-20">
                {generatedProduct?.imageUrl ? <img src={generatedProduct.imageUrl} className="w-full h-full object-cover blur-sm" /> : null}
             </div>
             <div className="relative z-10 h-full flex flex-col justify-end">
                <div className="mb-4">
                  <span className="font-bold text-sm shadow-black drop-shadow-md">@mystore.ma</span>
                  <p className="text-xs mt-1 text-white/90 whitespace-pre-line shadow-black drop-shadow-md">{text}</p>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-70">
                   <div className="w-4 h-4 rounded-full bg-white/20"></div>
                   <span>Original Sound - My Store</span>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  };

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
        
        {/* LEFT COLUMN: TOOLS (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tool Navigation */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex overflow-x-auto no-scrollbar">
            {[
              { id: 'create', label: 'Generator', icon: Wand2 },
              { id: 'marketing', label: 'Marketing', icon: Megaphone },
              { id: 'seo', label: 'SEO Config', icon: Search },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* MAIN WORKSPACE CARD */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[550px] relative">
            
            {loading && (
               <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center animate-fade-in">
                  <div className="relative">
                     <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                     </div>
                  </div>
                  <p className="mt-4 font-bold text-slate-600 animate-pulse">Consulting the AI...</p>
               </div>
            )}

            {/* TAB: GENERATOR */}
            {activeTab === 'create' && (
              <div className="p-6 md:p-8 space-y-8 animate-fade-in">
                
                {/* Mode Toggle */}
                <div className="grid grid-cols-2 gap-4">
                   <div 
                      onClick={() => setImportMode(false)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${!importMode ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                   >
                      <div className="flex items-center gap-2 mb-2">
                         <div className={`p-2 rounded-full ${!importMode ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}><Wand2 className="w-4 h-4" /></div>
                         <span className={`font-bold ${!importMode ? 'text-indigo-900' : 'text-slate-600'}`}>Create New</span>
                      </div>
                      <p className="text-xs text-slate-500">Generate from scratch using a name.</p>
                   </div>

                   <div 
                      onClick={() => setImportMode(true)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${importMode ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                   >
                      <div className="flex items-center gap-2 mb-2">
                         <div className={`p-2 rounded-full ${importMode ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}><Upload className="w-4 h-4" /></div>
                         <span className={`font-bold ${importMode ? 'text-emerald-900' : 'text-slate-600'}`}>Smart Import</span>
                      </div>
                      <p className="text-xs text-slate-500">Extract data from AliExpress text.</p>
                   </div>
                </div>

                {!importMode ? (
                  <>
                    <div className="space-y-5">
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Product Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Moroccan Argan Oil Shampoo"
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                          />
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Category</label>
                            <div className="relative">
                               <select 
                                 value={category}
                                 onChange={(e) => setCategory(e.target.value)}
                                 className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none appearance-none font-medium text-slate-700 cursor-pointer"
                               >
                                 <option>Fashion</option>
                                 <option>Electronics</option>
                                 <option>Beauty & Cosmetics</option>
                                 <option>Home & Decor</option>
                                 <option>Kids & Toys</option>
                                 <option>Automotive</option>
                               </select>
                               <div className="absolute right-4 top-4 pointer-events-none text-slate-400">
                                  <ArrowRight className="w-5 h-5 rotate-90" />
                               </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Target Language</label>
                            <div className="relative">
                                <Languages className="absolute left-4 top-4 text-indigo-500 w-5 h-5 z-10" />
                                <select 
                                  value={language}
                                  onChange={(e) => setLanguage(e.target.value)}
                                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none appearance-none font-medium text-slate-700 cursor-pointer"
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
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Brand Tone</label>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { id: 'Persuasive', emoji: '🔥', label: 'Persuasive' },
                            { id: 'Luxury', emoji: '💎', label: 'Luxury' },
                            { id: 'Friendly', emoji: '🤝', label: 'Friendly' },
                            { id: 'Professional', emoji: '💼', label: 'Pro' }
                          ].map(t => (
                             <button 
                                key={t.id}
                                onClick={() => setTone(t.id)}
                                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${tone === t.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}
                             >
                                <span className="text-xl">{t.emoji}</span>
                                <span className="text-xs font-bold">{t.label}</span>
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleGenerate}
                        disabled={loading || !name}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 flex items-center justify-center transition-all transform active:scale-95 group"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Generating Assets...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2 group-hover:animate-ping" /> Generate Product Magic
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-start gap-4">
                       <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                          <Upload className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-bold text-emerald-900 text-lg">Smart Text Analysis</h4>
                          <p className="text-sm text-emerald-700 mt-1">Paste raw product descriptions from AliExpress, Amazon, or supplier emails. Our AI will clean, translate, and structure the data automatically.</p>
                       </div>
                    </div>
                    <textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="Paste unstructured text here..."
                      className="w-full h-56 px-5 py-5 bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl outline-none resize-none text-sm leading-relaxed placeholder:text-slate-400"
                    />
                    <button
                      onClick={handleSmartImport}
                      disabled={loading || importText.length < 10}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 flex items-center justify-center transition-all transform active:scale-95"
                    >
                       {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze & Extract Data"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: MARKETING */}
            {activeTab === 'marketing' && (
              <div className="p-6 md:p-8 space-y-8 animate-fade-in h-full flex flex-col">
                 {!generatedProduct ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Megaphone className="w-8 h-8 opacity-20" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700">No Product Found</h3>
                      <p className="mb-6">Generate a product first to create marketing assets.</p>
                      <button onClick={() => setActiveTab('create')} className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-bold hover:bg-indigo-100 transition-colors">Go to Generator</button>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                      <div className="space-y-4">
                         <h3 className="font-bold text-slate-800 text-lg">Choose Platform</h3>
                         
                         <button 
                            onClick={() => generateAd('Facebook')}
                            className={`w-full flex items-center justify-between p-4 border rounded-2xl transition-all group ${activePlatform === 'Facebook' ? 'border-[#1877F2] bg-blue-50 ring-1 ring-[#1877F2]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                         >
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200"><Facebook className="w-6 h-6" /></div>
                               <div className="text-left">
                                  <span className="font-bold text-slate-800 block group-hover:text-[#1877F2]">Facebook Ad</span>
                                  <span className="text-xs text-slate-500">Optimized for conversion</span>
                               </div>
                            </div>
                            <ArrowRight className={`w-5 h-5 ${activePlatform === 'Facebook' ? 'text-[#1877F2]' : 'text-slate-300'}`} />
                         </button>
                         
                         <button 
                            onClick={() => generateAd('Instagram')}
                            className={`w-full flex items-center justify-between p-4 border rounded-2xl transition-all group ${activePlatform === 'Instagram' ? 'border-[#E1306C] bg-pink-50 ring-1 ring-[#E1306C]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                         >
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-pink-200"><Instagram className="w-6 h-6" /></div>
                               <div className="text-left">
                                  <span className="font-bold text-slate-800 block group-hover:text-[#E1306C]">Insta Caption</span>
                                  <span className="text-xs text-slate-500">Viral hashtags included</span>
                               </div>
                            </div>
                            <ArrowRight className={`w-5 h-5 ${activePlatform === 'Instagram' ? 'text-[#E1306C]' : 'text-slate-300'}`} />
                         </button>

                         <button 
                            onClick={() => generateAd('TikTok')}
                            className={`w-full flex items-center justify-between p-4 border rounded-2xl transition-all group ${activePlatform === 'TikTok' ? 'border-black bg-slate-50 ring-1 ring-black' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                         >
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white shadow-md shadow-slate-300"><Video className="w-6 h-6" /></div>
                               <div className="text-left">
                                  <span className="font-bold text-slate-800 block group-hover:text-black">TikTok Script</span>
                                  <span className="text-xs text-slate-500">Short video hooks</span>
                               </div>
                            </div>
                            <ArrowRight className={`w-5 h-5 ${activePlatform === 'TikTok' ? 'text-black' : 'text-slate-300'}`} />
                         </button>
                      </div>

                      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 relative flex flex-col items-center justify-center min-h-[400px]">
                         {loading ? (
                           <div className="text-center">
                              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
                              <p className="text-sm font-bold text-slate-500">Writing copy...</p>
                           </div>
                         ) : activePlatform ? (
                           <div className="w-full h-full overflow-y-auto custom-scrollbar">
                              <RenderPlatformPreview />
                           </div>
                         ) : (
                           <div className="text-center opacity-40">
                              <MousePointer2 className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                              <p className="font-bold text-slate-500">Select a platform</p>
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
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 mt-12">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                         <Search className="w-8 h-8 opacity-20" />
                       </div>
                       <p>Generate a product first to optimize SEO.</p>
                       <button onClick={() => setActiveTab('create')} className="mt-4 text-indigo-600 font-bold hover:underline">Go to Generator</button>
                    </div>
                 ) : (
                    <div className="space-y-8">
                       {!seoData ? (
                          <div className="text-center py-12">
                             <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                                <Search className="w-8 h-8" />
                             </div>
                             <h3 className="text-xl font-bold text-slate-800 mb-2">Search Engine Optimization</h3>
                             <p className="text-slate-600 mb-6 max-w-md mx-auto">Generate optimized meta tags, titles, and keywords to rank higher on Google.</p>
                             <button 
                                onClick={generateSEO}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto transition-colors shadow-lg shadow-indigo-200"
                             >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                                Generate SEO Metadata
                             </button>
                          </div>
                       ) : (
                          <div className="space-y-6">
                             {/* Mock Score Card */}
                             <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                                <div className="relative w-16 h-16 flex items-center justify-center">
                                   <svg className="w-full h-full" viewBox="0 0 36 36">
                                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="95, 100" />
                                   </svg>
                                   <span className="absolute text-sm font-bold text-emerald-700">95%</span>
                                </div>
                                <div>
                                   <h4 className="font-bold text-emerald-900">SEO Health Score</h4>
                                   <p className="text-xs text-emerald-700">Excellent! Your content is highly optimized.</p>
                                </div>
                             </div>

                             <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-indigo-300 transition-colors group">
                                <label className="flex justify-between text-xs font-bold text-indigo-600 uppercase mb-2">
                                   Meta Title
                                   <span className="text-slate-400 font-normal">{seoData.metaTitle.length} / 60</span>
                                </label>
                                <div className="relative">
                                   <input readOnly value={seoData.metaTitle} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-blue-600 font-medium" />
                                   <button className="absolute right-3 top-3 text-slate-400 hover:text-indigo-600" onClick={() => navigator.clipboard.writeText(seoData.metaTitle)}><Copy className="w-4 h-4" /></button>
                                </div>
                             </div>

                             <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-indigo-300 transition-colors group">
                                <label className="flex justify-between text-xs font-bold text-indigo-600 uppercase mb-2">
                                   Meta Description
                                   <span className="text-slate-400 font-normal">{seoData.metaDescription.length} / 160</span>
                                </label>
                                <div className="relative">
                                   <textarea readOnly value={seoData.metaDescription} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 h-24 resize-none leading-relaxed" />
                                   <button className="absolute right-3 top-3 text-slate-400 hover:text-indigo-600" onClick={() => navigator.clipboard.writeText(seoData.metaDescription)}><Copy className="w-4 h-4" /></button>
                                </div>
                             </div>

                             <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                                <label className="block text-xs font-bold text-indigo-600 uppercase mb-3">Focus Keywords</label>
                                <div className="flex flex-wrap gap-2">
                                   {seoData.keywords.split(',').map((k, i) => (
                                      <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 flex items-center gap-1 hover:bg-white hover:shadow-sm transition-all cursor-default">
                                         <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                         {k.trim()}
                                      </span>
                                   ))}
                                </div>
                             </div>
                             
                             <button onClick={generateSEO} className="w-full py-3 text-slate-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <RefreshCw className="w-4 h-4" /> Regenerate Analysis
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
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-fit sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
               <span className="flex items-center gap-2"><Smartphone className="w-5 h-5 text-slate-400" /> Mobile Preview</span>
               {generatedProduct && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold uppercase tracking-wide">Live</span>}
            </h3>
            
            {generatedProduct ? (
              <div className="flex-1 flex flex-col animate-fade-in group">
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 bg-slate-50 border border-slate-100 shadow-inner group-hover:shadow-md transition-shadow">
                  <img 
                    src={generatedProduct.imageUrl} 
                    alt={generatedProduct.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[10px] font-black px-3 py-1.5 rounded-full text-slate-900 shadow-sm border border-white">
                    AI GENERATED
                  </div>
                </div>
                
                <div className="space-y-4">
                   <h2 className="text-2xl font-black text-slate-900 leading-tight">{generatedProduct.name}</h2>
                   
                   <div className="flex flex-wrap gap-2">
                      <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">{generatedProduct.category}</span>
                   </div>

                   <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed text-justify">
                      {generatedProduct.description}
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                   <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-500" />
                      Profit Calculator
                   </h4>
                   <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                         <label className="text-xs font-bold text-slate-400 mb-1 block uppercase">Cost</label>
                         <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">MAD</span>
                            <input 
                              type="number" 
                              value={costPrice}
                              onChange={(e) => setCostPrice(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-3 py-2 text-sm outline-none focus:border-indigo-500 font-bold text-slate-700"
                              placeholder="0.00"
                            />
                         </div>
                      </div>
                      <div>
                         <label className="text-xs font-bold text-slate-400 mb-1 block uppercase">Selling</label>
                         <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">MAD</span>
                            <input 
                              type="number" 
                              value={sellingPrice}
                              onChange={(e) => setSellingPrice(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-3 py-2 text-sm outline-none focus:border-indigo-500 font-bold text-slate-700"
                              placeholder="0.00"
                            />
                         </div>
                      </div>
                   </div>
                   
                   <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg shadow-slate-200">
                      <div className="flex justify-between items-end mb-3">
                        <div>
                           <p className="text-xs text-slate-400 font-bold uppercase mb-1">Net Profit</p>
                           <p className="text-2xl font-black tracking-tight">{profit > 0 ? profit.toFixed(2) : '0.00'} <span className="text-sm font-normal text-slate-400">MAD</span></p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-slate-400 font-bold uppercase mb-1">Margin</p>
                           <p className={`text-xl font-bold ${Number(margin) > 30 ? 'text-emerald-400' : 'text-yellow-400'}`}>{margin.toFixed(0)}%</p>
                        </div>
                      </div>
                      {/* Visual Margin Bar */}
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                         <div 
                           className={`h-full transition-all duration-500 ${Number(margin) > 30 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-orange-500 to-yellow-400'}`} 
                           style={{ width: `${Math.min(Number(margin), 100)}%` }}
                         ></div>
                      </div>
                   </div>
                </div>

                <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors shadow-xl shadow-indigo-200 hover:-translate-y-1 transform duration-200">
                   <Plus className="w-5 h-5"/> Push to Store
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 min-h-[400px] bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                <ImageIcon className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-sm font-bold text-slate-400">Your masterpiece will appear here</p>
                <p className="text-xs opacity-60 mt-1">Ready to be customized</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGenerator;