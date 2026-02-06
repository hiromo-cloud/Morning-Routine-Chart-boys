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
        { id: 5, label: 'もちものチェック', duration: 5,
