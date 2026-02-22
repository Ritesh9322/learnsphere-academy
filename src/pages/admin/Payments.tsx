import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockPayments, mockCourses, revenueData } from '@/data/mockData';
import { CreditCard, DollarSign, TrendingUp, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const allPayments = [
  ...mockPayments,
  { id: '4', courseId: '4', courseName: 'Cloud Architecture with AWS', amount: 6999, paymentId: 'PAY_004_2024', status: 'paid' as const, paidAt: '2024-02-20' },
  { id: '5', courseId: '5', courseName: 'React Native Mobile Dev', amount: 4499, paymentId: 'PAY_005_2024', status: 'pending' as const, paidAt: '2024-03-05' },
  { id: '6', courseId: '1', courseName: 'Full Stack Web Development', amount: 4999, paymentId: 'PAY_006_2024', status: 'paid' as const, paidAt: '2024-03-08' },
  { id: '7', courseId: '6', courseName: 'Cybersecurity Essentials', amount: 5499, paymentId: 'PAY_007_2024', status: 'failed' as const, paidAt: '2024-03-10' },
];

const totalRevenue = allPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

export default function AdminPayments() {
  const [search, setSearch] = useState('');
  const filtered = allPayments.filter(p => p.courseName.toLowerCase().includes(search.toLowerCase()) || p.paymentId.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Payment Management</h1>
            <p className="text-muted-foreground text-sm mt-1">Track all platform transactions and revenue</p>
          </div>
          <Button variant="outline" className="font-medium"><Download className="w-4 h-4 mr-2" />Export CSV</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><DollarSign className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">₹{(totalRevenue / 100000).toFixed(1)}L</div><div className="text-xs text-muted-foreground">Total Revenue</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><CreditCard className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{allPayments.filter(p => p.status === 'paid').length}</div><div className="text-xs text-muted-foreground">Successful</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-warning)' }}><CreditCard className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{allPayments.filter(p => p.status === 'pending').length}</div><div className="text-xs text-muted-foreground">Pending</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--destructive)/0.15)' }}><CreditCard className="w-5 h-5" style={{ color: 'hsl(var(--destructive))' }} /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{allPayments.filter(p => p.status === 'failed').length}</div><div className="text-xs text-muted-foreground">Failed</div></div>
          </div>
        </div>

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

        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Payment ID</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Course</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Amount</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Date</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Status</th>
            </tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-5 font-mono text-xs text-foreground">{p.paymentId}</td>
                  <td className="py-3 px-5 text-foreground text-xs">{p.courseName}</td>
                  <td className="py-3 px-5 font-bold text-foreground">₹{p.amount.toLocaleString()}</td>
                  <td className="py-3 px-5 text-muted-foreground text-xs">{new Date(p.paidAt).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 px-5"><span className={p.status === 'paid' ? 'badge-success' : p.status === 'pending' ? 'badge-warning' : 'badge-primary'} style={p.status === 'failed' ? { background: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))' } : {}}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
