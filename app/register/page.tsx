'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthClient } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { ShieldAlert, User, Mail, Lock, Briefcase, IndianRupee, Calendar, MapPin, GraduationCap } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('26');
  const [occupation, setOccupation] = useState('Freelance Software Developer');
  const [income, setIncome] = useState('200000');
  const [location, setLocation] = useState('Metropolis City, Ward 12');
  const [education, setEducation] = useState('Bachelor of Science in Computer Science');

  useEffect(() => {
    const checkUser = async () => {
      const auth = getAuthClient();
      const { data: { session } } = await auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !age || !income || !occupation) {
      setError("Please fill in all required fields.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const auth = getAuthClient();
      const { error: authError } = await auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            age: parseInt(age),
            occupation,
            income: parseFloat(income),
            location,
            education,
            language: 'en'
          }
        }
      });

      if (authError) {
        setError(authError.message);
      } else {
        // Successful signup logs the user in automatically in mock mode
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-radial from-zinc-900 to-black py-12 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
            <span>CivicAI</span>
          </div>
          <p className="text-zinc-400 text-sm mt-1">Smart Government Citizen Companion</p>
        </div>

        <Card className="glass border-zinc-800/80 bg-zinc-950/80 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-zinc-100">Create Citizen Profile</CardTitle>
            <CardDescription className="text-center text-zinc-400 font-sans">
              Enter your credentials to construct a custom scheme compatibility index
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center space-x-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Account Details */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                      type="text"
                      placeholder="Alex Mercer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-primary focus-visible:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                      type="email"
                      placeholder="alex.mercer@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-primary focus-visible:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Password</label>
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

                {/* Profiling Details */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                      type="number"
                      placeholder="26"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-primary focus-visible:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Occupation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                      type="text"
                      placeholder="Freelancer, Student, Retired..."
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-primary focus-visible:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Annual Income (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                      type="number"
                      placeholder="200000"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-primary focus-visible:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Location / Ward</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                      type="text"
                      placeholder="Metropolis City, Ward 12"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-primary focus-visible:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Education Level</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Select
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-primary focus-visible:border-primary/50"
                    >
                      <option value="High School Graduate">High School Graduate</option>
                      <option value="Associate Degree">Associate Degree</option>
                      <option value="Bachelor of Science in Computer Science">Bachelor&apos;s Degree</option>
                      <option value="Master of Business Administration">Master&apos;s Degree</option>
                      <option value="Doctor of Philosophy">PhD / Doctorate</option>
                      <option value="Other">Other / None</option>
                    </Select>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-4 h-11 text-base shadow-lg cursor-pointer"
                isLoading={isLoading}
              >
                Create Account & Proceed
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-zinc-800/40 pt-4">
            <p className="text-xs text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
