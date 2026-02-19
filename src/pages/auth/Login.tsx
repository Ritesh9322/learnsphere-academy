import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, BookOpen, LogIn } from 'lucide-react';

const demoAccounts = [
  { role: 'Admin', email: 'admin@lmsacademy.com', password: 'admin123', color: 'text-destructive' },
  { role: 'Teacher', email: 'teacher@lmsacademy.com', password: 'teacher123', color: 'text-warning' },
  { role: 'Student', email: 'student@lmsacademy.com', password: 'student123', color: 'text-success' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast({ title: 'Please fill all fields', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      await login(email, password);
      const stored = localStorage.getItem('lms_user');
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role === 'admin') navigate('/admin');
      else if (user?.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const quickLogin = async (email: string, password: string) => {
    setEmail(email); setPassword(password);
    setLoading(true);
    try {
      await login(email, password);
      const stored = localStorage.getItem('lms_user');
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role === 'admin') navigate('/admin');
      else if (user?.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch { } finally { setLoading(false); }
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
            <span className="text-2xl font-display font-bold">LMS Academy</span>
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
            <span className="text-xl font-display font-bold text-foreground">LMS Academy</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          {/* Demo Accounts */}
          <div className="mb-6 p-4 bg-accent rounded-xl border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Quick Demo Login</p>
            <div className="flex gap-2 flex-wrap">
              {demoAccounts.map(({ role, email, password, color }) => (
                <button key={role} onClick={() => quickLogin(email, password)}
                  className={`text-xs px-3 py-1.5 rounded-lg border border-border bg-card hover:shadow-sm transition-all font-medium ${color}`}>
                  {role}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} className="mt-1.5 h-11" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
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
