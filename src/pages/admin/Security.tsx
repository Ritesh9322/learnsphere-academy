import DashboardLayout from '@/components/layout/DashboardLayout';
import { ShieldCheck, Activity, AlertTriangle, CheckCircle2, Lock, Eye, Globe } from 'lucide-react';

const securityEvents = [
  { id: 1, type: 'login', message: 'Successful admin login', ip: '192.168.1.1', time: '5 min ago', severity: 'info' },
  { id: 2, type: 'password', message: 'Password changed for user neha@email.com', ip: '10.0.0.45', time: '1h ago', severity: 'info' },
  { id: 3, type: 'blocked', message: 'Failed login attempt (3 tries) for admin@oneacademy.com', ip: '45.33.21.8', time: '3h ago', severity: 'warning' },
  { id: 4, type: 'access', message: 'Unauthorized access attempt to /admin/settings', ip: '78.12.34.56', time: '6h ago', severity: 'error' },
  { id: 5, type: 'login', message: 'New teacher registration: sneha@email.com', ip: '172.16.0.12', time: '1d ago', severity: 'info' },
];

export default function AdminSecurity() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Security Center</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor security events and platform integrity</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><ShieldCheck className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">Secure</div><div className="text-xs text-muted-foreground">System Status</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-info)' }}><Activity className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">99.9%</div><div className="text-xs text-muted-foreground">Uptime</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-warning)' }}><AlertTriangle className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">1</div><div className="text-xs text-muted-foreground">Warnings</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><Lock className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">256-bit</div><div className="text-xs text-muted-foreground">Encryption</div></div>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display font-semibold text-foreground mb-4">Security Checklist</h2>
          <div className="space-y-3">
            {[
              { label: 'SSL/TLS Certificate', status: true, detail: 'Valid until Dec 2026' },
              { label: 'Two-Factor Authentication', status: true, detail: 'Enabled for admin accounts' },
              { label: 'Database Encryption', status: true, detail: 'AES-256 at rest' },
              { label: 'Rate Limiting', status: true, detail: '100 req/min per IP' },
              { label: 'CORS Policy', status: true, detail: 'Configured for production domains' },
              { label: 'JWT Token Rotation', status: true, detail: 'Access: 15min, Refresh: 7d' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(var(--success))' }} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.detail}</div>
                </div>
                <span className="badge-success text-[10px]">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Events */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">Recent Security Events</h2>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Event</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">IP Address</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Time</th>
              <th className="text-left py-3 px-5 text-muted-foreground font-medium">Severity</th>
            </tr></thead>
            <tbody>
              {securityEvents.map(e => (
                <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-5 text-foreground text-xs">{e.message}</td>
                  <td className="py-3 px-5 font-mono text-xs text-muted-foreground flex items-center gap-1"><Globe className="w-3 h-3" />{e.ip}</td>
                  <td className="py-3 px-5 text-muted-foreground text-xs">{e.time}</td>
                  <td className="py-3 px-5">
                    <span className={e.severity === 'info' ? 'badge-info' : e.severity === 'warning' ? 'badge-warning' : 'badge-primary'} style={e.severity === 'error' ? { background: 'hsl(var(--destructive)/0.1)', color: 'hsl(var(--destructive))' } : {}}>
                      {e.severity}
                    </span>
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
