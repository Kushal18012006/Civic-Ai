'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/navbar';
import { Sidebar } from '../../components/sidebar';
import { CitizenAssistant } from '../../components/ai/citizen-assistant';
import { useLanguage } from '../../components/language-provider';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { mockComplaints } from '../../services/mock-data';
import { CivicComplaint, ComplaintStatus } from '../../types';
import { Play, CheckCircle2 } from 'lucide-react';

export default function ComplaintsPage() {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState<CivicComplaint[]>(() => {
    let list = [...mockComplaints];
    if (typeof window !== 'undefined') {
      const customRaw = localStorage.getItem('civicai-custom-complaints');
      if (customRaw) {
        const custom = JSON.parse(customRaw);
        list = [...custom, ...list];
      }
    }
    return list;
  });

  const [selectedComplaint, setSelectedComplaint] = useState<CivicComplaint | null>(() => {
    let list = [...mockComplaints];
    if (typeof window !== 'undefined') {
      const customRaw = localStorage.getItem('civicai-custom-complaints');
      if (customRaw) {
        const custom = JSON.parse(customRaw);
        list = [...custom, ...list];
      }
    }
    return list.length > 0 ? list[0] : null;
  });

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'submitted': return <Badge variant="info">Submitted</Badge>;
      case 'under_review': return <Badge variant="warning">Under Review</Badge>;
      case 'officer_assigned': return <Badge variant="warning">Officer Appointed</Badge>;
      case 'in_progress': return <Badge variant="warning">In Progress</Badge>;
      case 'resolved': return <Badge variant="success">Resolved</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Demo utility to advance status stage for hackathon judges
  const handleAdvanceStatus = () => {
    if (!selectedComplaint) return;

    const stages: ComplaintStatus[] = ['submitted', 'under_review', 'officer_assigned', 'in_progress', 'resolved'];
    const currentIndex = stages.indexOf(selectedComplaint.status);
    
    if (currentIndex === -1 || currentIndex === stages.length - 1) {
      alert("This complaint is already fully resolved!");
      return;
    }

    const nextStatus = stages[currentIndex + 1];
    
    // Update locally and in LocalStorage
    const updatedTimelineEvent = {
      status: nextStatus,
      title: nextStatus === 'under_review' ? 'Review Completed' :
             nextStatus === 'officer_assigned' ? 'Officer Appointed' :
             nextStatus === 'in_progress' ? 'Work Commenced' : 'Resolution Confirmed',
      description: nextStatus === 'under_review' ? 'AI category verification and auto-routing finalized.' :
                   nextStatus === 'officer_assigned' ? 'Superintendent officer dispatched to inspect coordinates.' :
                   nextStatus === 'in_progress' ? 'Contractors and repair crews scheduled on-site.' : 'Field crew repair signed off by site supervisor.',
      date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update state lists
    const updatedComplaints = complaints.map(c => {
      if (c.id === selectedComplaint.id) {
        // Only append if it's not already in the timeline
        const hasEvent = c.timeline.some(e => e.status === nextStatus);
        const newTimeline = hasEvent ? c.timeline : [...c.timeline, updatedTimelineEvent];
        return {
          ...c,
          status: nextStatus,
          timeline: newTimeline
        };
      }
      return c;
    });

    setComplaints(updatedComplaints);
    const match = updatedComplaints.find(c => c.id === selectedComplaint.id);
    if (match) {
      setSelectedComplaint(match);
    }

    // Sync back to LocalStorage if it was a custom complaint
    if (typeof window !== 'undefined') {
      const customRaw = localStorage.getItem('civicai-custom-complaints');
      if (customRaw) {
        const custom: CivicComplaint[] = JSON.parse(customRaw);
        const updatedCustom = custom.map(c => {
          if (c.id === selectedComplaint.id) {
            const hasEvent = c.timeline.some(e => e.status === nextStatus);
            return {
              ...c,
              status: nextStatus,
              timeline: hasEvent ? c.timeline : [...c.timeline, updatedTimelineEvent]
            };
          }
          return c;
        });
        localStorage.setItem('civicai-custom-complaints', JSON.stringify(updatedCustom));
      }
    }
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
              Complaint Tracker
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Monitor active repair request statuses and audit tracking histories in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Complaints list */}
            <div className="lg:col-span-1 space-y-4 shrink-0">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Registered Tickets</h2>
              <div className="space-y-3">
                {complaints.map((comp) => {
                  const isSelected = selectedComplaint?.id === comp.id;
                  return (
                    <Card
                      key={comp.id}
                      onClick={() => setSelectedComplaint(comp)}
                      className={`cursor-pointer hover:border-zinc-700/60 duration-200 border-border/80 ${
                        isSelected ? 'border-primary/50 bg-primary/[0.02] shadow-md shadow-primary/5' : ''
                      }`}
                    >
                      <CardContent className="p-4 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[10px] text-zinc-500">{comp.id}</span>
                          {getStatusBadge(comp.status)}
                        </div>
                        <h3 className="font-bold text-foreground text-sm truncate">{comp.title}</h3>
                        <p className="text-muted-foreground line-clamp-1">{comp.location}</p>
                      </CardContent>
                    </Card>
                  );
                })}

                {complaints.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-xs">
                    <p>{t('noComplaints')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Selected complaint tracker timeline details */}
            <div className="lg:col-span-2">
              {selectedComplaint ? (
                <Card className="border-border/80 relative">
                  
                  {/* Demo advance controller button */}
                  <div className="absolute top-4 right-4 z-10">
                    {selectedComplaint.status !== 'resolved' && (
                      <Button
                        onClick={handleAdvanceStatus}
                        variant="outline"
                        size="sm"
                        className="text-[10px] h-8 border-primary/30 hover:bg-primary/5 text-primary font-semibold cursor-pointer"
                      >
                        <Play className="h-3 w-3 mr-1" /> Advance Stage (Demo Simulator)
                      </Button>
                    )}
                  </div>

                  <CardHeader className="border-b border-border/40 pb-4">
                    <div className="flex flex-col space-y-1">
                      <span className="font-mono text-[10px] text-zinc-500 uppercase">Registered Case File ID: {selectedComplaint.id}</span>
                      <CardTitle className="text-xl font-bold text-foreground pr-36">{selectedComplaint.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Location: {selectedComplaint.location}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6 text-xs">
                    
                    {/* Summary */}
                    <div className="space-y-1">
                      <span className="font-bold text-foreground text-[10px] uppercase tracking-wider block">Description of Defect</span>
                      <p className="text-muted-foreground leading-relaxed">{selectedComplaint.description}</p>
                    </div>

                    {/* Meta parameters */}
                    <div className="grid grid-cols-2 gap-4 border-y border-border/50 py-4 font-sans text-xs">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Responsible Department</span>
                        <span className="font-semibold text-foreground block mt-1">{selectedComplaint.department}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Estimated Resolution</span>
                        <span className="font-semibold text-foreground block mt-1">{selectedComplaint.estimatedResolution}</span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4">
                      <span className="font-bold text-foreground text-[10px] uppercase tracking-wider block">Resolution Progress tracking</span>
                      
                      <div className="relative pl-6 border-l border-zinc-800 space-y-6 ml-2 font-sans">
                        
                        {/* Interactive timeline event lists */}
                        {selectedComplaint.timeline.map((event, idx) => (
                          <div key={idx} className="relative">
                            
                            {/* Dot indicator */}
                            <div className="absolute -left-[30px] top-0.5 h-4 w-4 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-foreground text-xs">{event.title}</span>
                                <span className="text-[10px] text-muted-foreground">{event.date}</span>
                              </div>
                              <p className="text-muted-foreground text-xs leading-relaxed">{event.description}</p>
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Suggestions / Mitigations */}
                    {selectedComplaint.aiSuggestions && selectedComplaint.aiSuggestions.length > 0 && (
                      <div className="space-y-2 pt-4 border-t border-border/40">
                        <span className="font-bold text-primary text-[10px] uppercase tracking-wider block">AI Operational Directives</span>
                        <div className="space-y-2 text-zinc-300 leading-relaxed bg-primary/5 p-3 rounded-lg border border-primary/20">
                          {selectedComplaint.aiSuggestions.map((s, idx) => (
                            <div key={idx} className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 shrink-0" />
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12 text-muted-foreground text-xs">
                  <p>Select a complaint ticket from the list to view its tracking history.</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      <CitizenAssistant />
    </div>
  );
}
