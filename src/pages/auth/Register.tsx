import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, BookOpen, UserPlus, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole } from '@/contexts/AuthContext';

const perks = ['Access 500+ premium courses', 'Learn from industry experts', 'Get certified on completion', 'Track your progress'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'student' as UserRole });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast({ title: 'Please fill all fields', variant: 'destructive' }); return; }
    if (form.password !== form.confirm) { toast({ title: 'Passwords do not match', variant: 'destructive' }); return; }
    if (form.password.length < 6) { toast({ title: 'Password must be at least 6 characters', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast({ title: 'Account created!', description: 'Welcome to LMS Academy.' });
      navigate(`/${form.role}`);
    } catch (err: any) {
      toast({ title: 'Registration failed', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 hero-bg flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-md w-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold">LMS Academy</span>
          </div>
          <h2 className="text-4xl font-display font-bold mb-4">Start Learning<br /><span className="text-blue-300">Today for Free</span></h2>
          <p className="text-white/70 mb-10">Join our community of 10,000+ learners and take your skills to the next level.</p>
          <div className="space-y-4">
            {perks.map(perk => (
              <div key={perk} className="flex items-center gap-3 glass rounded-lg p-3">
                <CheckCircle className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <span className="text-white/90 text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold">LMS Academy</span>
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground mt-2">Free forever. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
              <Input id="name" placeholder="John Doe" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="role" className="text-sm font-medium">I am a</Label>
              <Select value={form.role} onValueChange={(val) => setForm({ ...form, role: val as UserRole })}>
                <SelectTrigger className="mt-1.5 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="h-11 pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirm" className="text-sm font-medium">Confirm password</Label>
              <Input id="confirm" type="password" placeholder="Repeat password" value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })} className="mt-1.5 h-11" />
            </div>
            <Button type="submit" className="w-full h-11 font-semibold mt-2" disabled={loading}
              style={{ background: 'var(--gradient-primary)' }}>
              {loading ? 'Creating account...' : (<><UserPlus className="w-4 h-4 mr-2" />Create Account</>)}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By creating an account, you agree to our{' '}
            <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and{' '}
            <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
          </p>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
