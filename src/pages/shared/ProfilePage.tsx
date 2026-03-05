import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Camera, Save, Shield, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ name: form.name, phone: form.phone }).eq('user_id', user.id);
    setSaving(false);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `avatars/${user.id}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('uploads').upload(path, file, { upsert: true });
    if (uploadError) { toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(path);
    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('user_id', user.id);
    setUploading(false);
    toast({ title: 'Avatar updated!' });
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword.length < 6) { toast({ title: 'Password too short', description: 'Minimum 6 characters', variant: 'destructive' }); return; }
    if (passwords.newPassword !== passwords.confirmPassword) { toast({ title: 'Passwords do not match', variant: 'destructive' }); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
    setSaving(false);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Password updated!' });
    setPasswords({ newPassword: '', confirmPassword: '' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your profile and preferences</p>
        </div>

        {/* Avatar */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/20">
                {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>{user?.name?.charAt(0)}</div>}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer" style={{ background: 'var(--gradient-primary)' }}>
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            </div>
            <div>
              <div className="font-display font-bold text-foreground text-xl">{user?.name}</div>
              <div className="text-muted-foreground text-sm capitalize">{user?.role} · {user?.email}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {[{ id: 'profile', label: 'Profile', icon: Camera }, { id: 'security', label: 'Security', icon: Shield }].map(({ id, label, icon: Icon }) => (
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
              <div><Label className="text-sm font-medium">Email Address</Label><Input type="email" value={form.email} disabled className="mt-1.5 bg-muted" /></div>
              <div><Label className="text-sm font-medium">Phone Number</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1.5" /></div>
              <div><Label className="text-sm font-medium">Role</Label><Input value={user?.role} disabled className="mt-1.5 capitalize bg-muted" /></div>
            </div>
            <Button onClick={handleSave} disabled={saving} style={{ background: 'var(--gradient-primary)' }} className="font-semibold">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save Changes
            </Button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-display font-semibold text-foreground">Change Password</h2>
            <div><Label className="text-sm font-medium">New Password</Label><Input type="password" placeholder="••••••••" value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} className="mt-1.5" /></div>
            <div><Label className="text-sm font-medium">Confirm New Password</Label><Input type="password" placeholder="••••••••" value={passwords.confirmPassword} onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="mt-1.5" /></div>
            <Button onClick={handlePasswordChange} disabled={saving} style={{ background: 'var(--gradient-primary)' }} className="font-semibold">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}Update Password
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
