import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { Users, Search, Eye, Edit3, Trash2, UserCheck, UserX, Plus, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from('profiles').select('*, user_roles(role)');
      setUsers(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = users.filter(u => {
    const role = u.user_roles?.[0]?.role || 'student';
    return (roleFilter === 'all' || role === roleFilter) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  });

  const studentCount = users.filter(u => (u.user_roles?.[0]?.role || 'student') === 'student').length;
  const teacherCount = users.filter(u => u.user_roles?.[0]?.role === 'teacher').length;

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage all platform users, approve teachers, and block accounts</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><Users className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{users.length}</div><div className="text-xs text-muted-foreground">Total Users</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><UserCheck className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{studentCount}</div><div className="text-xs text-muted-foreground">Students</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-warning)' }}><Shield className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{teacherCount}</div><div className="text-xs text-muted-foreground">Teachers</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-info)' }}><Users className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{users.filter(u => u.user_roles?.[0]?.role === 'admin').length}</div><div className="text-xs text-muted-foreground">Admins</div></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2">
            {['all', 'student', 'teacher', 'admin'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${roleFilter === r ? 'text-white' : 'bg-muted text-muted-foreground'}`}
                style={roleFilter === r ? { background: 'var(--gradient-primary)' } : {}}>
                {r === 'all' ? 'All Roles' : r + 's'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">User</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Role</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Verified</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Joined</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((u: any) => {
                const role = u.user_roles?.[0]?.role || 'student';
                return (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>{u.name?.charAt(0) || '?'}</div>
                        <div><div className="font-medium text-foreground text-xs">{u.name}</div><div className="text-[10px] text-muted-foreground">{u.email}</div></div>
                      </div>
                    </td>
                    <td className="py-3 px-5"><span className={role === 'admin' ? 'badge-info' : role === 'teacher' ? 'badge-warning' : 'badge-primary'}>{role}</span></td>
                    <td className="py-3 px-5"><span className={u.is_verified ? 'badge-success' : 'badge-warning'}>{u.is_verified ? 'Yes' : 'No'}</span></td>
                    <td className="py-3 px-5 text-muted-foreground text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '-'}</td>
                    <td className="py-3 px-5">
                      <div className="flex gap-1">
                        <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No users found.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
