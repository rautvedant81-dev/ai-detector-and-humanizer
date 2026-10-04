import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';

export const Pricing: React.FC = () => {
  const { success, info } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('Pro');

  const handleChoosePlan = (planName: string) => {
    setSelectedPlan(planName);
    if (planName === 'Free') {
      info('You are already on the Free Starter plan.');
      return;
    }
    setCheckoutModalOpen(true);
  };

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: '/month',
      desc: 'Perfect for students and occasional writing checks.',
      popular: false,
      features: [
        '5 analyses per day',
        'Basic AI pattern detector',
        'Standard writing humanizer',
        '500 words per request',
        'History saved for 7 days',
        'Standard processing speed'
      ],
      cta: 'Get Started Free',
      buttonStyle: 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white'
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? '₹299' : '₹239',
      period: '/month',
      desc: 'For researchers, content creators, and regular writers.',
      popular: true,
      features: [
        '100 analyses per month',
        'Advanced sentence-level heuristics',
        'Full natural tone humanizer (9 tones)',
        '5,000 words per request',
        'Unlimited document history',
        'Downloadable PDF & TXT reports',
        'Word-level diff comparison'
      ],
      cta: 'Start Pro Plan',
      buttonStyle: 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-md hover:shadow-glow'
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? '₹799' : '₹639',
      period: '/month',
      desc: 'For academic departments, agencies, and high-volume teams.',
      popular: false,
      features: [
        'Unlimited analyses & humanizations',
        '10,000 words per request',
        'Advanced writing & tone presets',
        'Instant priority cloud processing',
        'Batch document uploads (.docx / .txt)',
        'Team workspace collaboration',
        'Dedicated priority support'
      ],
      cta: 'Choose Professional',
      buttonStyle: 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flexible & Transparent Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Invest in Clear, Natural Writing
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Choose the plan that fits your writing and research workflow. Upgrade or cancel anytime.
        </p>

        {/* Billing Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(prev => (prev === 'monthly' ? 'annual' : 'monthly'))}
            className="w-12 h-6 bg-brand-600 rounded-full p-1 relative transition-colors"
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
            Annual Billing{' '}
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-3xl bg-white dark:bg-slate-900 border flex flex-col justify-between space-y-6 transition-all relative ${
              plan.popular
                ? 'border-2 border-brand-500 shadow-glow md:-translate-y-2'
                : 'border-slate-200 dark:border-slate-800 shadow-subtle hover:shadow-premium'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-indigo-600 text-white px-3.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow">
                Most Popular
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{plan.desc}</p>
              </div>

              <div className="pt-2 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {plan.period}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-3">
                  Included Features:
                </span>
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleChoosePlan(plan.name)}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${plan.buttonStyle}`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Checkout Modal Simulation */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title={`Upgrade to ${selectedPlan} Plan`}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-xs text-brand-900 dark:text-brand-200">
            <p className="font-semibold">
              Demo Mode Active: Payment integration simulation
            </p>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              In production, this modal connects directly to Razorpay / Stripe checkout for instant recurring subscription activation.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Selected Plan</span>
              <span className="font-bold text-slate-900 dark:text-white">{selectedPlan} ({billingCycle})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Total Due</span>
              <span className="font-extrabold text-brand-600 dark:text-brand-400">
                {selectedPlan === 'Pro' ? (billingCycle === 'monthly' ? '₹299/mo' : '₹2,868/yr') : (billingCycle === 'monthly' ? '₹799/mo' : '₹7,668/yr')}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCheckoutModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                setCheckoutModalOpen(false);
                success(`Successfully subscribed to ${selectedPlan} plan!`);
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow"
            >
              Confirm Subscription (Demo)
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
