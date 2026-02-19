export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: string;
  instructorName: string;
  thumbnail: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  status: 'draft' | 'published';
  students: number;
  rating: number;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  courseName: string;
  thumbnail: string;
  instructor: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  enrolledAt: string;
  lastAccessed: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  totalMarks: number;
  duration: number;
  questions: number;
  status: 'upcoming' | 'available' | 'completed';
  score?: number;
  attemptedAt?: string;
}

export interface Payment {
  id: string;
  courseId: string;
  courseName: string;
  amount: number;
  paymentId: string;
  status: 'paid' | 'pending' | 'failed';
  paidAt: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

// Mock Data
export const mockCourses: Course[] = [
  {
    id: '1', title: 'Full Stack Web Development', description: 'Master MERN stack from scratch with real projects',
    price: 4999, instructor: 'teacher1', instructorName: 'Dr. Priya Sharma', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    category: 'Web Development', level: 'Intermediate', duration: '48h', status: 'published', students: 312, rating: 4.8, createdAt: '2024-01-10'
  },
  {
    id: '2', title: 'Data Science & Machine Learning', description: 'Python, Pandas, ML algorithms and deep learning',
    price: 5999, instructor: 'teacher1', instructorName: 'Prof. Raj Kumar', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    category: 'Data Science', level: 'Advanced', duration: '60h', status: 'published', students: 245, rating: 4.9, createdAt: '2024-01-15'
  },
  {
    id: '3', title: 'UI/UX Design Fundamentals', description: 'Figma, design systems, prototyping and user research',
    price: 3499, instructor: 'teacher2', instructorName: 'Ms. Ananya Iyer', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    category: 'Design', level: 'Beginner', duration: '32h', status: 'published', students: 189, rating: 4.7, createdAt: '2024-02-01'
  },
  {
    id: '4', title: 'Cloud Architecture with AWS', description: 'EC2, S3, Lambda, RDS, CloudFormation & DevOps',
    price: 6999, instructor: 'teacher2', instructorName: 'Mr. Vikram Singh', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    category: 'Cloud', level: 'Advanced', duration: '55h', status: 'published', students: 128, rating: 4.6, createdAt: '2024-02-10'
  },
  {
    id: '5', title: 'React Native Mobile Development', description: 'Build cross-platform mobile apps with React Native',
    price: 4499, instructor: 'teacher1', instructorName: 'Dr. Priya Sharma', thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
    category: 'Mobile', level: 'Intermediate', duration: '40h', status: 'published', students: 156, rating: 4.5, createdAt: '2024-02-20'
  },
  {
    id: '6', title: 'Cybersecurity Essentials', description: 'Network security, ethical hacking, and penetration testing',
    price: 5499, instructor: 'teacher2', instructorName: 'Mr. Vikram Singh', thumbnail: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400',
    category: 'Security', level: 'Intermediate', duration: '44h', status: 'published', students: 98, rating: 4.8, createdAt: '2024-03-01'
  },
];

export const mockEnrollments: Enrollment[] = [
  { id: '1', courseId: '1', courseName: 'Full Stack Web Development', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', instructor: 'Dr. Priya Sharma', progress: 68, completedLessons: 34, totalLessons: 50, enrolledAt: '2024-01-15', lastAccessed: '2024-03-10' },
  { id: '2', courseId: '2', courseName: 'Data Science & Machine Learning', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', instructor: 'Prof. Raj Kumar', progress: 42, completedLessons: 25, totalLessons: 60, enrolledAt: '2024-02-01', lastAccessed: '2024-03-09' },
  { id: '3', courseId: '3', courseName: 'UI/UX Design Fundamentals', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', instructor: 'Ms. Ananya Iyer', progress: 91, completedLessons: 29, totalLessons: 32, enrolledAt: '2024-01-20', lastAccessed: '2024-03-11' },
];

export const mockAssignments: Assignment[] = [
  { id: '1', courseId: '1', courseName: 'Full Stack Web Dev', title: 'Build a REST API with Node.js', description: 'Create a complete RESTful API with authentication using Express and MongoDB', dueDate: '2024-03-20', status: 'pending' },
  { id: '2', courseId: '2', courseName: 'Data Science & ML', title: 'Implement Linear Regression Model', description: 'Train a linear regression model on the provided housing dataset', dueDate: '2024-03-18', status: 'submitted' },
  { id: '3', courseId: '3', courseName: 'UI/UX Design', title: 'Design a Mobile App Prototype', description: 'Create a high-fidelity Figma prototype for an e-commerce mobile app', dueDate: '2024-03-25', status: 'graded', grade: 87, feedback: 'Excellent work on the user flow! Color choices are spot on.' },
  { id: '4', courseId: '1', courseName: 'Full Stack Web Dev', title: 'React Dashboard Component', description: 'Build a responsive dashboard layout using React and Tailwind CSS', dueDate: '2024-03-30', status: 'pending' },
];

export const mockQuizzes: Quiz[] = [
  { id: '1', courseId: '1', courseName: 'Full Stack Web Dev', title: 'JavaScript Fundamentals Quiz', totalMarks: 100, duration: 30, questions: 20, status: 'completed', score: 85, attemptedAt: '2024-03-05' },
  { id: '2', courseId: '2', courseName: 'Data Science & ML', title: 'Python & Pandas Basics', totalMarks: 50, duration: 20, questions: 10, status: 'available' },
  { id: '3', courseId: '1', courseName: 'Full Stack Web Dev', title: 'React Hooks Assessment', totalMarks: 80, duration: 25, questions: 16, status: 'upcoming' },
  { id: '4', courseId: '3', courseName: 'UI/UX Design', title: 'Design Principles Test', totalMarks: 60, duration: 20, questions: 12, status: 'completed', score: 54, attemptedAt: '2024-03-08' },
];

export const mockPayments: Payment[] = [
  { id: '1', courseId: '1', courseName: 'Full Stack Web Development', amount: 4999, paymentId: 'PAY_001_2024', status: 'paid', paidAt: '2024-01-15' },
  { id: '2', courseId: '2', courseName: 'Data Science & ML', amount: 5999, paymentId: 'PAY_002_2024', status: 'paid', paidAt: '2024-02-01' },
  { id: '3', courseId: '3', courseName: 'UI/UX Design Fundamentals', amount: 3499, paymentId: 'PAY_003_2024', status: 'paid', paidAt: '2024-01-20' },
];

export const mockNotifications: Notification[] = [
  { id: '1', message: 'Your assignment "Build a REST API" is due in 2 days', type: 'warning', createdAt: '2024-03-11T09:00:00', read: false },
  { id: '2', message: 'Quiz "Python & Pandas Basics" is now available', type: 'info', createdAt: '2024-03-10T14:00:00', read: false },
  { id: '3', message: 'Assignment graded: Design a Mobile App Prototype — 87/100', type: 'success', createdAt: '2024-03-09T11:30:00', read: true },
  { id: '4', message: 'New announcement in Full Stack Web Development', type: 'info', createdAt: '2024-03-08T10:00:00', read: true },
];

export const monthlyEnrollmentData = [
  { month: 'Sep', enrollments: 45 }, { month: 'Oct', enrollments: 78 },
  { month: 'Nov', enrollments: 92 }, { month: 'Dec', enrollments: 68 },
  { month: 'Jan', enrollments: 125 }, { month: 'Feb', enrollments: 148 },
  { month: 'Mar', enrollments: 162 },
];

export const revenueData = [
  { month: 'Sep', revenue: 125000 }, { month: 'Oct', revenue: 198000 },
  { month: 'Nov', revenue: 245000 }, { month: 'Dec', revenue: 189000 },
  { month: 'Jan', revenue: 312000 }, { month: 'Feb', revenue: 387000 },
  { month: 'Mar', revenue: 425000 },
];

export const quizPerformanceData = [
  { name: 'JS Fundamentals', score: 85 }, { name: 'React Hooks', score: 92 },
  { name: 'Design Principles', score: 78 }, { name: 'Python Basics', score: 88 },
  { name: 'SQL Queries', score: 74 },
];

export const categoryData = [
  { name: 'Web Dev', value: 35 }, { name: 'Data Science', value: 25 },
  { name: 'Design', value: 15 }, { name: 'Cloud', value: 12 },
  { name: 'Mobile', value: 8 }, { name: 'Security', value: 5 },
];
