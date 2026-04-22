import { Link } from 'react-router-dom';
import { BookOpen, Star, Users, Clock, ArrowRight, CheckCircle, GraduationCap, Award, TrendingUp, Shield, ChevronRight, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import heroBg from '@/assets/hero-bg.jpg';

const features = [
  { icon: BookOpen, title: 'Expert-Led Courses', description: 'Learn from industry professionals with years of real-world experience' },
  { icon: Award, title: 'Certified Learning', description: 'Earn verifiable certificates upon course completion' },
  { icon: TrendingUp, title: 'Progress Tracking', description: 'Monitor your learning journey with detailed analytics and insights' },
  { icon: Shield, title: 'Secure Platform', description: 'Enterprise-grade security protecting your data and learning content' },
];

const testimonials = [
  { name: 'Shreya Kapoor', role: 'Frontend Developer at Razorpay', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80', text: 'The Full Stack course completely transformed my career. Within 3 months of completing it, I landed my dream job!', rating: 5 },
  { name: 'Aditya Bose', role: 'Data Scientist at Flipkart', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80', text: 'The ML course curriculum is incredibly well-structured. The instructors are top-notch and always available to help.', rating: 5 },
  { name: 'Kavya Reddy', role: 'UX Designer at Swiggy', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80', text: 'Best investment I\'ve made in my professional development. The UI/UX course gave me exactly what I needed.', rating: 5 },
];

export default function Landing() {
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({ students: 0, courses: 0, instructors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [coursesRes, enrollRes, profilesRes] = await Promise.all([
        supabase.from('courses').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(6),
        supabase.from('enrollments').select('student_id'),
        supabase.from('profiles').select('user_id'),
      ]);
      setCourses(coursesRes.data || []);
      const uniqueStudents = new Set((enrollRes.data || []).map(e => e.student_id)).size;
      setStats({
        students: uniqueStudents,
        courses: (coursesRes.data || []).length,
        instructors: new Set((coursesRes.data || []).map((c: any) => c.instructor_id).filter(Boolean)).size,
      });
      setLoading(false);
    };
    load();
  }, []);

  const displayStats = [
    { number: stats.students > 0 ? `${stats.students.toLocaleString()}+` : '0', label: 'Active Students' },
    { number: stats.courses > 0 ? `${stats.courses}+` : '0', label: 'Courses' },
    { number: stats.instructors > 0 ? `${stats.instructors}+` : '0', label: 'Expert Instructors' },
    { number: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">OneAcademy</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Courses', 'Features', 'Testimonials', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-medium">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="font-semibold" style={{ background: 'var(--gradient-primary)' }}>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Students learning together with modern technology" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, hsl(222 47% 8% / 0.95) 40%, hsl(222 47% 8% / 0.4))' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border border-primary/30" style={{ background: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              India's #1 Coaching Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] mb-6">
              Master Skills That<br />
              <span className="gradient-text">Matter in 2025</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
              Join thousands of students learning from India's top instructors. From web development to data science — build real skills, get certified, land your dream job.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/register">
                <Button size="lg" className="font-semibold h-12 px-8" style={{ background: 'var(--gradient-primary)' }}>
                  Start Learning Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="font-semibold h-12 px-8 border-white/30 text-white hover:bg-white/10">
                <Play className="w-4 h-4 mr-2" />Watch Demo
              </Button>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40'].map((src, i) => (
                  <img key={i} src={src} alt="Student" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                  <span className="text-white font-semibold text-sm ml-1">4.9</span>
                </div>
                <div className="text-white/50 text-xs">from 2,000+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {displayStats.map(({ number, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-display font-bold text-white mb-1">{number}</div>
                <div className="text-white/70 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section id="courses" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 badge-primary">
              Popular Courses
            </div>
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">Learn from the Best</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Carefully curated courses designed by industry experts to give you real-world skills</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : courses.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No courses available yet. Check back soon!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => (
                <div key={course.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${course.level === 'beginner' ? 'badge-success' : course.level === 'intermediate' ? 'badge-warning' : 'badge-info'}`}>
                        {course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : 'Beginner'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {course.category && <span className="badge-primary text-[10px]">{course.category}</span>}
                    </div>
                    <h3 className="font-display font-semibold text-foreground text-base mb-1 line-clamp-2">{course.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      {course.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="font-bold text-foreground">{course.price > 0 ? `₹${Number(course.price).toLocaleString()}` : 'Free'}</span>
                      <Link to="/register">
                        <Button size="sm" className="font-semibold" style={{ background: 'var(--gradient-primary)' }}>Enroll Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/login">
              <Button size="lg" variant="outline" className="font-semibold">
                Browse All Courses <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A complete learning ecosystem designed for modern learners and educators</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-all duration-200 group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: 'var(--gradient-primary)' }}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-display font-bold text-foreground mb-6">A Platform Built for Real Learning Outcomes</h3>
              {['Role-based dashboards for students, teachers & admins', 'Timer-based quizzes with instant grading', 'Assignment submission with file upload', 'Real-time progress tracking & analytics', 'Attendance management system', 'Integrated payment gateway'].map(item => (
                <div key={item} className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(var(--success))' }} />
                  <span className="text-foreground text-sm">{item}</span>
                </div>
              ))}
              <Link to="/register" className="inline-block mt-6">
                <Button style={{ background: 'var(--gradient-primary)' }} className="font-semibold">
                  Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-destructive" /><div className="w-3 h-3 rounded-full bg-warning" /><div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <div className="space-y-3">
                {[{ label: 'Full Stack Web Dev', p: 68 }, { label: 'Data Science & ML', p: 42 }, { label: 'UI/UX Design', p: 91 }].map(c => (
                  <div key={c.label}>
                    <div className="flex justify-between text-sm mb-1"><span className="text-foreground font-medium">{c.label}</span><span className="text-muted-foreground">{c.p}%</span></div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${c.p}%` }} /></div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[['12', 'Courses'], ['89%', 'Avg Score'], ['4.9★', 'Rating']].map(([v, l]) => (
                  <div key={l} className="bg-muted rounded-lg p-3 text-center">
                    <div className="font-bold text-foreground text-lg">{v}</div>
                    <div className="text-xs text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">What Our Students Say</h2>
            <p className="text-muted-foreground">Real results from real learners</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, avatar, text, rating }) => (
              <div key={name} className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
                  <div><div className="font-semibold text-foreground text-sm">{name}</div><div className="text-muted-foreground text-xs">{role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 hero-bg">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/70 text-lg mb-8">Join thousands of learners who have already transformed their careers with OneAcademy.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="h-12 px-8 font-semibold bg-white text-primary hover:bg-white/90">
                Create Free Account <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 font-semibold border-white/40 text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-white">OneAcademy</span>
              </div>
              <p className="text-white/50 text-sm">India's leading online coaching platform for technology professionals.</p>
            </div>
            {[{ title: 'Courses', items: ['Web Development', 'Data Science', 'UI/UX Design', 'Cloud & DevOps'] },
              { title: 'Platform', items: ['For Students', 'For Teachers', 'For Institutes', 'Enterprise'] },
              { title: 'Support', items: ['Help Center', 'Contact Us', 'Community', 'Privacy Policy'] }].map(({ title, items }) => (
              <div key={title}>
                <div className="font-semibold text-white mb-3">{title}</div>
                {items.map(item => <div key={item} className="text-white/50 text-sm mb-2 hover:text-white/80 cursor-pointer transition-colors">{item}</div>)}
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-white/40 text-sm">
            © 2025 OneAcademy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
