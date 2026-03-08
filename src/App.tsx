import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";

// Shared pages
import Notifications from "./pages/shared/Notifications";
import ProfilePage from "./pages/shared/ProfilePage";
import CourseDetail from "./pages/shared/CourseDetail";
import AssignmentDetail from "./pages/shared/AssignmentDetail";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import CourseCatalog from "./pages/student/Courses";
import StudentAssignments from "./pages/student/Assignments";
import StudentQuizzes from "./pages/student/Quizzes";
import StudentAttendance from "./pages/student/Attendance";
import StudentGrades from "./pages/student/Grades";
import Payments from "./pages/student/Payments";
import QuizTake from "./pages/student/QuizTake";
import PaymentSuccess from "./pages/student/PaymentSuccess";

// Teacher pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherCourses from "./pages/teacher/Courses";
import CreateCourse from "./pages/teacher/CreateCourse";
import TeacherAssignments from "./pages/teacher/Assignments";
import CreateAssignment from "./pages/teacher/CreateAssignment";
import TeacherQuizzes from "./pages/teacher/Quizzes";
import CreateQuiz from "./pages/teacher/CreateQuiz";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherStudents from "./pages/teacher/Students";
import StudentDetail from "./pages/teacher/StudentDetail";
import TeacherAnalytics from "./pages/teacher/Analytics";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCourses from "./pages/admin/Courses";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminPayments from "./pages/admin/Payments";
import AdminSecurity from "./pages/admin/Security";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/courses" element={<ProtectedRoute role="student"><CourseCatalog /></ProtectedRoute>} />
      <Route path="/student/courses/:courseId" element={<ProtectedRoute role="student"><CourseDetail /></ProtectedRoute>} />
      <Route path="/student/assignments" element={<ProtectedRoute role="student"><StudentAssignments /></ProtectedRoute>} />
      <Route path="/student/assignments/:assignmentId" element={<ProtectedRoute role="student"><AssignmentDetail /></ProtectedRoute>} />
      <Route path="/student/quizzes" element={<ProtectedRoute role="student"><StudentQuizzes /></ProtectedRoute>} />
      <Route path="/student/quizzes/:quizId" element={<ProtectedRoute role="student"><QuizTake /></ProtectedRoute>} />
      <Route path="/student/attendance" element={<ProtectedRoute role="student"><StudentAttendance /></ProtectedRoute>} />
      <Route path="/student/grades" element={<ProtectedRoute role="student"><StudentGrades /></ProtectedRoute>} />
      <Route path="/student/payments" element={<ProtectedRoute role="student"><Payments /></ProtectedRoute>} />
      <Route path="/student/payment-success" element={<ProtectedRoute role="student"><PaymentSuccess /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute role="student"><ProfilePage /></ProtectedRoute>} />
      <Route path="/student/notifications" element={<ProtectedRoute role="student"><Notifications /></ProtectedRoute>} />

      {/* Teacher Routes */}
      <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/courses" element={<ProtectedRoute role="teacher"><TeacherCourses /></ProtectedRoute>} />
      <Route path="/teacher/courses/create" element={<ProtectedRoute role="teacher"><CreateCourse /></ProtectedRoute>} />
      <Route path="/teacher/courses/:courseId" element={<ProtectedRoute role="teacher"><CourseDetail /></ProtectedRoute>} />
      <Route path="/teacher/assignments" element={<ProtectedRoute role="teacher"><TeacherAssignments /></ProtectedRoute>} />
      <Route path="/teacher/assignments/create" element={<ProtectedRoute role="teacher"><CreateAssignment /></ProtectedRoute>} />
      <Route path="/teacher/assignments/:assignmentId" element={<ProtectedRoute role="teacher"><AssignmentDetail /></ProtectedRoute>} />
      <Route path="/teacher/quizzes" element={<ProtectedRoute role="teacher"><TeacherQuizzes /></ProtectedRoute>} />
      <Route path="/teacher/quizzes/create" element={<ProtectedRoute role="teacher"><CreateQuiz /></ProtectedRoute>} />
      <Route path="/teacher/attendance" element={<ProtectedRoute role="teacher"><TeacherAttendance /></ProtectedRoute>} />
      <Route path="/teacher/students" element={<ProtectedRoute role="teacher"><TeacherStudents /></ProtectedRoute>} />
      <Route path="/teacher/students/:studentId" element={<ProtectedRoute role="teacher"><StudentDetail /></ProtectedRoute>} />
      <Route path="/teacher/analytics" element={<ProtectedRoute role="teacher"><TeacherAnalytics /></ProtectedRoute>} />
      <Route path="/teacher/profile" element={<ProtectedRoute role="teacher"><ProfilePage /></ProtectedRoute>} />
      <Route path="/teacher/notifications" element={<ProtectedRoute role="teacher"><Notifications /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/courses" element={<ProtectedRoute role="admin"><AdminCourses /></ProtectedRoute>} />
      <Route path="/admin/courses/:courseId" element={<ProtectedRoute role="admin"><CourseDetail /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute role="admin"><AdminPayments /></ProtectedRoute>} />
      <Route path="/admin/security" element={<ProtectedRoute role="admin"><AdminSecurity /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute role="admin"><ProfilePage /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute role="admin"><Notifications /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
