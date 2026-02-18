import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, 
  Zap, 
  Trophy, 
  Play, 
  Pause, 
  X, 
  Clock,
  CheckCircle2,
  Edit3,
  Plus,
  Trash2
} from 'lucide-react';

// --- Components ---

const HeroCharacter = ({ size = 100, className, state = 'idle' }) => {
  const isJumping = state === 'success';
  return (
    <div className={`${className} transition-transform duration-500 ${isJumping ? 'animate-bounce' : ''}`}>
      <svg width={size} height={size} viewBox="0 0 400 400" fill="none">
        <path d="M130 180 C 100 250, 80 350, 100 380 L 300 380 C 320 350, 300 250, 270 180 Z" fill="#FF8A8A" stroke="#C53030" strokeWidth="8"/>
        <rect x="150" y="180" width="100" height="120" rx="30" fill="#63B3ED" stroke="#2B6CB0" strokeWidth="8"/>
        <circle cx="200" cy="130" r="60" fill="#FEEBC8" />
        <path d="M140 130 A 60 60 0 0 1 260 130 L 260 170 Q 200 190 140 170 Z" fill="#CBD5E0" stroke="#4A5568" strokeWidth="8"/>
        <circle cx="180" cy="140" r="5" fill="#2D3748" />
        <circle cx="220" cy="140" r="5" fill="#2D3748" />
        <path d="M120 225 L 135 250 L 155 260 L 135 275 L 120 300 L 105 275 L 85 260 L 105 250 Z" fill="#F6E05E"/>
      </svg>
    </div>
  );
};

