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
  Trash2,
  Target
} from 'lucide-react';

// --- キャラクター描画 ---
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
      </svg>
    </div>
  );
};

// --- 円形タイマー ---
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
      <div className="absolute text-[10px] font-bold text-yellow-500">{Math.ceil(secondsLeft / 60)}m</div>
    </div>
  );
};

// --- 汎用モーダル ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-800 w-full max-w-md rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 bg-slate-700 flex justify-between items-center border-b-2 border-slate-600 shrink-0">
          <h2 className="text-xl font-black text-white flex items-center gap-2">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-600 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};

// --- メインアプリ ---
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
        setProfile({ name: currentUser.name, birthday: currentUser.birthday, points: parsed.points || 0, departureTime: parsed.departureTime || '08:00' });
        setTasks(parsed.tasks || defaultTasks);
      } else {
        setProfile({ ...currentUser, points: 0, departureTime: '08:00' });
        setTasks(defaultTasks);
      }
    }
  }, [currentUser]);

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

  // --- 状態更新関数 ---
  const toggleTask = (id) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);
    saveData(profile, updatedTasks);
    if (updatedTasks.find(t => t.id === id).completed) {
      setHeroState('success');
      setTimeout(() => setHeroState('idle'), 1000);
    }
  };

  const updateTaskDuration = (id, newDuration) => {
    const val = Math.max(1, parseInt(newDuration, 10) || 1);
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, duration: val } : t);
    setTasks(updatedTasks);
    saveData(profile, updatedTasks);
  };

  const updateTaskPoints = (id, newPoints) => {
    const val = Math.max(0, parseInt(newPoints, 10) || 0);
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, points: val } : t);
    setTasks(updatedTasks);
    saveData(profile, updatedTasks);
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
    const earned = tasks.reduce((sum, t) => sum + (t.completed ? t.points : 0), 0);
    const newProfile = { ...profile, points: profile.points + earned };
    const resetTasks = tasks.map(t => ({ ...t, completed: false }));
    setProfile(newProfile);
    setTasks(resetTasks);
    saveData(newProfile, resetTasks);
    setIsResultOpen(true);
  };

  if (!currentUser) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-sans">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border-4 border-blue-600 shadow-2xl w-full max-w-sm text-center">
          <HeroCharacter size={100} className="mx-auto mb-6" />
          <h1 className="text-2xl font-black mb-6 text-blue-400">勇者の登録</h1>
          <div className="space-y-4 text-left">
            <input type="text" value={loginData.name} onChange={e => setLoginData({...loginData, name: e.target.value})} className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-2xl outline-none" placeholder="なまえ" />
            <input type="date" value={loginData.birthday} onChange={e => setLoginData({...loginData, birthday: e.target.value})} className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-2xl outline-none" />
            <button onClick={() => loginData.name && (setCurrentUser(loginData), localStorage.setItem('morning_hero_session', JSON.stringify(loginData)))} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-xl shadow-lg border-b-4 border-blue-800">冒険をはじめる！</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex flex-col items-center overflow-hidden font-sans selection:bg-blue-500/30">
      <div className="w-full max-w-lg h-full bg-slate-950 flex flex-col shadow-2xl relative border-x border-slate-800">
        
        {/* Header */}
        <header className="px-4 py-4 shrink-0 bg-gradient-to-b from-blue-900/20 to-transparent border-b border-slate-800/50">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors">
                <Settings size={18} />
              </button>
              <div className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-xs font-black text-white">
                勇者: {profile.name}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <Coins size={14} className="text-yellow-400" />
              <span className="text-white">{profile.points} EXP</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mb-0.5">いまのじかん</div>
              <div className="text-xl font-mono font-black text-white">
                {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </div>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
              <div className="text-[9px] font-black text-blue-400 uppercase tracking-tighter mb-0.5">しゅっぱつ！</div>
              <div className="text-xl font-mono font-black text-yellow-400">
                <Target size={16} className="inline mr-1 mb-1" />
                {profile.departureTime}
              </div>
            </div>
          </div>
        </header>

        {/* Departure Banner */}
        <div className="px-5 pt-3 pb-2 shrink-0">
          <div className={`h-20 rounded-[1.5rem] border-2 flex items-center justify-between px-6 shadow-lg transition-all duration-700 ${timeUntilDeparture <= 5 ? 'bg-red-600 border-red-400 animate-pulse' : 'bg-blue-600 border-blue-400'}`}>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/70 uppercase">出発まで残り</span>
              <div className="text-4xl font-mono font-black text-white leading-none">
                {timeUntilDeparture}<span className="text-xl ml-1">min</span>
              </div>
            </div>
            <HeroCharacter size={60} state={heroState} />
          </div>
        </div>

        {/* Task Area */}
        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          <div className="space-y-2.5 pb-6">
            {tasks.map((task) => {
              const isActive = activeTaskId === task.id;
              return (
                <div key={task.id} onClick={() => toggleTask(task.id)} className={`flex items-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${task.completed ? 'bg-slate-900 border-slate-900 opacity-40' : isActive ? 'bg-blue-900/30 border-yellow-500 scale-[1.01]' : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'}`}>
                  <div className="mr-4 shrink-0">
                    {isActive ? <CircleTimer secondsLeft={taskSecondsLeft} totalSeconds={task.duration * 60} /> : <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-xl shadow-inner">{task.icon}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base font-black truncate ${task.completed ? 'line-through text-slate-600' : ''}`}>{task.label}</h3>
                    <div className="flex items-center gap-2">
                      {isActive ? <span className="text-sm font-mono font-black text-yellow-500">{Math.floor(taskSecondsLeft/60)}:{(taskSecondsLeft%60).toString().padStart(2,'0')}</span> : <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Clock size={10} /> {task.duration}分</span>}
                      <span className="text-[10px] font-bold text-yellow-600 flex items-center gap-0.5"><Coins size={10} /> +{task.points}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {!task.completed && <button onClick={(e) => startTask(task, e)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`}>{isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}</button>}
                    <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-yellow-500 border-yellow-300 text-slate-950' : 'border-slate-800 bg-slate-900/50'}`}>{task.completed && <CheckCircle2 size={20} />}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 shrink-0 bg-slate-950 border-t border-slate-900">
          <button disabled={!allCompleted} onClick={completeQuest} className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 ${allCompleted ? 'bg-yellow-500 text-slate-950 border-b-4 border-yellow-700 shadow-lg active:border-b-0 active:translate-y-1' : 'bg-slate-800 text-slate-600 opacity-50'}`}>
            {allCompleted ? <><Trophy size={20} /> クエスト完了！</> : 'ミッション継続中...'}
          </button>
        </div>

        {/* 設定画面: ポイント調整を追加 */}
        <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="冒険の設定">
          <div className="space-y-6 pb-4">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase flex items-center gap-2"><Clock size={14}/> 出発の時間</label>
              <input type="time" value={profile.departureTime} onChange={(e) => {
                const p = { ...profile, departureTime: e.target.value };
                setProfile(p); saveData(p, tasks);
              }} className="w-full p-4 bg-slate-900 border-2 border-slate-700 rounded-2xl text-3xl font-mono font-black text-yellow-400 text-center focus:border-blue-500 outline-none" />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase flex items-center gap-2"><Edit3 size={14}/> クエストの調整 (時間 & ポイント)</label>
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {tasks.map(task => (
                  <div key={task.id} className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 truncate">
                        <span className="shrink-0">{task.icon}</span>
                        <span className="text-xs font-black text-slate-200 truncate">{task.label}</span>
                      </div>
                      <button onClick={() => removeTask(task.id)} className="text-slate-500 hover:text-red-400 p-1"><Trash2 size={16} /></button>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* 時間設定 */}
                      <div className="flex-1 flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                        <Clock size={12} className="text-slate-400" />
                        <input 
                          type="number" 
                          value={task.duration} 
                          onChange={(e) => updateTaskDuration(task.id, e.target.value)}
                          className="w-full bg-transparent text-center font-black text-white text-xs outline-none" 
                        />
                        <span className="text-[10px] font-bold text-slate-500">分</span>
                      </div>
                      {/* ポイント設定 */}
                      <div className="flex-1 flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                        <Coins size={12} className="text-yellow-500" />
                        <input 
                          type="number" 
                          value={task.points} 
                          onChange={(e) => updateTaskPoints(task.id, e.target.value)}
                          className="w-full bg-transparent text-center font-black text-yellow-400 text-xs outline-none" 
                        />
                        <span className="text-[10px] font-bold text-slate-500">pt</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newTaskLabel} onChange={(e) => setNewTaskLabel(e.target.value)} placeholder="新しいミッション" className="flex-1 p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500" />
                <button onClick={addTask} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"><Plus size={20} /></button>
              </div>
            </div>
            
            <button onClick={() => {setCurrentUser(null); localStorage.removeItem('morning_hero_session');}} className="w-full py-3 bg-slate-900 text-slate-500 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-4 hover:bg-slate-700 transition-colors">
              <LogOut size={16} /> 別の勇者でログイン
            </button>
          </div>
        </Modal>

        {/* 結果画面 */}
        <Modal isOpen={isResultOpen} onClose={() => setIsResultOpen(false)} title="クエストクリア！">
          <div className="text-center space-y-6">
            <HeroCharacter size={120} state="success" className="mx-auto" />
            <div>
              <h3 className="text-3xl font-black text-yellow-400 uppercase tracking-widest">GREAT JOB!</h3>
              <p className="text-slate-400 text-sm font-bold mt-1">今日も最高の一日にしよう！</p>
            </div>
            <button onClick={() => setIsResultOpen(false)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg border-b-4 border-blue-800 shadow-xl active:scale-95 transition-all">行ってきます！</button>
          </div>
        </Modal>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
}
