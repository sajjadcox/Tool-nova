import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Calculator, 
  Percent, 
  Award, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  credits: number;
  gradePoint: number;
  gradeLabel: string;
}

const GRADE_PRESETS = [
  { label: 'A+ (4.00)', point: 4.0 },
  { label: 'A (3.75)', point: 3.75 },
  { label: 'A- (3.50)', point: 3.50 },
  { label: 'B+ (3.25)', point: 3.25 },
  { label: 'B (3.00)', point: 3.00 },
  { label: 'B- (2.75)', point: 2.75 },
  { label: 'C+ (2.50)', point: 2.50 },
  { label: 'C (2.25)', point: 2.25 },
  { label: 'D (2.00)', point: 2.00 },
  { label: 'F (0.00)', point: 0.00 },
];

export const CgpaCalculator: React.FC<{ initialTab?: 'sgpa' | 'cgpa' | 'percentage' | 'attendance' | 'exam' }> = ({ initialTab = 'sgpa' }) => {
  const [activeTab, setActiveTab] = useState<'sgpa' | 'cgpa' | 'percentage' | 'attendance' | 'exam'>(initialTab);

  // 1. SGPA State
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Computer Programming', credits: 3.0, gradePoint: 4.0, gradeLabel: 'A+ (4.00)' },
    { id: '2', name: 'Calculus & Linear Algebra', credits: 3.0, gradePoint: 3.75, gradeLabel: 'A (3.75)' },
    { id: '3', name: 'Physics Laboratory', credits: 1.5, gradePoint: 4.0, gradeLabel: 'A+ (4.00)' },
    { id: '4', name: 'English Communication', credits: 3.0, gradePoint: 3.5, gradeLabel: 'A- (3.50)' },
  ]);

  // 2. CGPA State
  const [prevCgpa, setPrevCgpa] = useState<number>(3.65);
  const [prevCredits, setPrevCredits] = useState<number>(45);
  const [currGpa, setCurrGpa] = useState<number>(3.80);
  const [currCredits, setCurrCredits] = useState<number>(15);

  // 3. Percentage State
  const [inputGpa, setInputGpa] = useState<number>(3.75);
  const [scale, setScale] = useState<number>(4.0);

  // 4. Attendance State
  const [totalClasses, setTotalClasses] = useState<number>(40);
  const [attendedClasses, setAttendedClasses] = useState<number>(32);
  const [requiredPercent, setRequiredPercent] = useState<number>(75);

  // 5. Target Exam Score State
  const [currentScore, setCurrentScore] = useState<number>(78);
  const [examWeight, setExamWeight] = useState<number>(40);
  const [targetOverall, setTargetOverall] = useState<number>(85);

  // Add course row
  const addCourse = () => {
    setCourses(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        name: `Course ${prev.length + 1}`,
        credits: 3.0,
        gradePoint: 4.0,
        gradeLabel: 'A+ (4.00)'
      }
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, val: any) => {
    setCourses(prev => prev.map(c => {
      if (c.id === id) {
        if (field === 'gradePoint') {
          const match = GRADE_PRESETS.find(g => g.point === parseFloat(val));
          return { ...c, gradePoint: parseFloat(val), gradeLabel: match?.label || `${val}` };
        }
        return { ...c, [field]: val };
      }
      return c;
    }));
  };

  // SGPA Calculations
  const totalCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  const totalPoints = courses.reduce((sum, c) => sum + ((Number(c.credits) || 0) * (Number(c.gradePoint) || 0)), 0);
  const calculatedSgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;

  // Cumulative CGPA Calculations
  const overallCredits = (Number(prevCredits) || 0) + (Number(currCredits) || 0);
  const overallPoints = ((Number(prevCgpa) || 0) * (Number(prevCredits) || 0)) + ((Number(currGpa) || 0) * (Number(currCredits) || 0));
  const calculatedCumulativeCgpa = overallCredits > 0 ? (overallPoints / overallCredits) : 0;

  // Percentage Calculations
  const calculatedPercentage = scale === 4.0 
    ? (inputGpa / 4.0) * 100 
    : scale === 5.0 
    ? (inputGpa / 5.0) * 100 
    : ((inputGpa - 0.75) * 10); // Standard AICTE 10.0 scale

  // Attendance Calculations
  const currentAttendancePct = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
  // How many more classes can student miss while staying >= requiredPercent?
  // attended / (total + x) >= req / 100 => total + x <= attended * 100 / req
  const maxAllowedTotal = (attendedClasses * 100) / requiredPercent;
  const canBunkClasses = Math.max(0, Math.floor(maxAllowedTotal - totalClasses));
  
  // If below required %, how many consecutive classes must they attend?
  // (attended + y) / (total + y) >= req / 100 => y * (1 - req/100) >= total * req/100 - attended
  const neededClasses = currentAttendancePct < requiredPercent
    ? Math.max(0, Math.ceil((requiredPercent * totalClasses - 100 * attendedClasses) / (100 - requiredPercent)))
    : 0;

  // Exam Score Target calculation
  // currentScore * (1 - examWeight/100) + requiredExam * (examWeight/100) = targetOverall
  const currentPortion = currentScore * (1 - examWeight / 100);
  const neededOnFinal = ((targetOverall - currentPortion) / (examWeight / 100));

  const getStanding = (gpa: number) => {
    if (gpa >= 3.8) return { text: "Highest Distinction / Dean's Honor List", color: 'text-emerald-500' };
    if (gpa >= 3.5) return { text: "Distinction / First Class", color: 'text-teal-500' };
    if (gpa >= 3.0) return { text: "Good Academic Standing", color: 'text-blue-500' };
    if (gpa >= 2.0) return { text: "Satisfactory / Pass", color: 'text-amber-500' };
    return { text: "Academic Warning / Probation", color: 'text-rose-500' };
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>Academic & University Education Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            CGPA, GPA & Academic Success Calculator
          </h1>
          <p className="text-violet-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Calculate Semester SGPA with custom credits, cumulative CGPA across degrees, convert GPA to marks percentage, check attendance bunk margins, and forecast final exam grades.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {[
          { id: 'sgpa', label: 'Semester SGPA Calculator', icon: GraduationCap },
          { id: 'cgpa', label: 'Cumulative CGPA Calculator', icon: Award },
          { id: 'percentage', label: 'GPA to Percentage', icon: Percent },
          { id: 'attendance', label: 'Class Attendance & Bunk', icon: Calendar },
          { id: 'exam', label: 'Final Exam Target Predictor', icon: Calculator },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SGPA CALCULATOR */}
      {activeTab === 'sgpa' && (
        <div className="space-y-6">
          {/* Result Highlight Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Semester SGPA
              </span>
              <p className="text-3xl sm:text-4xl font-black text-violet-700 dark:text-violet-300 font-mono mt-1">
                {calculatedSgpa.toFixed(2)}
              </p>
              <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold mt-1">
                Out of 4.00 Scale
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Credit Hours
              </span>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono mt-1">
                {totalCredits.toFixed(1)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {courses.length} courses enrolled
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Academic Standing
              </span>
              <p className={`text-base sm:text-lg font-bold mt-1 ${getStanding(calculatedSgpa).color}`}>
                {getStanding(calculatedSgpa).text}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Total Grade Points: {totalPoints.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Courses Table */}
          <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Enrolled Courses & Grades
              </span>
              <button
                type="button"
                onClick={addCourse}
                className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Course</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {courses.map((course, idx) => (
                <div
                  key={course.id}
                  className="p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs"
                >
                  <div className="w-6 text-slate-400 font-bold hidden sm:block">
                    #{idx + 1}
                  </div>

                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold sm:hidden block mb-0.5">Course Name</label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      placeholder="Course Title or Code"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                    />
                  </div>

                  <div className="w-full sm:w-28">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold sm:hidden block mb-0.5">Credits</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="12"
                      value={course.credits}
                      onChange={(e) => updateCourse(course.id, 'credits', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>

                  <div className="w-full sm:w-44">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold sm:hidden block mb-0.5">Letter Grade</label>
                    <select
                      value={course.gradePoint}
                      onChange={(e) => updateCourse(course.id, 'gradePoint', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                    >
                      {GRADE_PRESETS.map((g) => (
                        <option key={g.label} value={g.point}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:self-center self-end">
                    <button
                      type="button"
                      onClick={() => removeCourse(course.id)}
                      disabled={courses.length <= 1}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addCourse}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-violet-500/30 text-violet-600 dark:text-violet-400 font-bold text-xs hover:bg-violet-50/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Course</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CUMULATIVE CGPA CALCULATOR */}
      {activeTab === 'cgpa' && (
        <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40 border border-violet-200 dark:border-violet-800 max-w-md mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              New Cumulative CGPA
            </span>
            <p className="text-5xl font-black text-violet-700 dark:text-violet-300 font-mono">
              {calculatedCumulativeCgpa.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Across {overallCredits} Total Completed Credits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Previous History */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Previous Semesters History
              </h4>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-400">
                  Previous Cumulative CGPA:
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={prevCgpa}
                  onChange={(e) => setPrevCgpa(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-400">
                  Total Completed Credits So Far:
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={prevCredits}
                  onChange={(e) => setPrevCredits(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-sm"
                />
              </div>
            </div>

            {/* Current Semester */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Current Semester Performance
              </h4>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-400">
                  Current Semester GPA (SGPA):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={currGpa}
                  onChange={(e) => setCurrGpa(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-400">
                  Current Semester Credits:
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={currCredits}
                  onChange={(e) => setCurrCredits(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GPA TO PERCENTAGE */}
      {activeTab === 'percentage' && (
        <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800 max-w-md mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Equivalent Percentage
            </span>
            <p className="text-5xl font-black text-emerald-600 dark:text-emerald-300 font-mono">
              {calculatedPercentage.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Based on {scale}.0 Grading Scale
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Select Your University Scale:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[4.0, 5.0, 10.0].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScale(s)}
                    className={`py-2 rounded-xl font-bold border transition-colors ${
                      scale === s
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {s}.0 Scale
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Enter Your GPA / CGPA:
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={scale}
                value={inputGpa}
                onChange={(e) => setInputGpa(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-base font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ATTENDANCE & BUNK CALCULATOR */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-5 rounded-2xl border ${
              currentAttendancePct >= requiredPercent 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' 
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
            }`}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Current Attendance Rate
              </span>
              <p className="text-4xl font-black mt-1 font-mono">
                {currentAttendancePct}%
              </p>
              <p className="text-xs mt-1">
                {attendedClasses} attended out of {totalClasses} classes
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
              {currentAttendancePct >= requiredPercent ? (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Safe Attendance Status</span>
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    You can safely miss <strong className="text-emerald-600 font-black">{canBunkClasses}</strong> more classes while staying above {requiredPercent}%.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Attendance Shortage</span>
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    You must attend the next <strong className="text-rose-500 font-black">{neededClasses}</strong> classes consecutively to reach {requiredPercent}%.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Total Classes Held:</label>
              <input
                type="number"
                min="1"
                value={totalClasses}
                onChange={(e) => setTotalClasses(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Classes You Attended:</label>
              <input
                type="number"
                min="0"
                max={totalClasses}
                value={attendedClasses}
                onChange={(e) => setAttendedClasses(Math.min(totalClasses, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Minimum Required %:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={requiredPercent}
                onChange={(e) => setRequiredPercent(parseInt(e.target.value) || 75)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FINAL EXAM TARGET PREDICTOR */}
      {activeTab === 'exam' && (
        <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800 max-w-md mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Score Needed on Final Exam
            </span>
            <p className="text-5xl font-black text-indigo-700 dark:text-indigo-300 font-mono">
              {neededOnFinal <= 100 ? `${Math.max(0, Math.round(neededOnFinal))}%` : 'Impossible'}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              {neededOnFinal <= 100 
                ? `You need ${neededOnFinal.toFixed(1)}% on the final to secure an overall ${targetOverall}%`
                : `Target requires over 100% on the final exam with current coursework`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Current Course Grade (%):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={currentScore}
                onChange={(e) => setCurrentScore(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Final Exam Weight (%):</label>
              <input
                type="number"
                min="5"
                max="90"
                value={examWeight}
                onChange={(e) => setExamWeight(parseFloat(e.target.value) || 40)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Desired Overall Grade (%):</label>
              <input
                type="number"
                min="50"
                max="100"
                value={targetOverall}
                onChange={(e) => setTargetOverall(parseFloat(e.target.value) || 85)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