const CircleTimer = ({ secondsLeft, totalSeconds, size = 64 }) => {
  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.max(0, secondsLeft / totalSeconds);
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="white" stroke="#E2E8F0" strokeWidth="6" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#F6AD55"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute text-sm font-black text-orange-500">
        {Math.ceil(secondsLeft / 60)}m
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] border-8 border-pink-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="p-6 bg-pink-50 flex justify-between items-center border-b-4 border-pink-100 shrink-0">
          <h2 className="text-2xl font-black text-pink-600 flex items-center gap-2">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-pink-100 rounded-full transition-colors"><X size={28} className="text-pink-400" /></button>
        </div>
        <div className="p-8 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  // データの保存と読み込み (LocalStorage)
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('simple_routine_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, label: 'あさごはんをたべる', duration: 20, completed: false, icon: '🍚' },
      { id: 2, label: 'きがえ (すばやく!)', duration: 5, completed: false, icon: '👕' },
      { id: 3, label: 'はみがき (ていねいに)', duration: 5, completed: false, icon: '🪥' },
      { id: 4, label: 'かおをあらう', duration: 3, completed: false, icon: '🫧' },
      { id: 5, label: 'もちものチェック', duration: 5, completed: false, icon: '🎒' },
      { id: 6, label: '出発じゅんび', duration: 2, completed: false, icon: '🚪' },
    ];
  });

  const [departureTime, setDepartureTime] = useState(() => {
    return localStorage.getItem('simple_routine_departure') || '08:00';
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [taskSecondsLeft, setTaskSecondsLeft] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [heroState, setHeroState] = useState('idle');
  const [newTaskLabel, setNewTaskLabel] = useState('');

  // データの保存
  useEffect(() => {
    localStorage.setItem('simple_routine_tasks', JSON.stringify(tasks));
    localStorage.setItem('simple_routine_departure', departureTime);
  }, [tasks, departureTime]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval = null;
    if (activeTaskId !== null && taskSecondsLeft > 0) {
      interval = setInterval(() => setTaskSecondsLeft(prev => prev - 1), 1000);
    } else if (taskSecondsLeft === 0 && activeTaskId !== null) {
      setActiveTaskId(null);
    }
    return () => clearInterval(interval);
  }, [activeTaskId, taskSecondsLeft]);

  const timeUntilDeparture = useMemo(() => {
    const [h, m] = departureTime.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    const diff = target.getTime() - currentTime.getTime();
    return Math.max(0, Math.floor(diff / 60000));
  }, [currentTime, departureTime]);

  const allCompleted = tasks.length > 0 && tasks.every(t => t.completed);

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);
    if (updatedTasks.find(t => t.id === id).completed) {
      setHeroState('success');
      setTimeout(() => setHeroState('idle'), 1000);
    }
  };

  const updateTaskDuration = (id, newDuration) => {
    const val = Math.max(1, parseInt(newDuration, 10) || 1);
    setTasks(tasks.map(t => t.id === id ? { ...t, duration: val } : t));
  };

  const addTask = () => {
    if (!newTaskLabel.trim()) return;
    const newTask = { id: Date.now(), label: newTaskLabel, duration: 5, completed: false, icon: '✨' };
    setTasks([...tasks, newTask]);
    setNewTaskLabel('');
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  };

  const startTask = (task, e) => {
    e.stopPropagation();
    if (activeTaskId === task.id) {
      setActiveTaskId(null);
    } else {
      setActiveTaskId(task.id);
      setTaskSecondsLeft(task.duration * 60);
    }
  };

  const completeQuest = () => {
    const resetTasks = tasks.map(t => ({ ...t, completed: false }));
    setTasks(resetTasks);
    setIsResultOpen(true);
    setHeroState('success');
  };

  const formatTime = (date) => date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const formatTaskTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="h-screen bg-pink-50 text-slate-700 flex flex-col items-center selection:bg-blue-200 overflow-hidden font-rounded">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;900&display=swap');
        .font-rounded { font-family: 'M PLUS Rounded 1c', sans-serif; }
      `}</style>

      <div className="w-full max-w-lg h-full bg-white flex flex-col md:my-2 md:rounded-[3rem] md:border-8 md:border-blue-100 shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <header className="px-5 py-4 shrink-0 bg-blue-50 border-b-4 border-blue-100">
          <div className="flex justify-between items-center gap-4">
            <button onClick={() => setIsSettingsOpen(true)} className="p-2.5 bg-white rounded-[1rem] border-2 border-blue-100 hover:bg-blue-100 transition-colors shadow-sm">
              <Settings size={24} className="text-blue-400" />
            </button>
            <div className="flex-1 text-center">
              <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest leading-none mb-1">今のじかん</div>
              <div className="text-2xl font-mono font-black text-blue-600 leading-none">{formatTime(currentTime)}</div>
            </div>
            <button 
              disabled={!allCompleted}
              onClick={completeQuest}
              className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all shadow-md shrink-0 ${
                allCompleted ? 'bg-yellow-400 text-slate-800 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1' : 'bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed'
              }`}
            >
              <Trophy size={24} />
              <span className="text-[8px] font-black leading-tight uppercase">Clear!</span>
            </button>
          </div>
        </header>

        {/* Departure Banner */}
        <div className="px-6 pt-4 pb-2 flex items-center gap-4 shrink-0">
          <div className={`flex-1 h-20 rounded-[2rem] border-4 flex items-center justify-between px-6 transition-all duration-700 ${timeUntilDeparture <= 5 ? 'bg-orange-400 border-orange-200 animate-pulse' : 'bg-blue-400 border-blue-200'} shadow-xl`}>
            <div className="flex flex-col">
              <span className="text-xs font-black text-white/90">出発まで残り</span>
              <div className="text-4xl font-mono font-black text-white leading-none">
                {timeUntilDeparture}<span className="text-xl ml-1">分</span>
              </div>
            </div>
            <HeroCharacter size={65} state={heroState} />
          </div>
        </div>

        {/* Task List */}
        <div className="px-8 py-2 shrink-0 flex items-center gap-2 text-blue-300 uppercase text-[10px] font-black tracking-[0.3em]">
          <Zap size={12} className="text-yellow-400" fill="currentColor" /> 今日のミッション
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
          <div className="space-y-3 pb-8">
            {tasks.map((task) => {
              const isActive = activeTaskId === task.id;
              return (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center p-4 rounded-[1.8rem] border-4 transition-all cursor-pointer shadow-sm ${
                    task.completed ? 'bg-slate-50 border-slate-100 opacity-50' : isActive ? 'bg-yellow-50 border-yellow-300 scale-[1.01]' : 'bg-white border-blue-50 hover:border-blue-100'
                  }`}
                >
                  <div className="mr-4 shrink-0">
                    {isActive ? <CircleTimer secondsLeft={taskSecondsLeft} totalSeconds={task.duration * 60} size={56} /> : <div className="w-14 h-14 rounded-[1.2rem] bg-blue-50 flex items-center justify-center text-2xl shadow-inner">{task.icon}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-black truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.label}</h3>
                    <div className="flex items-center gap-3">
                      {isActive ? <div className="text-base font-mono font-black text-orange-500">{formatTaskTime(taskSecondsLeft)}</div> : <span className="text-xs font-bold text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md"><Clock size={12} /> {task.duration}分</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {!task.completed && <button onClick={(e) => startTask(task, e)} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-md ${isActive ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'}`}>{isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}</button>}
                    <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center ${task.completed ? 'bg-green-400 border-green-200 text-white' : 'border-slate-100 bg-slate-50'}`}>{task.completed && <CheckCircle2 size={28} strokeWidth={3} />}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings Modal */}
        <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="設定">
          <div className="space-y-8 pb-4">
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-400 uppercase flex items-center gap-2"><Clock size={18}/> 出発の時間</label>
              <input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="w-full p-6 bg-blue-50 border-4 border-blue-100 rounded-[2rem] text-5xl font-mono font-black text-blue-600 text-center outline-none focus:border-blue-300 shadow-inner" />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-slate-400 uppercase flex items-center gap-2"><Plus size={18}/> 新しいミッションを追加</label>
              <div className="flex gap-3">
                <input type="text" value={newTaskLabel} onChange={(e) => setNewTaskLabel(e.target.value)} placeholder="なまえを入力" className="flex-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg outline-none" />
                <button onClick={addTask} className="p-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-400 transition-colors shadow-md"><Plus size={28} /></button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-slate-400 uppercase flex items-center gap-2"><Edit3 size={18}/> ミッションの管理</label>
              <div className="grid gap-3">
                {tasks.map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-[1.5rem] border-2 border-slate-100 flex items-center gap-4 shadow-sm">
                    <span className="text-2xl shrink-0">{task.icon}</span>
                    <span className="flex-1 text-sm font-bold text-slate-600 truncate">{task.label}</span>
                    <div className="flex items-center gap-3">
                      <input type="number" min="1" value={task.duration} onChange={(e) => updateTaskDuration(task.id, e.target.value)} className="w-16 p-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-center font-black text-blue-600 outline-none" />
                      <button onClick={() => removeTask(task.id)} className="p-2 text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={24} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button onClick={() => setIsSettingsOpen(false)} className="w-full py-5 bg-pink-500 text-white rounded-[1.5rem] font-black text-xl border-b-4 border-pink-700 shadow-md">もどる</button>
          </div>
        </Modal>

        {/* Result Modal */}
        <Modal isOpen={isResultOpen} onClose={() => setIsResultOpen(false)} title="おめでとう！">
          <div className="text-center space-y-6">
             <div className="relative inline-block">
               <HeroCharacter size={160} state="success" />
               <div className="absolute -top-4 -right-4 bg-yellow-400 text-white p-3 rounded-full animate-bounce shadow-xl border-4 border-white">
                 <Trophy size={40} fill="currentColor" />
               </div>
             </div>
             <div>
               <h3 className="text-3xl font-black text-orange-400 uppercase tracking-widest">ばっちり！</h3>
               <p className="text-slate-500 text-lg font-bold mt-2">今日も元気に行ってらっしゃい！</p>
             </div>
             <button onClick={() => setIsResultOpen(false)} className="w-full py-6 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-[2rem] font-black text-2xl shadow-xl active:scale-95 transition-all">行ってきます！</button>
          </div>
        </Modal>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
      `}</style>
    </div>
  );
}
