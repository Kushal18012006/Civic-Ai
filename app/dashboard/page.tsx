'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthClient } from '../../lib/supabase';
import { Navbar } from '../../components/navbar';
import { Sidebar } from '../../components/sidebar';
import { CitizenAssistant } from '../../components/ai/citizen-assistant';
import { useLanguage } from '../../components/language-provider';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { mockActivity, mockSchemes, mockProfile } from '../../services/mock-data';
import { User, Activity, Sparkles, Plus, Award, ChevronRight, FileCheck } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [profile, setProfile] = useState(mockProfile);
  const [activities] = useState(mockActivity);

  useEffect(() => {
    // Authenticate user check
    const checkAuth = async () => {
      const auth = getAuthClient();
      const { data: { session } } = await auth.getSession();
      if (!session) {
        // Fallback to mock profile if not signed in, but in a real app redirect to login
        // For hackathon ease, if there is no session, we stay on mock data.
      } else if (session.user?.user_metadata) {
        const metadata = session.user.user_metadata;
        setProfile({
          name: metadata.name || mockProfile.name,
          email: session.user.email || mockProfile.email,
          age: metadata.age || mockProfile.age,
          occupation: metadata.occupation || mockProfile.occupation,
          income: metadata.income || mockProfile.income,
          location: metadata.location || mockProfile.location,
          education: metadata.education || mockProfile.education,
          language: metadata.language || mockProfile.language
        });
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
                {t('welcomeBack')}, {profile.name.split(' ')[0]} 👋
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Here is your civic activity overview for {profile.location}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => router.push('/report-issue')} className="shadow cursor-pointer">
                <Plus className="h-4 w-4 mr-2" /> {t('reportIssue')}
              </Button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Citizen Profile Summary */}
            <Card hoverable className="lg:col-span-2 border-border/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" /> {t('profile')}
                  </CardTitle>
                  <CardDescription>Verified demographic indexing context</CardDescription>
                </div>
                <Badge variant="success">Active</Badge>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 text-sm border-t border-border/40 mt-2">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block font-semibold">Age</span>
                  <span className="font-medium text-foreground">{profile.age} years old</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block font-semibold">Occupation</span>
                  <span className="font-medium text-foreground truncate block">{profile.occupation}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block font-semibold">Annual Income</span>
                  <span className="font-medium text-foreground">₹{profile.income.toLocaleString()}</span>
                </div>
                <div className="col-span-2 md:col-span-3 h-px bg-border/40 my-1" />
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block font-semibold">Education</span>
                  <span className="font-medium text-foreground">{profile.education}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block font-semibold">Home Address</span>
                  <span className="font-medium text-foreground truncate block">{profile.location.split(',')[1] || profile.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions widget */}
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{t('quickActions')}</CardTitle>
                <CardDescription>Fast access to helper engines</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <Button 
                  onClick={() => router.push('/recommend')} 
                  variant="outline" 
                  className="w-full justify-start text-xs border-border/85 hover:border-primary/30 h-11"
                >
                  <Award className="h-4 w-4 mr-3 text-amber-500" /> Match Subsidies & Schemes
                </Button>
                <Button 
                  onClick={() => router.push('/document-check')} 
                  variant="outline" 
                  className="w-full justify-start text-xs border-border/85 hover:border-emerald-500/35 h-11"
                >
                  <FileCheck className="h-4 w-4 mr-3 text-emerald-500" /> AI Document Checklist audit
                </Button>
                <Button 
                  onClick={() => router.push('/complaints')} 
                  variant="outline" 
                  className="w-full justify-start text-xs border-border/85 hover:border-blue-500/35 h-11"
                >
                  <Activity className="h-4 w-4 mr-3 text-blue-500" /> Track complaint resolutions
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Schemes Snapshots */}
            <Card className="lg:col-span-2 border-border/80">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-amber-500" /> {t('recommendedSchemes')}
                </CardTitle>
                <CardDescription>AI-generated programs based on profile match index</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSchemes.slice(0, 2).map((scheme) => (
                  <div 
                    key={scheme.id} 
                    className="p-4 rounded-lg bg-zinc-900/40 dark:bg-zinc-950/40 border border-border flex items-center justify-between hover:border-zinc-700/60 duration-200"
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-foreground">{scheme.title}</span>
                        <Badge variant="default" className="bg-primary/20 text-primary border border-primary/25 hover:bg-primary/25">
                          {scheme.matchPercentage}% Match
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{scheme.description}</p>
                    </div>
                    <Button 
                      onClick={() => router.push('/recommend')} 
                      size="sm" 
                      variant="ghost" 
                      className="shrink-0 text-primary hover:bg-primary/5 hover:text-primary cursor-pointer"
                    >
                      Apply <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Civic Suggestions */}
            <Card hoverable className="border-border/85 bg-radial from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center text-primary">
                  <Sparkles className="h-5 w-5 mr-2" /> {t('aiSuggestions')}
                </CardTitle>
                <CardDescription className="text-primary/70">Proactive localized tips</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs leading-relaxed text-foreground">
                <div className="p-3 rounded-lg border border-primary/10 bg-primary/5 space-y-2">
                  <span className="font-semibold text-primary block">Scheme Opportunity:</span>
                  <p>
                    Based on your profile as a **{profile.occupation}**, you match **88%** on the Freelancer Co-working Space Grant. You could claim **₹10,000/month** in rental waivers.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-amber-500/10 bg-amber-500/5 space-y-2">
                  <span className="font-semibold text-amber-500 block">Civic Alert:</span>
                  <p>
                    Road repairs have commenced on your reported pothole at Janpath Road. Estimated completion is **July 12, 2026**.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Logs */}
            <Card className="lg:col-span-3 border-border/80">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-500" /> {t('recentActivity')}
                </CardTitle>
                <CardDescription>Log of past services actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border/60">
                  {activities.map((act) => (
                    <div key={act.id} className="py-3 flex items-center justify-between text-sm first:pt-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-foreground font-medium">{act.text}</span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{act.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>

      {/* Floating Chat Widget */}
      <CitizenAssistant />
    </div>
  );
}
