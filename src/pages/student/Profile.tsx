import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Camera, Save, Shield, Bell } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', bio: 'Passionate learner, always seeking to grow and improve.' });
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  const handleSave = () => toast({ title: 'Profile updated', description: 'Your changes have been saved.' });

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your profile and preferences</p>
        </div>

        {/* Avatar Section */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/20">
                {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>{user?.name?.charAt(0)}</div>}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md" style={{ background: 'var(--gradient-primary)' }}>
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <div className="font-display font-bold text-foreground text-xl">{user?.name}</div>
              <div className="text-muted-foreground text-sm capitalize">{user?.role} · {user?.email}</div>
              <div className="badge-success mt-2 text-xs">Verified Account</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {[{ id: 'profile', label: 'Profile', icon: Camera }, { id: 'security', label: 'Security', icon: Shield }, { id: 'notifications', label: 'Notifications', icon: Bell }].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${activeTab === id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-display font-semibold text-foreground">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label className="text-sm font-medium">Full Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
              <div><Label className="text-sm font-medium">Email Address</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1.5" /></div>
              <div><Label className="text-sm font-medium">Phone Number</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1.5" /></div>
              <div><Label className="text-sm font-medium">Role</Label><Input value={user?.role} disabled className="mt-1.5 capitalize bg-muted" /></div>
            </div>
            <div><Label className="text-sm font-medium">Bio</Label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <Button onClick={handleSave} style={{ background: 'var(--gradient-primary)' }} className="font-semibold"><Save className="w-4 h-4 mr-2" />Save Changes</Button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-display font-semibold text-foreground">Change Password</h2>
            <div><Label className="text-sm font-medium">Current Password</Label><Input type="password" placeholder="••••••••" className="mt-1.5" /></div>
            <div><Label className="text-sm font-medium">New Password</Label><Input type="password" placeholder="••••••••" className="mt-1.5" /></div>
            <div><Label className="text-sm font-medium">Confirm New Password</Label><Input type="password" placeholder="••••••••" className="mt-1.5" /></div>
            <Button onClick={() => toast({ title: 'Password updated!' })} style={{ background: 'var(--gradient-primary)' }} className="font-semibold"><Shield className="w-4 h-4 mr-2" />Update Password</Button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-display font-semibold text-foreground">Notification Preferences</h2>
            {[
              ['Email Notifications', 'Receive updates via email'],
              ['Assignment Reminders', 'Get reminded before deadlines'],
              ['Quiz Availability', 'Notify when new quizzes are available'],
              ['Grade Updates', 'Notify when assignments are graded'],
              ['Course Announcements', 'Receive instructor announcements'],
            ].map(([label, desc]) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div><div className="font-medium text-foreground text-sm">{label}</div><div className="text-xs text-muted-foreground">{desc}</div></div>
                <button className="w-10 h-5 rounded-full relative transition-colors" style={{ background: 'var(--gradient-primary)' }}>
                  <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
