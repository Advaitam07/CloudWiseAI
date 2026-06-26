import React from 'react';
import { Cloud, Shield, Mail, MapPin, DollarSign, Layers } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-600 selection:text-white font-sans overflow-x-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-900 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-purple-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-purple-500/20">
              <Cloud className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
              CloudWise <span className="text-purple-500">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-purple-400 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-purple-400 transition-colors">Contact</a>
          </nav>

          <button
            onClick={onStart}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-semibold text-white rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-800 transition-transform active:scale-95"
          >
            <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-slate-950 rounded-md group-hover:bg-opacity-0">
              Launch App
            </span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            V1.0.0 Out Now - Free Tier Sandbox Included
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Design and Optimize
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
              Cloud Stacks Instantly
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed">
            Drag, drop, and configure AWS architecture. Our deep intelligence engine generates live cost breakdowns, highlights security issues, and advises optimization pathways.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-xl shadow-purple-600/20 transition-all hover:scale-105 active:scale-95 duration-200"
            >
              Get Started for Free
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl hover:bg-slate-850 transition-all hover:scale-105 active:scale-95 duration-200 text-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Platform Features
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Everything you need to orchestrate cloud setups and prevent cost overruns, compiled into a single suite.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">Architecture Visualizer</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Build cloud resource maps and inspect connectivity. Auto-layouts create elegant flow diagrams showing VPC boundaries, API routes, and subnets.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">AI Cost Estimator</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Live cost tracking calculated on database usage tier, compute profiles, data ingress thresholds, and service scaling limits.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">Security Guardrails</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Runs static rules against VPC, database access layers, public web hooks, SSL configurations, and IAM rules to highlight vulnerabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Flexible Pricing
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Choose the package that scales with your infrastructure. Start free, no credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-400 mb-2">Sandbox</h3>
                <div className="text-3xl font-extrabold text-white mb-6">$0</div>
                <ul className="space-y-3 text-slate-400 text-sm mb-8">
                  <li className="flex items-center gap-2">✓ 2 active projects</li>
                  <li className="flex items-center gap-2">✓ Cost estimator tool</li>
                  <li className="flex items-center gap-2">✓ Infrastructure visualizer</li>
                </ul>
              </div>
              <button onClick={onStart} className="w-full py-3 bg-slate-800 text-slate-100 rounded-xl hover:bg-slate-700 font-semibold transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl bg-purple-900/10 border-2 border-purple-500 flex flex-col justify-between relative shadow-2xl shadow-purple-500/10">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full">
                Most Popular
              </span>
              <div>
                <h3 className="text-lg font-bold text-purple-400 mb-2">Architect Pro</h3>
                <div className="text-3xl font-extrabold text-white mb-6">$29<span className="text-sm font-normal text-slate-400">/mo</span></div>
                <ul className="space-y-3 text-slate-300 text-sm mb-8">
                  <li className="flex items-center gap-2">✓ Unlimited active projects</li>
                  <li className="flex items-center gap-2">✓ AI-powered optimization engine</li>
                  <li className="flex items-center gap-2">✓ Downloadable PDF reports</li>
                  <li className="flex items-center gap-2">✓ Security scanner checks</li>
                </ul>
              </div>
              <button onClick={onStart} className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold transition-all shadow-lg shadow-purple-500/20">
                Upgrade Now
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-400 mb-2">Enterprise</h3>
                <div className="text-3xl font-extrabold text-white mb-6">Custom</div>
                <ul className="space-y-3 text-slate-400 text-sm mb-8">
                  <li className="flex items-center gap-2">✓ Team workspaces</li>
                  <li className="flex items-center gap-2">✓ Live AWS infrastructure sync</li>
                  <li className="flex items-center gap-2">✓ Custom API integrations</li>
                </ul>
              </div>
              <button onClick={onStart} className="w-full py-3 bg-slate-800 text-slate-100 rounded-xl hover:bg-slate-700 font-semibold transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 border-t border-slate-900 bg-slate-950/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-12 text-white">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h4 className="text-lg font-bold text-slate-200 mb-2">How accurate are the cost estimates?</h4>
              <p className="text-slate-400 text-sm">
                Estimates are derived from the official AWS Price List APIs based on configured EC2 instance sizes, EBS sizes, DynamoDB read/write modes, and network ingress variables.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h4 className="text-lg font-bold text-slate-200 mb-2">Can I export my designs to code?</h4>
              <p className="text-slate-400 text-sm">
                Yes! CloudWise AI has built-in features to export cloud configuration mappings to AWS CloudFormation / SAM YAML template structures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 border-t border-slate-900 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-4 text-white">Contact CloudWise AI Team</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Have questions about our cloud design tools or AI optimization scanner?</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" /> support@cloudwise.ai
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" /> San Francisco, CA
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-650 text-slate-500">
        &copy; 2026 CloudWise AI Inc. All rights reserved. Made for cloud engineers, solution architects, and DevOps.
      </footer>
    </div>
  );
};
