'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../../components/navbar';
import { Sidebar } from '../../components/sidebar';
import { CitizenAssistant } from '../../components/ai/citizen-assistant';
import { getAuthClient } from '../../lib/supabase';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { mockProfile } from '../../services/mock-data';
import { UserProfile, GovernmentScheme } from '../../types';
import { Check, Sparkles, RefreshCw } from 'lucide-react';

export default function RecommendPage() {
  const [, setProfile] = useState(mockProfile);
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form edit states
  const [age, setAge] = useState(String(mockProfile.age));
  const [occupation, setOccupation] = useState(mockProfile.occupation);
  const [income, setIncome] = useState(String(mockProfile.income));
  const [education, setEducation] = useState(mockProfile.education);
  const [location, setLocation] = useState(mockProfile.location);

  const fetchRecommendations = useCallback(async (customProfile?: UserProfile) => {
    setIsLoading(true);
    const dataToSend = customProfile || {
      age: parseInt(age),
      occupation,
      income: parseFloat(income),
      education,
      location
    };

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      const data = await res.json();
      if (data.schemes) {
        setSchemes(data.schemes);
      } else {
        throw new Error(data.error || "Failed to fetch");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [age, occupation, income, education, location]);

  useEffect(() => {
    const fetchUserAndRecommend = async () => {
      const auth = getAuthClient();
      const { data: { session } } = await auth.getSession();
      
      let currentProfile = mockProfile;
      if (session?.user?.user_metadata) {
        const meta = session.user.user_metadata;
        currentProfile = {
          name: meta.name || mockProfile.name,
          email: session.user.email || mockProfile.email,
          age: meta.age || mockProfile.age,
          occupation: meta.occupation || mockProfile.occupation,
          income: meta.income || mockProfile.income,
          location: meta.location || mockProfile.location,
          education: meta.education || mockProfile.education,
          language: meta.language || mockProfile.language
        };
        setProfile(currentProfile);
        
        // Sync local inputs
        setAge(String(currentProfile.age));
        setOccupation(currentProfile.occupation);
        setIncome(String(currentProfile.income));
        setEducation(currentProfile.education);
        setLocation(currentProfile.location);
      }

      // Fetch initial recommendations using the loaded profile
      setIsLoading(true);
      try {
        const res = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentProfile)
        });
        const data = await res.json();
        if (data.schemes) {
          setSchemes(data.schemes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndRecommend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRecalculate = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecommendations();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
              Smart Scheme Matcher
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              AI-driven profile evaluation mapping eligible financial benefits, credits, and subsidies
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Interactive Profile Form */}
            <Card className="border-border/80 lg:col-span-1 shrink-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Demographic Calculator</CardTitle>
                <CardDescription>Adjust your values below to test compatibility criteria changes</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRecalculate} className="space-y-4 text-xs font-sans">
                  
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-300">Age</label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="bg-zinc-900/40 border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-300">Occupation</label>
                    <Input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="bg-zinc-900/40 border-border text-foreground"
                      placeholder="Freelancer, Student, etc."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-300">Annual Income (₹)</label>
                    <Input
                      type="number"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="bg-zinc-900/40 border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-300">Location</label>
                    <Input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-zinc-900/40 border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-300">Education Level</label>
                    <Select
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="bg-zinc-900/40 border-border text-foreground"
                    >
                      <option value="High School Graduate">High School Graduate</option>
                      <option value="Associate Degree">Associate Degree</option>
                      <option value="Bachelor of Science in Computer Science">Bachelor&apos;s Degree</option>
                      <option value="Master of Business Administration">Master&apos;s Degree</option>
                      <option value="Doctor of Philosophy">PhD / Doctorate</option>
                      <option value="Other">Other / None</option>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-2 h-10 shadow cursor-pointer text-xs"
                    isLoading={isLoading}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-2" /> Recalculate Matches
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Scheme Recommendations Grid */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-foreground flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" /> Eligible Recommendations
              </h2>

              <div className="space-y-4">
                {schemes.map((scheme) => {
                  const score = scheme.matchPercentage || 50;
                  const scoreVariant = score >= 85 ? 'success' : score >= 60 ? 'warning' : 'destructive';

                  return (
                    <Card key={scheme.id} className="border-border/80 overflow-hidden relative">
                      <div className={`absolute top-0 left-0 right-0 h-[3px] ${
                        scoreVariant === 'success' ? 'bg-emerald-500' : scoreVariant === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base font-bold text-foreground flex items-center">
                              {scheme.title}
                            </CardTitle>
                            <Badge variant="secondary" className="capitalize text-[9px] mt-1.5">{scheme.category.replace('_', ' ')}</Badge>
                          </div>
                          <Badge variant={scoreVariant} className="text-xs font-semibold px-2 py-0.5">
                            {score}% Match
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-2 text-xs">
                        <p className="text-muted-foreground leading-relaxed">{scheme.description}</p>
                        
                        {/* Benefits list */}
                        <div className="p-3 rounded-lg bg-zinc-900/40 border border-border/80">
                          <span className="font-bold text-foreground text-[10px] uppercase block mb-1">Subsidized Benefits</span>
                          <p className="text-zinc-300 leading-relaxed font-medium">{scheme.benefits}</p>
                        </div>

                        {/* AI Match Reason Explainer */}
                        {scheme.aiExplanation && (
                          <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 flex items-start space-x-2">
                            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-primary text-[10px] block">AI Match Rationale</span>
                              <p className="text-zinc-300 leading-relaxed text-[11px] mt-0.5">{scheme.aiExplanation}</p>
                            </div>
                          </div>
                        )}

                        {/* Checklist */}
                        <div>
                          <span className="font-bold text-foreground text-[10px] uppercase block mb-1">Required Verification Checklist</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-muted-foreground mt-1">
                            {scheme.requiredDocuments.map((doc: string, idx: number) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                <span>{doc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {schemes.length === 0 && !isLoading && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Click &quot;Recalculate Matches&quot; to compute scheme recommendations.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>

      <CitizenAssistant />
    </div>
  );
}
