'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/navbar';
import { Sidebar } from '../../components/sidebar';
import { CitizenAssistant } from '../../components/ai/citizen-assistant';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { MapPin, Camera, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export default function ReportIssuePage() {
  const router = useRouter();
  
  // Form states
  const [category, setCategory] = useState('road_damage');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Janpath Crossing, Connaught Place, New Delhi');
  const [coordinates, setCoordinates] = useState('Latitude: 28.6139, Longitude: 77.2090');
  
  // Custom Map Interactive Grid selection state
  const [markerPos, setMarkerPos] = useState<{ x: number; y: number } | null>({ x: 120, y: 80 });

  // Mock Photo state
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [photoName, setPhotoName] = useState<string | null>(null);

  // AI Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [formalTitle, setFormalTitle] = useState('');
  const [formalSummary, setFormalSummary] = useState('');
  const [routedDepartment, setRoutedDepartment] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMarkerPos({ x, y });
    
    // Simulate Indian coordinates based on click position
    const lat = (28.6130 + (y / 10000)).toFixed(4);
    const lng = (77.2090 + (x / 10000)).toFixed(4);
    setCoordinates(`Latitude: ${lat}, Longitude: ${lng}`);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      setPhotoUploaded(true);
    }
  };

  const handleAutoGenerateAI = async () => {
    if (!description) {
      alert("Please enter a brief description first so the AI has context to summarize.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description,
          location: locationName
        })
      });
      const data = await res.json();
      
      setFormalTitle(data.formalTitle);
      setFormalSummary(data.formalSummary);
      setRoutedDepartment(data.department);
      setAiSuggestions(data.aiSuggestions || []);
      setHasGenerated(true);
    } catch (err) {
      console.error(err);
      // Fallback
      setFormalTitle("Civic Maintenance Ticket");
      setFormalSummary(`Municipal maintenance ticket logged for local sector: ${description}`);
      setRoutedDepartment("Department of Civil Works");
      setAiSuggestions(["Deploy safety markers", "Inform site supervisor"]);
      setHasGenerated(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !locationName) {
      alert("Please fill in location and description.");
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800)); // Latency feel

    // Add new complaint details into LocalStorage
    const newComplaint = {
      id: "comp-" + Math.floor(100 + Math.random() * 900),
      title: hasGenerated ? formalTitle : `Reported ${category.replace('_', ' ')}`,
      category,
      description: hasGenerated ? formalSummary : description,
      status: "submitted",
      createdAt: new Date().toISOString(),
      location: locationName,
      department: hasGenerated ? routedDepartment : "General Public Works",
      estimatedResolution: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timeline: [
        { status: "submitted", title: "Complaint Filed", description: "Successfully registered and queued for review.", date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ],
      aiSuggestions: hasGenerated ? aiSuggestions : ["Verify coordinates", "Assign site inspect crew"]
    };

    // Save to LocalStorage
    if (typeof window !== 'undefined') {
      const storedRaw = localStorage.getItem('civicai-custom-complaints');
      const stored = storedRaw ? JSON.parse(storedRaw) : [];
      stored.unshift(newComplaint);
      localStorage.setItem('civicai-custom-complaints', JSON.stringify(stored));
    }

    setIsSubmitting(false);
    router.push('/complaints');
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
              Report Civic Issue
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              File local reports for road damage, utility leaks, or sanitation issues. Use AI routing to speed up response times.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Interactive Vector Map Grid (Custom styling) */}
            <Card className="border-border/80 lg:col-span-1 shrink-0 overflow-hidden">
              <CardHeader className="pb-3 bg-zinc-900/40 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground flex items-center">
                  <MapPin className="h-4.5 w-4.5 mr-2 text-primary" /> Stylized Interactive Location Map
                </CardTitle>
                <CardDescription className="text-[11px]">Click on the vector grid to place coordinate pin</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* SVG stylized grid */}
                <div className="relative w-full h-[220px] bg-zinc-950 flex items-center justify-center select-none overflow-hidden">
                  <svg 
                    className="w-full h-full cursor-crosshair bg-grid-zinc-900" 
                    onClick={handleMapClick}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Radial background grids */}
                    <circle cx="150" cy="110" r="100" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <circle cx="150" cy="110" r="60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    
                    {/* Simulated street layouts */}
                    <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                    <line x1="120" y1="0" x2="120" y2="220" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                    <line x1="0" y1="160" x2="300" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                    <line x1="220" y1="0" x2="220" y2="220" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />

                    {/* Styled grid text */}
                    <text x="10" y="20" fill="rgba(255,255,255,0.15)" fontSize="8" fontFamily="monospace">SECTOR 12 GRID</text>
                    <text x="130" y="75" fill="rgba(99,102,241,0.4)" fontSize="7" fontFamily="sans-serif">Janpath Rd.</text>
                    <text x="125" y="195" fill="rgba(99,102,241,0.4)" fontSize="7" fontFamily="sans-serif">Tolstoy Marg</text>

                    {/* Interactive Marker Pin */}
                    {markerPos && (
                      <g transform={`translate(${markerPos.x - 10}, ${markerPos.y - 20})`} className="animate-bounce">
                        <path 
                          d="M10 0C4.48 0 0 4.48 0 10C0 17.5 10 28 10 28C10 28 20 17.5 20 10C20 4.48 15.52 0 10 0ZM10 13.5C8.07 13.5 6.5 11.93 6.5 10C6.5 8.07 8.07 6.5 10 6.5C11.93 6.5 13.5 8.07 13.5 10C13.5 11.93 11.93 13.5 10 13.5Z" 
                          fill="#8B5CF6"
                        />
                        <circle cx="10" cy="10" r="3.5" fill="#ffffff" />
                      </g>
                    )}
                  </svg>
                </div>
                
                {/* Coordinates output block */}
                <div className="p-4 bg-zinc-900/30 border-t border-border/40 space-y-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase">Extracted Map coordinates</span>
                    <Input 
                      readOnly 
                      value={coordinates} 
                      className="bg-zinc-950 border-border text-muted-foreground font-mono text-[10px] h-8 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase">Address/Colony Location</span>
                    <Input 
                      value={locationName} 
                      onChange={(e) => setLocationName(e.target.value)} 
                      className="bg-zinc-950 border-border text-foreground text-xs h-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complaint Form & AI Generator Output */}
            <div className="lg:col-span-2 space-y-6">
              
              <Card className="border-border/80">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Category */}
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-300">Complaint Category</label>
                        <Select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="bg-zinc-900/40 border-border text-foreground text-xs"
                        >
                          <option value="road_damage">Road Damage / Potholes</option>
                          <option value="garbage">Overflowing Garbage / Sanitation</option>
                          <option value="water_leakage">Water Pipeline Leakage / Drainage</option>
                          <option value="street_lights">Street Lights Outage</option>
                          <option value="traffic">Traffic Congestion Block</option>
                          <option value="cleanliness">Public Cleansing</option>
                          <option value="dumping">Illegal Waste Dumping</option>
                        </Select>
                      </div>

                      {/* Photo Uploader */}
                      <div className="space-y-1">
                        <label className="font-semibold text-zinc-300">Attach Photo (Optional)</label>
                        <div className="relative flex items-center h-10 border border-border rounded-lg bg-zinc-900/40 px-3 cursor-pointer hover:border-zinc-800">
                          <input
                            type="file"
                            onChange={handlePhotoUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                          />
                          <Camera className="h-4.5 w-4.5 text-zinc-500 mr-2 shrink-0" />
                          <span className="text-zinc-500 truncate select-none">
                            {photoUploaded ? photoName : "Tap to simulate photo snap..."}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Raw description */}
                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-300">Describe the Issue (Natural Language)</label>
                      <Textarea
                        placeholder="Provide details (e.g. 'pothole is on the left turn lane of Janpath road crossing, about 5 inches deep, rainwater filled...')"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-zinc-900/40 border-border text-foreground text-xs min-h-[90px]"
                      />
                    </div>

                    {/* AI Generate Button */}
                    <Button
                      type="button"
                      onClick={handleAutoGenerateAI}
                      variant="outline"
                      className="w-full border-primary/30 hover:bg-primary/5 text-primary text-xs font-semibold cursor-pointer h-10"
                      isLoading={isGenerating}
                    >
                      <Sparkles className="h-4 w-4 mr-2" /> Auto-Generate Complaint & Route Using Gemini AI
                    </Button>

                    {/* AI Generation output layout */}
                    {hasGenerated && (
                      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4 animate-fadeIn">
                        
                        <div className="flex items-center space-x-2 pb-2 border-b border-primary/10">
                          <Sparkles className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-bold text-primary text-xs uppercase tracking-wider">AI Classification Output</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">AI Generated Title</span>
                            <Input 
                              value={formalTitle} 
                              onChange={(e) => setFormalTitle(e.target.value)} 
                              className="bg-zinc-950 border-border text-foreground text-xs h-8 font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Auto-Detected Department</span>
                            <Badge variant="secondary" className="bg-primary/20 text-primary border border-primary/25 text-xs py-1 px-3 mt-1.5 inline-block">
                              {routedDepartment}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase">AI Formulated Municipal Text</span>
                          <Textarea 
                            value={formalSummary} 
                            onChange={(e) => setFormalSummary(e.target.value)} 
                            className="bg-zinc-950 border-border text-zinc-300 text-xs min-h-[80px]"
                          />
                        </div>

                        {/* Safety Tips */}
                        <div className="space-y-2 pt-2 border-t border-primary/10">
                          <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">AI Safety & Mitigation Tips</span>
                          <div className="space-y-1.5 text-zinc-400">
                            {aiSuggestions.map((tip, idx) => (
                              <div key={idx} className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 shrink-0" />
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Submit ticket */}
                    <Button
                      type="submit"
                      className="w-full mt-4 h-11 text-sm shadow-lg shadow-primary/10 cursor-pointer"
                      isLoading={isSubmitting}
                    >
                      <Send className="h-4 w-4 mr-2" /> Dispatch Complaint to Department
                    </Button>

                  </form>
                </CardContent>
              </Card>

            </div>

          </div>
        </main>
      </div>

      <CitizenAssistant />
    </div>
  );
}
