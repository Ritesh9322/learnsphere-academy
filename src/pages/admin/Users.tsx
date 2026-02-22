import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, Search, Eye, Edit3, Trash2, UserCheck, UserX, Plus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const users = [
  { id: 1, name: 'Rahul Verma', email: 'rahul@email.com', role: 'student', status: 'active', joined: '2024-01-10', courses: 3 },
  { id: 2, name: 'Dr. Priya Sharma', email: 'priya@email.com', role: 'teacher', status: 'active', joined: '2023-07-15', courses: 3 },
  { id: 3, name: 'Neha Reddy', email: 'neha@email.com', role: 'student', status: 'active', joined: '2024-02-05', courses: 2 },
  { id: 4, name: 'Mr. Vikram Singh', email: 'vikram@email.com', role: 'teacher', status: 'active', joined: '2023-08-20', courses: 2 },
  { id: 5, name: 'Aditya Bose', email: 'aditya@email.com', role: 'student', status: 'blocked', joined: '2024-01-22', courses: 1 },
  { id: 6, name: 'Kavya Patel', email: 'kavya@email.com', role: 'student', status: 'active', joined: '2024-03-01', courses: 4 },
  { id: 7, name: 'Arjun Nair', email: 'arjun@email.com', role: 'student', status: 'active', joined: '2024-02-15', courses: 2 },
  { id: 8, name: 'Ms. Sneha Gupta', email: 'sneha@email.com', role: 'teacher', status: 'pending', joined: '2024-03-10', courses: 0 },
];

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const filtered = users.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage all platform users, approve teachers, and block accounts</p>
          </div>
          <Button style={{ background: 'var(--gradient-primary)' }} className="font-semibold"><Plus className="w-4 h-4 mr-2" />Add User</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><Users className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{users.length}</div><div className="text-xs text-muted-foreground">Total Users</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><UserCheck className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{users.filter(u => u.role === 'student').length}</div><div className="text-xs text-muted-foreground">Students</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-warning)' }}><Shield className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{users.filter(u => u.role === 'teacher').length}</div><div className="text-xs text-muted-foreground">Teachers</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--destructive)/0.15)' }}><UserX className="w-5 h-5" style={{ color: 'hsl(var(--destructive))' }} /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{users.filter(u => u.status === 'blocked').length}</div><div className="text-xs text-muted-foreground">Blocked</div></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2">
            {['all', 'student', 'teacher'].map(r => (
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
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Status</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Joined</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Courses</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>{u.name.charAt(0)}</div>
                      <div><div className="font-medium text-foreground text-xs">{u.name}</div><div className="text-[10px] text-muted-foreground">{u.email}</div></div>
                    </div>
                  </td>
                  <td className="py-3 px-5"><span className={u.role === 'teacher' ? 'badge-warning' : 'badge-info'}>{u.role}</span></td>
                  <td className="py-3 px-5"><span className={u.status === 'active' ? 'badge-success' : u.status === 'pending' ? 'badge-warning' : 'badge-primary'} style={u.status === 'blocked' ? { background: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))' } : {}}>{u.status}</span></td>
                  <td className="py-3 px-5 text-muted-foreground text-xs">{new Date(u.joined).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 px-5 text-muted-foreground text-center">{u.courses}</td>
                  <td className="py-3 px-5">
                    <div className="flex gap-1">
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
