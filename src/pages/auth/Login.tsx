import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, BookOpen, LogIn, Phone, Mail } from 'lucide-react';
import { lovable } from '@/integrations/lovable/index';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';

type AuthMode = 'email' | 'phone';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('email');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'teacher') navigate('/teacher', { replace: true });
      else navigate('/student', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast({ title: 'Please fill all fields', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      toast({ title: 'Welcome back!' });
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleSendOtp = async () => {
    if (!phone) { toast({ title: 'Please enter your phone number', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw new Error(error.message);
      setOtpSent(true);
      toast({ title: 'OTP sent!', description: 'Check your phone for the verification code.' });
    } catch (err: any) {
      toast({ title: 'Failed to send OTP', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) { toast({ title: 'Please enter the OTP', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
      if (error) throw new Error(error.message);
      toast({ title: 'Welcome back!' });
    } catch (err: any) {
      toast({ title: 'Verification failed', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
    } catch (err: any) {
      toast({ title: 'Google sign-in failed', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth('apple', {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
    } catch (err: any) {
      toast({ title: 'Apple sign-in failed', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-bg flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white/20"
              style={{ width: `${(i + 1) * 120}px`, height: `${(i + 1) * 120}px`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          ))}
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold">OneAcademy</span>
          </div>
          <h2 className="text-4xl font-display font-bold mb-4 leading-tight">
            Transform Your<br /><span className="text-blue-300">Learning Journey</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Join thousands of students and educators on our world-class learning management platform.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[['10K+', 'Students'], ['500+', 'Courses'], ['98%', 'Satisfaction']].map(([num, label]) => (
              <div key={label} className="glass rounded-xl p-4">
                <div className="text-2xl font-display font-bold text-blue-300">{num}</div>
                <div className="text-sm text-white/60 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">OneAcademy</span>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-display font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          {/* Social Sign-In Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Button variant="outline" className="h-11 font-medium gap-2" onClick={handleGoogleSignIn} disabled={loading}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="h-11 font-medium gap-2" onClick={handleAppleSignIn} disabled={loading}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </Button>
          </div>

          <div className="relative my-5">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
              or continue with
            </span>
          </div>

          {/* Auth Mode Tabs */}
          <div className="flex bg-muted rounded-lg p-1 mb-5">
            <button
              onClick={() => { setAuthMode('email'); setOtpSent(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${authMode === 'email' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
            <button
              onClick={() => setAuthMode('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${authMode === 'phone' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              <Phone className="w-4 h-4" /> Phone
            </button>
          </div>

          {authMode === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} className="mt-1.5 h-11" />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative mt-1.5">
                  <Input id="password" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} className="h-11 pr-11" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}
                style={{ background: 'var(--gradient-primary)' }}>
                {loading ? 'Signing in...' : (<><LogIn className="w-4 h-4 mr-2" />Sign In</>)}
              </Button>
            </form>
          ) : (
            <form onSubmit={otpSent ? handleVerifyOtp : (e) => { e.preventDefault(); handleSendOtp(); }} className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Phone number</Label>
                <Input id="phone" type="tel" placeholder="+91 9876543210" value={phone}
                  onChange={e => setPhone(e.target.value)} className="mt-1.5 h-11" disabled={otpSent} />
              </div>
              {otpSent && (
                <div>
                  <Label htmlFor="otp" className="text-sm font-medium">Verification code</Label>
                  <Input id="otp" type="text" placeholder="Enter 6-digit OTP" value={otp}
                    onChange={e => setOtp(e.target.value)} className="mt-1.5 h-11" maxLength={6} />
                </div>
              )}
              <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}
                style={{ background: 'var(--gradient-primary)' }}>
                {loading ? 'Please wait...' : otpSent ? (<><LogIn className="w-4 h-4 mr-2" />Verify & Sign In</>) : (<><Phone className="w-4 h-4 mr-2" />Send OTP</>)}
              </Button>
              {otpSent && (
                <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground">
                  Change phone number
                </button>
              )}
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Create account</Link>
          </p>
          <p className="text-center text-sm text-muted-foreground mt-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
