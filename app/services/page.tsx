'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/navbar';
import { Sidebar } from '../../components/sidebar';
import { CitizenAssistant } from '../../components/ai/citizen-assistant';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { mockServices } from '../../services/mock-data';
import { GovernmentService } from '../../types';
import { Search, Info, FileText, ArrowLeft, Brain, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServicesExplorerPage() {
  // Unused t hook call removed
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeService, setActiveService] = useState<GovernmentService | null>(null);
  
  // AI simplification states
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'licenses', name: 'Licenses & Passport' },
    { id: 'scholarships', name: 'Scholarships & Grants' },
    { id: 'certificates', name: 'Certificates' },
    { id: 'pensions', name: 'Pensions' },
    { id: 'utilities', name: 'Utilities' }
  ];

  // Filtering logic
  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(search.toLowerCase()) || 
                          service.description.toLowerCase().includes(search.toLowerCase()) ||
                          service.department.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSimplifyPolicy = async (service: GovernmentService) => {
    setIsSimplifying(true);
    setSimplifiedText(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Summarize the government service policy for "${service.title}" under ${service.department}.
                    Details:
                    - Description: ${service.description}
                    - Eligibility: ${service.eligibility.join(', ')}
                    - Documents: ${service.requiredDocuments.join(', ')}
                    
                    Explain it in simple, 5th-grade plain bullet points. Avoid legal jargon. Suggest 2 tips to bypass red tape.`,
          history: []
        })
      });

      const data = await res.json();
      if (data.reply) {
        setSimplifiedText(data.reply);
      } else {
        throw new Error(data.error || "Failed to simplify");
      }
    } catch (err) {
      console.error(err);
      // Fallback summary
      setSimplifiedText(
        `### Simplified AI Explainer for ${service.title}:\n\n` +
        `* **What it is:** This gets you a ${service.title.toLowerCase()} from the ${service.department}.\n` +
        `* **Main Criteria:** You must satisfy the basic checks: residence matching and age limits.\n` +
        `* **Docs to Grab:** Prepare your ID and address papers beforehand. Utility bills must be fresh (under 90 days old).\n` +
        `* **AI Hackathon Tip:** Use our **AI Document Assistant** to check your files for errors before you book an appointment to avoid immediate rejection.`
      );
    } finally {
      setIsSimplifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto relative">
          
          {/* Main List view */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Government Services Explorer
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Browse catalog of public services, licenses, and permits with step-by-step guidance
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search passport, licenses, certificates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar py-1">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-primary-foreground border-transparent shadow shadow-primary/20'
                        : 'bg-card text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <Card 
                  key={service.id} 
                  hoverable 
                  className="flex flex-col h-full cursor-pointer hover:border-primary/20 border-border/80"
                  onClick={() => {
                    setActiveService(service);
                    setSimplifiedText(null);
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="capitalize text-[10px]">{service.category}</Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" /> {service.processingTime.split(' ')[0]}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground line-clamp-1">{service.title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">{service.department}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between pt-2">
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center text-xs text-primary font-semibold group mt-auto">
                      View details & apply 
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Info className="h-8 w-8 mx-auto mb-3 text-muted-foreground/60" />
                <p>No services found matching your search filters.</p>
              </div>
            )}
          </div>

          {/* Drawer Detail panel (Sliding overlay) */}
          <AnimatePresence>
            {activeService && (
              <>
                {/* Backdrop overlay */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveService(null)}
                  className="fixed inset-0 bg-black z-40"
                />

                {/* Sliding Card panel */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] lg:w-[600px] bg-card border-l border-border z-50 shadow-2xl p-6 overflow-y-auto flex flex-col font-sans"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-border/60 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => setActiveService(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <Badge variant="success">Online Filing</Badge>
                  </div>

                  <div className="flex-1 space-y-6 pt-6 text-sm">
                    {/* Header */}
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{activeService.title}</h2>
                      <p className="text-xs text-muted-foreground mt-1">{activeService.department}</p>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {activeService.description}
                    </p>

                    {/* AI simplify CTA banner */}
                    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
                      <div className="flex items-start space-x-3">
                        <Brain className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="font-semibold text-primary text-xs flex items-center">
                            AI Citizen Policy Simplifier
                          </span>
                          <p className="text-[11px] text-muted-foreground">
                            Legal policies and rules are hard. Click below to simplify the application terms into basic language.
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSimplifyPolicy(activeService)}
                        isLoading={isSimplifying}
                        size="sm"
                        className="w-full mt-1 text-xs cursor-pointer shadow-lg shadow-primary/15"
                      >
                        Simplify Terms with AI
                      </Button>

                      {simplifiedText && (
                        <div className="mt-4 p-3 rounded-lg border border-border bg-zinc-950/80 text-xs leading-relaxed text-zinc-300 font-sans space-y-2 whitespace-pre-line">
                          {simplifiedText}
                        </div>
                      )}
                    </div>

                    {/* Meta stats */}
                    <div className="grid grid-cols-2 gap-4 border-y border-border/60 py-4">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Processing Speed</span>
                        <span className="font-medium text-foreground text-xs flex items-center mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1 text-primary" /> {activeService.processingTime}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Fees</span>
                        <span className="font-medium text-foreground text-xs block mt-1">Free / Standard filing fee</span>
                      </div>
                    </div>

                    {/* Eligibility details */}
                    <div className="space-y-2">
                      <span className="font-bold text-foreground text-xs uppercase tracking-wider block">Eligibility Criteria</span>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {activeService.eligibility.map((el, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                            <span>{el}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Required Documents */}
                    <div className="space-y-2">
                      <span className="font-bold text-foreground text-xs uppercase tracking-wider block">Required Documents checklist</span>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {activeService.requiredDocuments.map((doc, i) => (
                          <li key={i} className="flex items-start">
                            <FileText className="h-3.5 w-3.5 text-indigo-400 shrink-0 mr-2 mt-0.5" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                      <span className="font-bold text-foreground text-xs uppercase tracking-wider block">Application steps</span>
                      <div className="relative pl-6 border-l border-zinc-800 space-y-4 text-xs text-muted-foreground ml-2">
                        {activeService.steps.map((step, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[30px] top-0 h-4 w-4 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[9px] font-bold text-primary font-mono">
                              {i + 1}
                            </div>
                            <p className="leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FAQs */}
                    <div className="space-y-3">
                      <span className="font-bold text-foreground text-xs uppercase tracking-wider block">Frequently Asked Questions</span>
                      <div className="space-y-3">
                        {activeService.faqs.map((faq, i) => (
                          <div key={i} className="p-3 rounded-lg bg-zinc-900/40 border border-border/80 text-xs">
                            <p className="font-semibold text-foreground mb-1">{faq.question}</p>
                            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </main>
      </div>

      <CitizenAssistant />
    </div>
  );
}
