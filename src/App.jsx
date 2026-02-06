import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, 
  Star, 
  Zap, 
  Trophy, 
  Coins, 
  Play, 
  Pause, 
  X, 
  Clock,
  CheckCircle2,
  LogOut,
  Edit3,
  Plus,
  Trash2
} from 'lucide-react';

// --- Components ---

const HeroCharacter = ({ size = 80, className, state = 'idle' }) => {
  const isJumping = state === 'success';
  return (
    <div className={`${className} transition-transform duration-500 ${isJumping ? 'animate-bounce' : ''}`}>
      <svg width={size} height={size} viewBox="0 0 400 400" fill="none">
        <path d="M130 180 C 100 250, 80 350, 100 380 L 300 380 C 320 350, 300 250, 270 180 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="8"/>
        <rect x="150" y="180" width="100" height="120" rx="20" fill="#2563EB" stroke="#1E40AF" strokeWidth="8"/>
        <circle cx="200" cy="130" r="60" fill="#FDE68A" />
        <path d="M140 130 A 60 60 0 0 1 260 130 L 260 170 Q 200 190 140 170 Z" fill="#64748B" stroke="#334155" strokeWidth="8"/>
        <circle cx="180" cy="140" r="5" fill="#1E293B" />
        <circle cx="220" cy="140" r="5" fill="#1E293B" />
        <path d="M120 225 L 135 250 L 155 260 L 135 275 L 120 300 L 105 275 L 85 260 L 105 250 Z" fill="#FCD34D"/>
        <path d="M280 200 L 280 320" stroke="#94A3B8" strokeWidth="16" strokeLinecap="round"/>
        <path d="M260 220 L 300 220" stroke="#64748B" strokeWidth="8" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

const CircleTimer = ({ secondsLeft, totalSeconds, size = 56 }) => {
  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.max(0, secondsLeft / totalSeconds);
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="#334155" strokeWidth="4" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#fbbf24"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute text-[10px] font-bold text-yellow-500">
        {Math.ceil(secondsLeft / 60)}m
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-800 w-full max-w-md rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 bg-slate-700 flex justify-between items-center border-b-2 border-slate-600 shrink-0">
          <h2 className="text-xl font-black text-white flex items-center gap-2">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-600 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('morning_hero_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [profile, setProfile] = useState({ name: '', birthday: '', points: 0, departureTime: '08:00' });
  const [tasks, setTasks] = useState([]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [taskSecondsLeft, setTaskSecondsLeft] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [heroState, setHeroState] = useState('idle');
  const [loginData, setLoginData] = useState({ name: '', birthday: '' });
  const [newTaskLabel, setNewTaskLabel] = useState('');

  // ユーザーが決定したらデータをロード
  useEffect(() => {
    if (currentUser) {
      const storageKey = `hero_data_${currentUser.name}_${currentUser.birthday}`;
      const savedData = localStorage.getItem(storageKey);
      
      const defaultTasks = [
        { id: 1, label: 'あさごはん', duration: 20, points: 10, completed: false, icon: '🍚' },
        { id: 2, label: 'きがえ', duration: 5, points: 20, completed: false, icon: '👕' },
        { id: 3, label: 'はみがき', duration: 5, points: 15, completed: false, icon: '🪥' },
        { id: 4, label: 'かおをあらう', duration: 3, points: 5, completed: false, icon: '🫧' },
        { id: 5, label: 'もちものチェック', duration: 5, points: 30, completed: false, icon: '🎒' }
      ];

      if (savedData) {
        const parsed = JSON.parse(savedData);
        setProfile({
          name: currentUser.name,
          birthday: currentUser.birthday,
          points: parsed.points || 0,
          departureTime: parsed.departureTime || '08:00'
        });
        setTasks(parsed.tasks || defaultTasks);
      } else {
        setProfile({ ...currentUser, points: 0, departureTime: '08:00' });
        setTasks(defaultTasks);
      }
    }
  }, [currentUser]);

  // データの保存
  const saveData = (updatedProfile, updatedTasks) => {
    if (!currentUser) return;
    const storageKey = `hero_data_${currentUser.name}_${currentUser.birthday}`;
    localStorage.setItem(storageKey, JSON.stringify({
      points: updatedProfile.points,
      departureTime: updatedProfile.departureTime,
      tasks: updatedTasks
    }));
  };

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
    const [h, m] = (profile.departureTime || '08:00').split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    const diff = target.getTime() - currentTime.getTime();
    return Math.max(0, Math.floor(diff / 60000));
  }, [currentTime, profile.departureTime]);

  const allCompleted = tasks.length > 0 && tasks.every(t => t.completed);

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);
    saveData(profile, updatedTasks);
    
    if (updatedTasks.find(t => t.id === id).completed) {
      setHeroState('success');
      setTimeout(() => setHeroState('idle'), 1000);
    }
  };

  const addTask = () => {
    if (!newTaskLabel.trim()) return;
    const newTask = { id: Date.now(), label: newTaskLabel, duration: 5, points: 10, completed: false, icon: '✨' };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveData(profile, updatedTasks);
    setNewTaskLabel('');
  };

  const removeTask = (id) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    saveData(profile, updatedTasks);
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
    const earnedPoints = tasks.reduce((sum, t) => sum + (t.completed ? t.points : 0), 0);
    const newTotal = (profile.points || 0) + earnedPoints;
    const resetTasks = tasks.map(t => ({ ...t, completed: false }));
    
    const newProfile = { ...profile, points: newTotal };
    setProfile(newProfile);
    setTasks(resetTasks);
    saveData(newProfile, resetTasks);
    setIsResultOpen(true);
  };

  const getRank = () => {
    const p = profile.points || 0;
    if (p >= 5000) return { title: "👑 伝説の勇者", color: "text-yellow-400" };
    if (p >= 2000) return { title: "⚔️ 親衛隊長", color: "text-blue-400" };
    if (p >= 1000) return { title: "🛡️ ベテラン戦士", color: "text-green-400" };
    return { title: "🌱 村の少年", color: "text-slate-400" };
  };

  if (!currentUser) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-sans overflow-hidden">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border-4 border-blue-600 shadow-2xl w-full max-w-sm">
          <HeroCharacter size={100} className="mx-auto mb-6" />
          <h1 className="text-2xl font-black text-center mb-6 text-blue-400">勇者の登録</h1>
          <div className="space-y-4">
            <input type="text" value={loginData.name} onChange={e => setLoginData({...loginData, name: e.target.value})} className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-2xl outline-none text-xl" placeholder="なまえ" />
            <input type="date" value={loginData.birthday} onChange={e => setLoginData({...loginData, birthday: e.target.value})} className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-2xl outline-none text-xl" />
            <button onClick={() => {
              if(loginData.name) {
                setCurrentUser(loginData);
                localStorage.setItem('morning_hero_session', JSON.stringify(loginData));
              }
            }} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-xl border-b-4 border-blue-800 shadow-lg mt-4">冒険をはじめる！</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex flex-col items-center selection:bg-blue-500/30 overflow-hidden font-sans">
      <div className="w-full max-w-lg h-full bg-slate-950 flex flex-col shadow-2xl overflow-hidden relative border-x border-slate-800">
        
        {/* Header */}
        <header className="px-5 py-4 shrink-0 bg-gradient-to-b from-blue-900/20 to-transparent border-b border-slate-800/50">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-700">
                  <Settings size={18} />
                </button>
                <div className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full">
                  <span className="text-xs font-black text-white">{profile.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-black">
                <span className="text-yellow-400 flex items-center gap-0.5"><Coins size={12}/>{profile.points}</span>
                <span className={`px-2 py-0.5 bg-slate-800 rounded-md ${getRank().color}`}>{getRank().title}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-500 uppercase">Current Time</div>
              <div className="text-xl font-mono font-black text-white">
                {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </div>
            </div>
          </div>
        </header>

        {/* Departure Banner */}
        <div className="px-5 pt-3 pb-2 flex items-center gap-4 shrink-0">
          <div className={`flex-1 h-20 rounded-[1.5rem] border-2 flex items-center justify-between px-6 transition-all duration-700 ${timeUntilDeparture <= 5 ? 'bg-red-600 border-red-400 animate-pulse' : 'bg-blue-600 border-blue-400'} shadow-lg`}>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/70">出発まで残り</span>
              <div className="text-4xl font-mono font-black text-white leading-none">
                {timeUntilDeparture}<span className="text-xl ml-1">min</span>
              </div>
            </div>
            <HeroCharacter size={60} state={heroState} />
          </div>
        </div>

        {/* Task Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="space-y-2.5 pb-6">
            {tasks.map((task) => {
              const isActive = activeTaskId === task.id;
              return (
                <div key={task.id} onClick={() => toggleTask(task.id)} className={`flex items-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${task.completed ? 'bg-slate-900 border-slate-900 opacity-40' : isActive ? 'bg-blue-900/30 border-yellow-500 scale-[1.01]' : 'bg-slate-800/40 border-slate-800'}`}>
                  <div className="mr-4 shrink-0">
                    {isActive ? (
                      <CircleTimer secondsLeft={taskSecondsLeft} totalSeconds={task.duration * 60} />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-xl shadow-inner">{task.icon}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base font-black truncate ${task.completed ? 'line-through text-slate-600' : 'text-slate-100'}`}>{task.label}</h3>
                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <div className="text-sm font-mono font-black text-yellow-500">{Math.floor(taskSecondsLeft/60)}:{(taskSecondsLeft%60).toString().padStart(2,'0')}</div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Clock size={10} /> {task.duration}分</span>
                      )}
                      <span className="text-[10px] font-bold text-yellow-600 flex items-center gap-0.5"><Coins size={10} /> +{task.points}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {!task.completed && (
                      <button onClick={(e) => startTask(task, e)} className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                      </button>
                    )}
                    <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-yellow-500 border-yellow-300 text-slate-950' : 'border-slate-800 bg-slate-900/50'}`}>
                      {task.completed && <CheckCircle2 size={20} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 shrink-0 bg-slate-950 border-t border-slate-900">
          <button disabled={!allCompleted} onClick={completeQuest} className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 ${allCompleted ? 'bg-yellow-500 text-slate-950 border-b-4 border-yellow-700 shadow-lg' : 'bg-slate-800 text-slate-600 opacity-50'}`}>
            {allCompleted ? <><Trophy size={20} /> クエスト完了！</> : 'ミッション継続中...'}
          </button>
        </div>

        {/* Settings Modal */}
        <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="冒険の設定">
          <div className="space-y-6 pb-4">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase">出発の時間</label>
              <input type="time" value={profile.departureTime} onChange={(e) => {
                const newProfile = { ...profile, departureTime: e.target.value };
                setProfile(newProfile);
                saveData(newProfile, tasks);
              }} className="w-full p-4 bg-slate-900 border-2 border-slate-700 rounded-2xl text-3xl font-mono font-black text-yellow-400 text-center" />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase">クエストの追加</label>
              <div className="flex gap-2">
                <input type="text" value={newTaskLabel} onChange={(e) => setNewTaskLabel(e.target.value)} placeholder="新しいミッション" className="flex-1 p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm" />
                <button onClick={addTask} className="p-3 bg-blue-600 text-white rounded-xl"><Plus size={20} /></button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase">ミッション管理</label>
              {tasks.map(task => (
                <div key={task.id} className="bg-slate-900 p-2 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold truncate pr-2">{task.label}</span>
                  <button onClick={() => removeTask(task.id)} className="text-red-400 p-1"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            
            <button onClick={() => {
              setCurrentUser(null);
              localStorage.removeItem('morning_hero_session');
            }} className="w-full py-3 bg-slate-900 text-slate-500 rounded-xl text-sm font-bold mt-4 flex items-center justify-center gap-2">
              <LogOut size={16} /> 別の勇者でログイン
            </button>
          </div>
        </Modal>

        {/* Result Modal */}
        <Modal isOpen={isResultOpen} onClose={() => setIsResultOpen(false)} title="クエストクリア！">
          <div className="text-center space-y-5">
            <HeroCharacter size={120} state="success" className="mx-auto" />
            <h3 className="text-2xl font-black text-yellow-400 uppercase">GREAT JOB!</h3>
            <div className="bg-slate-900 p-4 rounded-2xl">
              <div className="text-3xl font-black text-white flex items-center justify-center gap-2">
                <Coins className="text-yellow-500" size={24} /> +{tasks.reduce((sum, t) => sum + (t.completed ? t.points : 0), 0)} EXP
              </div>
            </div>
            <button onClick={() => setIsResultOpen(false)} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black">行ってきます！</button>
          </div>
        </Modal>

      </div>
    </div>
  );
}
