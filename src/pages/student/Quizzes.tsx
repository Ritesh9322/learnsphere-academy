import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockQuizzes, quizPerformanceData } from '@/data/mockData';
import { ClipboardList, Clock, CheckCircle2, Play, Trophy, Target, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentQuizzes() {
  const completed = mockQuizzes.filter(q => q.status === 'completed');
  const available = mockQuizzes.filter(q => q.status === 'available');
  const upcoming = mockQuizzes.filter(q => q.status === 'upcoming');
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((s, q) => s + ((q.score || 0) / q.totalMarks) * 100, 0) / completed.length)
    : 0;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Quizzes</h1>
          <p className="text-muted-foreground text-sm mt-1">Attempt quizzes and track your performance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}><ClipboardList className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{mockQuizzes.length}</div><div className="text-xs text-muted-foreground">Total Quizzes</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-success)' }}><CheckCircle2 className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{completed.length}</div><div className="text-xs text-muted-foreground">Completed</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-info)' }}><Play className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{available.length}</div><div className="text-xs text-muted-foreground">Available Now</div></div>
          </div>
          <div className="stat-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-warning)' }}><Trophy className="w-5 h-5 text-white" /></div>
            <div><div className="text-xl font-display font-bold text-foreground">{avgScore}%</div><div className="text-xs text-muted-foreground">Avg Score</div></div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display font-semibold text-foreground mb-4">Performance Overview</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={quizPerformanceData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Available Quizzes */}
        {available.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Play className="w-4 h-4" style={{ color: 'hsl(var(--info))' }} />Available Quizzes
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {available.map(q => (
                <div key={q.id} className="bg-card rounded-xl border-2 border-primary/30 p-5 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <span className="badge-info">Available</span>
                    <span className="text-xs text-muted-foreground">{q.duration} min</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{q.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{q.courseName}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Target className="w-3 h-3" />{q.questions} questions</span>
                    <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />{q.totalMarks} marks</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{q.duration} min</span>
                  </div>
                  <Button size="sm" className="w-full font-semibold" style={{ background: 'var(--gradient-primary)' }}>
                    <Play className="w-3 h-3 mr-1" />Start Quiz
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: 'hsl(var(--warning))' }} />Upcoming Quizzes
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {upcoming.map(q => (
                <div key={q.id} className="bg-card rounded-xl border border-border p-5 opacity-80">
                  <div className="flex items-start justify-between mb-3">
                    <span className="badge-warning">Upcoming</span>
                    <span className="text-xs text-muted-foreground">{q.duration} min</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{q.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{q.courseName}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{q.questions} questions</span>
                    <span>{q.totalMarks} marks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" style={{ color: 'hsl(var(--success))' }} />Completed Quizzes
            </h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Quiz</th>
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Course</th>
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Score</th>
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Percentage</th>
                    <th className="text-left py-3 px-5 text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {completed.map(q => (
                    <tr key={q.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-5 font-medium text-foreground">{q.title}</td>
                      <td className="py-3 px-5 text-muted-foreground text-xs">{q.courseName}</td>
                      <td className="py-3 px-5 font-bold" style={{ color: 'hsl(var(--primary))' }}>{q.score}/{q.totalMarks}</td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 progress-bar"><div className="progress-fill" style={{ width: `${Math.round(((q.score || 0) / q.totalMarks) * 100)}%` }} /></div>
                          <span className="text-xs text-muted-foreground">{Math.round(((q.score || 0) / q.totalMarks) * 100)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-muted-foreground text-xs">{q.attemptedAt ? new Date(q.attemptedAt).toLocaleDateString('en-IN') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
