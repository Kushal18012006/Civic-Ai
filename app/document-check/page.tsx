'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/navbar';
import { Sidebar } from '../../components/sidebar';
import { CitizenAssistant } from '../../components/ai/citizen-assistant';
import { getAuthClient } from '../../lib/supabase';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select } from '../../components/ui/select';
import { mockProfile } from '../../services/mock-data';
import { FileUp, CheckCircle2, AlertCircle, RefreshCw, FileCheck2, ShieldAlert } from 'lucide-react';

interface DocVerificationReport {
  verified: boolean;
  extractedName?: string;
  issueDate?: string;
  expiryStatus?: string;
  checklist: string[];
  aiFeedback: string;
}

export default function DocumentCheckPage() {
  const [userName, setUserName] = useState(mockProfile.name);
  const [docType, setDocType] = useState('Proof of Address (Utility Bill)');
  const [serviceTitle, setServiceTitle] = useState('Fresh Passport Application');
  
  // File upload simulator states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  
  // Verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<DocVerificationReport | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const auth = getAuthClient();
      const { data: { user } } = await auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.name || mockProfile.name);
      }
    };
    fetchUser();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setVerificationResult(null);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress bar
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Auto start verification
          runAIVerification(file.name);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const runAIVerification = async (uploadedFileName: string) => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType,
          fileName: uploadedFileName,
          serviceTitle,
          userName
        })
      });
      const data = await res.json();
      setVerificationResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  // Mock template upload handlers for the hackathon judges
  const handleTriggerDemoUpload = (type: 'valid' | 'invalid') => {
    const name = type === 'valid' ? 'utility_bill_oak_st.pdf' : 'low_res_watermark_error.tiff';
    setFileName(name);
    setVerificationResult(null);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          runAIVerification(name);
          return 100;
        }
        return prev + 25;
      });
    }, 100);
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
              AI Document Assistant
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Verify credentials and identify address proofs, dates, or format mismatches before filing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Parameters Selection Card */}
            <Card className="border-border/80 lg:col-span-1 shrink-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground font-sans">Verification Pipeline</CardTitle>
                <CardDescription>Configure the service checklist model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs font-sans">
                
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Target Government Service</label>
                  <Select
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    className="bg-zinc-900/40 border-border text-foreground"
                  >
                    <option value="Fresh Passport Application">Fresh Passport Application</option>
                    <option value="Permanent Driving License">Permanent Driving License</option>
                    <option value="National Higher Education Scholarship">National Higher Education Scholarship</option>
                    <option value="Community & Caste Certificate">Community & Caste Certificate</option>
                    <option value="Old Age Pension Scheme">Old Age Pension Scheme</option>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Document Classification</label>
                  <Select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="bg-zinc-900/40 border-border text-foreground"
                  >
                    <option value="Proof of Address (Utility Bill)">Proof of Address (Utility Bill)</option>
                    <option value="Proof of Identity (Aadhaar/National ID)">Proof of Identity (Aadhaar/National ID)</option>
                    <option value="Proof of Date of Birth (Birth Certificate)">Proof of Date of Birth (Birth Certificate)</option>
                    <option value="Income Certificate">Income Certificate</option>
                    <option value="Matriculation/Graduation Marksheet">Matriculation/Graduation Marksheet</option>
                  </Select>
                </div>

                <div className="pt-4 border-t border-border/40 space-y-2">
                  <span className="font-semibold text-zinc-400 block mb-1">Judge Demonstration Hacks:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleTriggerDemoUpload('valid')}
                      variant="outline"
                      className="text-[10px] h-9 border-emerald-500/30 hover:bg-emerald-500/5 text-emerald-500 font-semibold cursor-pointer"
                    >
                      Upload Valid PDF
                    </Button>
                    <Button
                      onClick={() => handleTriggerDemoUpload('invalid')}
                      variant="outline"
                      className="text-[10px] h-9 border-destructive/30 hover:bg-destructive/5 text-destructive font-semibold cursor-pointer"
                    >
                      Upload Bad Tiff
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Main Upload Box & Verification Results */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* File Uploader */}
              <Card className="border-border/80 border-dashed bg-zinc-900/10 dark:bg-zinc-950/10 p-8 flex flex-col items-center justify-center text-center relative hover:bg-zinc-900/20 dark:hover:bg-zinc-900/10 duration-200 transition-colors">
                <input
                  type="file"
                  id="doc-uploader"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isUploading || isVerifying}
                />
                
                <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                  <FileUp className="h-8 w-8 animate-pulse" />
                </div>
                
                <h3 className="font-bold text-foreground text-sm">Drag & drop your files here</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">Supports PDF, JPG, or PNG files up to 10MB</p>
                
                <Button size="sm" className="pointer-events-none cursor-pointer">
                  Select File from Device
                </Button>
              </Card>

              {/* Uploading progress indicator */}
              {isUploading && (
                <Card className="border-border/80 p-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-foreground">Uploading: {fileName}</span>
                      <span className="text-primary">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all duration-150" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* AI Verification Loading */}
              {isVerifying && (
                <Card className="border-border/80 p-6 flex flex-col items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin mb-3" />
                  <h3 className="font-bold text-foreground text-sm">AI Completeness Check In Progress</h3>
                  <p className="text-xs text-muted-foreground mt-1">Executing optical character alignment scan...</p>
                </Card>
              )}

              {/* AI Verification result output */}
              {verificationResult && (
                <Card className="border-border/80 overflow-hidden relative">
                  <div className={`absolute top-0 left-0 right-0 h-[3px] ${
                    verificationResult.verified ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <FileCheck2 className={`h-5 w-5 ${verificationResult.verified ? 'text-emerald-500' : 'text-rose-500'}`} />
                        <CardTitle className="text-base font-bold text-foreground">AI Verification Report</CardTitle>
                      </div>
                      <Badge variant={verificationResult.verified ? 'success' : 'destructive'} className="px-2 py-0.5 text-xs font-semibold">
                        {verificationResult.verified ? 'Verified & Complete' : 'Verification Issue'}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">File analyzed: {fileName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4 border-t border-border/40 mt-2 text-xs">
                    
                    {/* Feedback message banner */}
                    <div className={`p-4 rounded-lg border flex items-start space-x-3 ${
                      verificationResult.verified 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-destructive/5 border-destructive/20 text-destructive'
                    }`}>
                      {verificationResult.verified ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                      ) : (
                        <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold text-xs">AI Audit Response</span>
                        <p className="text-[11px] leading-relaxed mt-0.5">{verificationResult.aiFeedback}</p>
                      </div>
                    </div>

                    {/* Check item list */}
                    <div className="space-y-2.5">
                      <span className="font-bold text-foreground text-[10px] uppercase block tracking-wider">AI Checklists verified</span>
                      <div className="space-y-2 text-muted-foreground leading-relaxed">
                        {verificationResult.checklist.map((item: string, i: number) => {
                          const isError = item.toLowerCase().includes('error') || item.toLowerCase().includes('invalid');
                          return (
                            <div key={i} className="flex items-start">
                              {isError ? (
                                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mr-2.5" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mr-2.5" />
                              )}
                              <span>{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Metadata details extracted */}
                    {verificationResult.verified && (
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/40 text-[11px] font-sans">
                        <div>
                          <span className="text-muted-foreground font-semibold block uppercase text-[9px]">Extracted Name</span>
                          <span className="font-medium text-foreground">{verificationResult.extractedName}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground font-semibold block uppercase text-[9px]">Issue Date</span>
                          <span className="font-medium text-foreground">{verificationResult.issueDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground font-semibold block uppercase text-[9px]">Expiry Status</span>
                          <span className="font-medium text-foreground">{verificationResult.expiryStatus}</span>
                        </div>
                      </div>
                    )}

                  </CardContent>
                </Card>
              )}

            </div>

          </div>
        </main>
      </div>

      <CitizenAssistant />
    </div>
  );
}
