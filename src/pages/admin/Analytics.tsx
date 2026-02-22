import DashboardLayout from '@/components/layout/DashboardLayout';
import { monthlyEnrollmentData, revenueData, categoryData } from '@/data/mockData';
import { TrendingUp, Users, DollarSign, BookOpen } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PIE_COLORS = ['hsl(221,83%,53%)', 'hsl(142,71%,45%)', 'hsl(199,89%,48%)', 'hsl(38,92%,50%)', 'hsl(250,83%,55%)', 'hsl(0,84%,60%)'];

export default function AdminAnalytics() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Platform Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Comprehensive overview of platform performance</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><Users className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">10,284</div><div className="text-xs text-muted-foreground">Total Users</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><TrendingUp className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">+18%</div><div className="text-xs text-muted-foreground">Growth Rate</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-warning)' }}><DollarSign className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">₹42.5L</div><div className="text-xs text-muted-foreground">Revenue</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-info)' }}><BookOpen className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">6</div><div className="text-xs text-muted-foreground">Active Courses</div></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Revenue Analytics</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(221,83%,53%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(221,83%,53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(221,83%,53%)" fill="url(#revG)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-foreground mb-4">Monthly Enrollments</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyEnrollmentData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display font-semibold text-foreground mb-4">Courses by Category</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={55}>
                {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
