
import React, { useState, useEffect, useRef } from 'react';
import { Difficulty, MathOperation, UserStats, MathProblem } from './types';
import { generateMathProblems, getTutorExplanation, generateEncouragementSpeech, askGeneralTutorQuestion } from './services/geminiService';
import { playGeminiAudio } from './components/AudioPlayer';
import { 
  Trophy, 
  Brain, 
  Settings, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  RefreshCcw,
  Volume2,
  ChevronRight,
  RotateCcw,
  Star,
  Send,
  Loader2,
  Flame
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'play' | 'dashboard' | 'tutor'>('play');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [operation, setOperation] = useState<MathOperation>(MathOperation.ADDITION);
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [confetti, setConfetti] = useState(false);

  // Tutor Tab State
  const [tutorInput, setTutorInput] = useState('');
  const [tutorChat, setTutorChat] = useState<{role: 'user' | 'giddy', text: string}[]>([]);
  const [tutorLoading, setTutorLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState<UserStats>({
    level: 1,
    exp: 150,
    problemsSolved: 42,
    streak: 5,
    history: [
      { date: 'Mon', score: 80 },
      { date: 'Tue', score: 65 },
      { date: 'Wed', score: 90 },
      { date: 'Thu', score: 75 },
      { date: 'Fri', score: 85 },
    ]
  });

  const loadProblems = async () => {
    setLoading(true);
    setShowSummary(false);
    setConfetti(false);
    const newProblems = await generateMathProblems(difficulty, operation);
    setProblems(newProblems);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setExplanation(null);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'play') {
      loadProblems();
    }
  }, [difficulty, operation]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tutorChat]);

  const goToNextProblem = () => {
    setConfetti(false);
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(i => i + 1);
      setFeedback(null);
      setExplanation(null);
    } else {
      setFeedback(null);
      setShowSummary(true);
    }
  };

  const handleAnswer = async (selected: number) => {
    const current = problems[currentIndex];
    if (selected === current.answer) {
      setFeedback('correct');
      setScore(s => s + 1);
      setConfetti(true);
      const audio = await generateEncouragementSpeech("Yay! You are a math star!");
      if (audio) playGeminiAudio(audio);
      
      // Allow a brief moment for the user to see the success
      setTimeout(() => {
        // We let the user click "Continue" for better UX control
      }, 1000);
    } else {
      setFeedback('wrong');
      const tutorNote = await getTutorExplanation(current.question, selected);
      setExplanation(tutorNote);
      const audio = await generateEncouragementSpeech("Let's look at this one together. Giddy is here to help!");
      if (audio) playGeminiAudio(audio);
    }
  };

  const handleTutorSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!tutorInput.trim() || tutorLoading) return;

    const userMsg = tutorInput;
    setTutorInput('');
    setTutorChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setTutorLoading(true);

    try {
      const response = await askGeneralTutorQuestion(userMsg);
      setTutorChat(prev => [...prev, { role: 'giddy', text: response }]);
      const audio = await generateEncouragementSpeech(response.slice(0, 150)); // Voice first bit
      if (audio) playGeminiAudio(audio);
    } catch (err) {
      setTutorChat(prev => [...prev, { role: 'giddy', text: "Oops! My magic wand is a bit dusty. Can you ask that again?" }]);
    } finally {
      setTutorLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col selection:bg-indigo-100">
      {/* Confetti Effect */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              <Star className="text-amber-400 fill-amber-400" size={Math.random() * 20 + 10} />
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-sky-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg animate-pulse-slow">
            <Brain size={24} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent">
            MathGenius AI
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full font-bold text-sm border border-rose-100 animate-in slide-in-from-right-4">
            <Flame size={16} fill="currentColor" />
            <span>{stats.streak}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-bold text-sm border border-amber-100">
            <Trophy size={16} />
            <span>LVL {stats.level}</span>
          </div>
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 pb-28">
        {activeTab === 'play' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {showSummary ? (
              <div className="bg-white rounded-3xl p-10 shadow-xl border-4 border-indigo-50 text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-inner">
                  <Trophy size={48} />
                </div>
                <h2 className="text-4xl font-black text-slate-800 mb-2">Math Master!</h2>
                <p className="text-slate-500 text-lg mb-8">You solved <span className="text-indigo-600 font-extrabold">{score}</span> / {problems.length} puzzles correctly!</p>
                
                <div className="grid grid-cols-3 gap-4 mb-10 max-w-xs mx-auto">
                   {[1,2,3].map(i => (
                     <div key={i} className={`flex flex-col items-center p-4 rounded-2xl transition-all transform hover:scale-110 ${i <= Math.ceil((score/problems.length)*3) ? 'bg-amber-100 text-amber-600 shadow-md' : 'bg-slate-50 text-slate-300'}`}>
                        <Star fill={i <= Math.ceil((score/problems.length)*3) ? "currentColor" : "none"} size={32} />
                     </div>
                   ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={loadProblems}
                    className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                  >
                    <RotateCcw size={24} /> Play Again
                  </button>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="px-8 py-5 bg-white text-slate-600 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    View Progress
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Topic Selector */}
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-sky-100">
                  <div className="flex bg-slate-50 p-1 rounded-xl">
                    {Object.values(Difficulty).map(d => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          difficulty === d ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {Object.values(MathOperation).map(op => (
                      <button
                        key={op}
                        onClick={() => setOperation(op)}
                        className={`w-11 h-11 flex items-center justify-center rounded-xl font-black text-xl transition-all transform hover:scale-110 active:scale-95 ${
                          operation === op ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'
                        }`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Problem Container */}
                <div className="relative">
                  {loading ? (
                    <div className="bg-white rounded-3xl p-16 shadow-xl border-4 border-white flex flex-col items-center justify-center space-y-6">
                      <div className="relative">
                         <div className="w-20 h-20 border-8 border-indigo-100 rounded-full"></div>
                         <div className="absolute inset-0 w-20 h-20 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-indigo-600 font-bold text-xl animate-pulse">Giddy is summoning math magic...</p>
                    </div>
                  ) : problems.length > 0 ? (
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border-4 border-white overflow-hidden transition-all duration-500">
                      <div className="flex justify-between items-center mb-10">
                        <div className="space-y-1">
                          <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Adventure Progress</span>
                          <div className="flex gap-1.5">
                            {problems.map((_, i) => (
                              <div key={i} className={`h-3 w-8 rounded-full transition-all duration-500 ${i < currentIndex ? 'bg-green-400' : i === currentIndex ? 'bg-indigo-500 w-12' : 'bg-slate-100'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                           <span className="block text-2xl font-black text-slate-800">{currentIndex + 1} / {problems.length}</span>
                        </div>
                      </div>

                      <div className="text-center mb-12 py-4">
                        <h2 className="text-7xl md:text-9xl font-black text-slate-800 tracking-tighter drop-shadow-sm select-none">
                          {problems[currentIndex].question}
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 gap-4 md:gap-6">
                        {problems[currentIndex].options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(option)}
                            disabled={!!feedback}
                            className={`group relative p-8 rounded-[1.5rem] text-3xl font-black transition-all transform active:scale-95 border-b-4 ${
                              feedback === 'correct' && option === problems[currentIndex].answer
                                ? 'bg-green-500 text-white border-green-700 shadow-lg shadow-green-100 ring-4 ring-green-100'
                                : feedback === 'wrong' && option === problems[currentIndex].answer
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : feedback === 'wrong' && option !== problems[currentIndex].answer
                                ? 'bg-slate-50 text-slate-200 border-slate-100 opacity-50'
                                : 'bg-indigo-50 text-indigo-900 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200'
                            }`}
                          >
                            {option}
                            {feedback === 'correct' && option === problems[currentIndex].answer && (
                              <CheckCircle2 className="absolute top-4 right-4 text-white animate-in zoom-in-50" size={24} />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Manual Next Button */}
                      <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
                         {!feedback ? (
                           <button 
                             onClick={goToNextProblem}
                             className="text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1 transition-all hover:translate-x-1"
                           >
                             Skip this puzzle <ChevronRight size={20} />
                           </button>
                         ) : (
                           <button 
                             onClick={goToNextProblem}
                             className={`w-full py-6 rounded-2xl font-black text-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 animate-in slide-in-from-bottom-4 ${
                               feedback === 'correct' 
                               ? 'bg-green-500 text-white shadow-green-200 hover:bg-green-600' 
                               : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
                             }`}
                           >
                             Continue Adventure <ArrowRight size={32} strokeWidth={3} />
                           </button>
                         )}
                      </div>
                    </div>
                  ) : null}

                  {/* Tutor Explanation Overlay */}
                  {explanation && (
                    <div className="mt-8 animate-in slide-in-from-bottom-8 duration-500">
                      <div className="bg-indigo-600 rounded-[2rem] p-8 relative shadow-2xl text-white">
                        <div className="absolute -top-6 left-12 w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg animate-float">
                          <Sparkles size={32} />
                        </div>
                        <div className="pt-4">
                          <div className="flex items-center gap-3 mb-4">
                            <button 
                              onClick={async () => {
                                const audio = await generateEncouragementSpeech(explanation);
                                if (audio) playGeminiAudio(audio);
                              }}
                              className="p-2 bg-indigo-500 rounded-xl hover:bg-indigo-400 transition-colors"
                            >
                              <Volume2 size={24} />
                            </button>
                            <span className="text-xl font-black tracking-tight">Giddy's Magic Tip:</span>
                          </div>
                          <p className="text-indigo-50 text-lg leading-relaxed font-medium mb-8">
                            {explanation}
                          </p>
                          <div className="flex gap-4">
                            <button 
                              onClick={() => { setFeedback(null); setExplanation(null); }}
                              className="flex-1 py-4 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                            >
                              <RotateCcw size={20} /> Try Puzzle Again
                            </button>
                            <button 
                              onClick={goToNextProblem}
                              className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl font-black text-lg hover:bg-indigo-400 transition-all flex items-center justify-center gap-2"
                            >
                              Next Puzzle <ChevronRight size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<Trophy className="text-amber-500" />} label="Total Solved" value={stats.problemsSolved.toString()} color="amber" />
              <StatCard icon={<Flame className="text-rose-500" />} label="Hot Streak" value={`${stats.streak} Days`} color="rose" />
              <StatCard icon={<User className="text-sky-500" />} label="Global Rank" value="#42" color="sky" />
              <StatCard icon={<Star className="text-indigo-500" />} label="Skill Grade" value="A+" color="indigo" />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-sky-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Learning Progress</h3>
                <span className="text-sm font-bold text-slate-400">Last 7 Sessions</span>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.history}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#4f46e5" 
                      strokeWidth={5} 
                      dot={{ r: 8, fill: '#4f46e5', strokeWidth: 3, stroke: '#fff' }}
                      activeDot={{ r: 10, fill: '#4f46e5' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-sky-700 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-3">Math Adventure Awaits!</h3>
                  <p className="text-indigo-100 text-lg mb-8 max-w-md opacity-90">Unlock the "Volcano of Fractions" by solving 10 more problems today.</p>
                  <button 
                    onClick={() => setActiveTab('play')}
                    className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-xl hover:bg-indigo-50 shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95"
                  >
                    Start Quest <ArrowRight size={24} />
                  </button>
               </div>
               <Sparkles className="absolute right-[-40px] bottom-[-40px] text-white opacity-10 w-64 h-64" />
            </div>
          </div>
        )}

        {activeTab === 'tutor' && (
          <div className="h-full flex flex-col space-y-4 animate-in slide-in-from-right-8 duration-500 max-h-[70vh]">
             <div className="flex-1 bg-white rounded-3xl shadow-xl border border-sky-100 overflow-hidden flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b bg-slate-50 flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg animate-float">
                    <Brain size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">Chat with Giddy</h3>
                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest">Always Online & Ready!</p>
                  </div>
                </div>

                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                  {tutorChat.length === 0 && (
                    <div className="text-center py-12">
                       <p className="text-slate-400 font-bold text-lg">Ask Giddy a math question!</p>
                       <p className="text-slate-300 text-sm italic mt-1">"How do I multiply by 5?" or "What's a fraction?"</p>
                    </div>
                  )}
                  {tutorChat.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                      <div className={`max-w-[85%] px-5 py-3 rounded-[1.5rem] font-medium text-lg shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {tutorLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white px-5 py-3 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2 text-indigo-600 font-bold">
                        <Loader2 className="animate-spin" size={20} />
                        Giddy is casting a thinking spell...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleTutorSubmit} className="p-4 border-t bg-white">
                  <div className="relative flex items-center gap-2">
                    <input 
                      type="text" 
                      value={tutorInput}
                      onChange={(e) => setTutorInput(e.target.value)}
                      placeholder="Ask Giddy a math question..."
                      className="flex-1 pl-6 pr-14 py-5 bg-slate-100 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-lg"
                    />
                    <button 
                      type="submit"
                      disabled={!tutorInput.trim() || tutorLoading}
                      className="absolute right-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-colors shadow-lg"
                    >
                      <Send size={24} />
                    </button>
                  </div>
                </form>
             </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-2 flex gap-1 z-30 ring-1 ring-slate-900/5">
        <NavButton active={activeTab === 'play'} onClick={() => setActiveTab('play')} icon={<Brain />} label="Play" color="indigo" />
        <NavButton active={activeTab === 'tutor'} onClick={() => setActiveTab('tutor')} icon={<Sparkles />} label="Tutor" color="amber" />
        <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Trophy />} label="My Rank" color="sky" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }> = ({ active, onClick, icon, label, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 rounded-[1.8rem] font-black text-lg transition-all duration-300 transform active:scale-90 ${
      active 
      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 -translate-y-1' 
      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`}
  >
    <span className={active ? 'animate-bounce' : ''}>{icon}</span>
    <span className={active ? 'block' : 'hidden md:block'}>{label}</span>
  </button>
);

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: 'amber' | 'rose' | 'sky' | 'indigo' }> = ({ icon, label, value, color }) => {
  const colors = {
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };
  
  return (
    <div className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transition-all hover:shadow-md hover:-translate-y-1`}>
      <div className={`mb-3 p-3 rounded-2xl ${colors[color]} border`}>{icon}</div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</span>
      <span className="text-2xl font-black text-slate-800 tracking-tight">{value}</span>
    </div>
  );
};

export default App;
