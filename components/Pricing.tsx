import React, { useState } from 'react';
import { Check, Zap, Globe, ShieldCheck } from 'lucide-react';
import { PricingPlan } from '../types';

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 199,
    period: 'monthly',
    features: [
      '1 Store',
      'AI Product Generator (50/mo)',
      'Standard Themes',
      'Email Support',
      'Basic Analytics'
    ]
  },
  {
    id: 'pro',
    name: 'Growth',
    price: 399,
    period: 'monthly',
    recommended: true,
    features: [
      '3 Stores',
      'Unlimited AI Generation',
      'Premium Themes',
      'WhatsApp Order Bot (Darija)',
      'Priority Support',
      'Advanced Analytics',
      'Custom Domain'
    ]
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 999,
    period: 'monthly',
    features: [
      '10 Stores',
      'White Label Dashboard',
      'API Access',
      'Dedicated Manager',
      'Custom AI Training'
    ]
  }
];

const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="py-12 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-2">Pricing Plans</h2>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Start selling in Morocco today.</h1>
        <p className="text-slate-500 text-lg">Choose the perfect plan for your business. No hidden fees.</p>
        
        <div className="flex items-center justify-center mt-8 gap-3">
          <span className={`text-sm font-medium ${!annual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
          <button 
            onClick={() => setAnnual(!annual)}
            className="w-14 h-7 bg-indigo-600 rounded-full relative transition-colors duration-200"
          >
            <div className={`absolute top-1 bg-white w-5 h-5 rounded-full transition-all duration-200 ${annual ? 'left-8' : 'left-1'}`} />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-slate-900' : 'text-slate-500'}`}>
            Yearly <span className="text-emerald-500 text-xs font-bold ml-1">(Save 20%)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative bg-white rounded-2xl p-8 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${plan.recommended ? 'border-indigo-600 shadow-lg ring-1 ring-indigo-100' : 'border-slate-200'}`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-extrabold text-slate-900">
                {annual ? Math.floor(plan.price * 12 * 0.8) : plan.price}
              </span>
              <span className="text-slate-500 ml-2 font-medium">MAD / {annual ? 'year' : 'mo'}</span>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-slate-600 text-sm">
                  <Check className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${plan.recommended ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-900'}`}>
              Get Started
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
         <div className="p-4">
            <Zap className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800">Fast Deployment</h4>
            <p className="text-sm text-slate-500">Launch your store in under 5 minutes with AI.</p>
         </div>
         <div className="p-4">
            <Globe className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800">Local Payments</h4>
            <p className="text-sm text-slate-500">Integrated with CMI, YouCan Pay, and COD optimization.</p>
         </div>
         <div className="p-4">
            <ShieldCheck className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800">Secure & Reliable</h4>
            <p className="text-sm text-slate-500">Free SSL and 99.9% uptime guarantee.</p>
         </div>
      </div>
    </div>
  );
};

export default Pricing;