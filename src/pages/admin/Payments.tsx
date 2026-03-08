import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, DollarSign, TrendingUp, Search, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

export default function AdminPayments() {
  const [search, setSearch] = useState('');
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from('payments').select('*, courses(title), profiles:student_id(name, email)').order('paid_at', { ascending: false });
      setPayments(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const totalRevenue = payments.filter(p => p.status === 'completed' || p.status === 'paid').reduce((s, p) => s + Number(p.amount || 0), 0);

  // Revenue by month
  const revenueMap: Record<string, number> = {};
  payments.filter(p => p.status === 'completed' || p.status === 'paid').forEach(p => {
    const d = new Date(p.paid_at);
    const key = d.toLocaleDateString('en-US', { month: 'short' });
    revenueMap[key] = (revenueMap[key] || 0) + Number(p.amount || 0);
  });
  const revenueData = Object.entries(revenueMap).slice(-7).map(([month, revenue]) => ({ month, revenue }));

  const filtered = payments.filter(p =>
    (p.courses?.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.payment_id || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.profiles?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Payment Management</h1>
            <p className="text-muted-foreground text-sm mt-1">Track all platform transactions and revenue</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><DollarSign className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">₹{totalRevenue > 100000 ? (totalRevenue / 100000).toFixed(1) + 'L' : totalRevenue.toLocaleString()}</div><div className="text-xs text-muted-foreground">Total Revenue</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><CreditCard className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{payments.filter(p => p.status === 'completed' || p.status === 'paid').length}</div><div className="text-xs text-muted-foreground">Successful</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-warning)' }}><CreditCard className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{payments.filter(p => p.status === 'pending').length}</div><div className="text-xs text-muted-foreground">Pending</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--destructive)/0.15)' }}><CreditCard className="w-5 h-5" style={{ color: 'hsl(var(--destructive))' }} /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{payments.filter(p => p.status === 'failed').length}</div><div className="text-xs text-muted-foreground">Failed</div></div>
          </div>
        </div>

        {revenueData.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--success))', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Payment ID</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Student</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Course</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Amount</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Date</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Status</th>
            </tr></thead>
            <tbody>
              {filtered.map((p: any) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-5 font-mono text-xs text-foreground">{p.payment_id || p.id.slice(0, 8)}</td>
                  <td className="py-3 px-5 text-foreground text-xs">{p.profiles?.name || 'Unknown'}</td>
                  <td className="py-3 px-5 text-foreground text-xs">{p.courses?.title || 'N/A'}</td>
                  <td className="py-3 px-5 font-bold text-foreground">₹{Number(p.amount).toLocaleString()}</td>
                  <td className="py-3 px-5 text-muted-foreground text-xs">{p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-IN') : '-'}</td>
                  <td className="py-3 px-5"><span className={(p.status === 'completed' || p.status === 'paid') ? 'badge-success' : p.status === 'pending' ? 'badge-warning' : 'badge-primary'} style={p.status === 'failed' ? { background: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))' } : {}}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No payments found.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
