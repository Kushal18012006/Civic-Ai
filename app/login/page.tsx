'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthClient } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const auth = getAuthClient();
      const { data: { session } } = await auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const auth = getAuthClient();
      const { error: authError } = await auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick autofill helper for the judges/hackathon demo
  const handleDemoAutofill = () => {
    setEmail('kushal.tripathi@civicai.gov');
    setPassword('demopass123');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-radial from-zinc-900 to-black p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Logo and branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
            <span>CivicAI</span>
          </div>
          <p className="text-zinc-400 text-sm mt-1">Smart Government Citizen Companion</p>
        </div>

        <Card className="glass border-zinc-800/80 bg-zinc-950/80 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-zinc-100">Welcome Back</CardTitle>
            <CardDescription className="text-center text-zinc-400">
              Sign in to manage your digital services profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center space-x-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-primary focus-visible:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-primary focus-visible:border-primary/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-2 h-11 text-base shadow-lg cursor-pointer"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-zinc-800/40 pt-4">
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-zinc-500">Demo Account?</span>
              <button
                onClick={handleDemoAutofill}
                className="text-primary font-semibold hover:underline cursor-pointer focus:outline-none"
              >
                Autofill Demo Credentials
              </button>
            </div>
            <p className="text-xs text-center text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-semibold">
                Sign Up & Profile Creation
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
