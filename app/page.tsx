'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAuthClient } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { MessageSquare, Search, FileText, ClipboardList, ArrowRight, Activity, Users, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const auth = getAuthClient();
      const { data: { session } } = await auth.getSession();
      if (session) {
        setIsLoggedIn(true);
      }
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[160px] pointer-events-none" />
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-900 relative z-20">
        <div className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
          <span>CivicAI</span>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button variant="outline" className="border-zinc-800 hover:bg-zinc-900 text-zinc-200">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="shadow-lg shadow-primary/20">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-indigo-400 mb-6 backdrop-blur-sm"
        >
          <Zap className="h-3.5 w-3.5 text-indigo-400" />
          <span>The Future of Digital Citizen Services</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-tight"
        >
          Democratizing Access to{" "}
          <span className="bg-gradient-to-r from-primary via-indigo-400 to-sky-400 bg-clip-text text-transparent">
            Government Services
          </span>{" "}
          with Generative AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mt-6 leading-relaxed font-sans"
        >
          CivicAI simplifies complicated eligibility criteria, streamlines document checks, and speeds up local issue reporting with a beautiful, unified digital citizen companion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10"
        >
          <Link href={isLoggedIn ? "/dashboard" : "/register"}>
            <Button size="lg" className="shadow-lg shadow-primary/25 h-12 text-base px-6">
              Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/services">
            <Button size="lg" variant="outline" className="border-zinc-800 hover:bg-zinc-900 h-12 text-base px-6">
              Explore Services
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Metrics Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-zinc-950/40 border border-zinc-900 flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">120K+</p>
              <p className="text-zinc-500 text-sm">Active Citizens Empowered</p>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-zinc-950/40 border border-zinc-900 flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">98.4%</p>
              <p className="text-zinc-500 text-sm">Document Review Accuracy</p>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-zinc-950/40 border border-zinc-900 flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">4.2x</p>
              <p className="text-zinc-500 text-sm">Faster Issue Resolution Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900">
        <h2 className="text-3xl font-bold text-center mb-16">All-In-One Intelligent Platform</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all group">
            <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-6">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Citizen Assistant</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Ask complicated civic questions, summarize policy texts, and translate forms into multiple languages instantly using Gemini AI.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all group">
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 w-fit mb-6">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Service Explorer</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Discover passport guides, licensing, permits, and caste certificates with simplified steps, eligibility requirements, and checklists.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all group">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-6">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Recommendation</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Enter your age, occupation, and income to obtain a personalized index match of eligible government subsidies and scholarships.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all group">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 w-fit mb-6">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Document Auditing</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Check address proofs and identity documents for name mismatches, formatting, and stamp validations before visiting government offices.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-8 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all group">
            <div className="p-3 rounded-lg bg-rose-500/10 text-rose-400 w-fit mb-6">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Civic Issue Reporter</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Report water leaks, road damage, and broken lights. Pin coordinates and auto-generate legal complaint descriptions with AI.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-8 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all group">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-6">
              <ClipboardList className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Live Complaint Tracker</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Track the exact stage of your complaint resolution from dispatch, assignment, inspection, and formal signoff with a timeline indicator.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-900 text-center text-zinc-500 text-xs">
        <p>© 2026 CivicAI Platform. Developed for Next-Generation digital governance.</p>
        <p className="mt-2 text-zinc-600">Built using Gemini 1.5 Flash, Supabase Fallback Auth, and Tailwind v4.</p>
      </footer>
    </div>
  );
}
