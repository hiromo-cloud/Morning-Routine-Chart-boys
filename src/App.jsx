import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, 
  Star, 
  Trash2, 
  Save, 
  X, 
  Heart, 
  Smile, 
  Play, 
  Pause 
} from 'lucide-react';

// --- カスタムアイコンコンポーネント ---
const OnigiriIcon = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M50 15 C65 15, 85 70, 85 80 C85 85, 75 90, 50 90 C25 90, 15 85, 15 80 C15 70, 35 15, 50 15 Z" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
    <path d="M35 75 L65 75 L65 90 C50 92, 50 92, 35 90 Z" fill="#1A1A1A" />
    <circle cx="50" cy="55" r="6" fill="#F43F5E" opacity="0.8" />
  </svg>
);

const CupIcon = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M70 45 C85 45, 85 75, 70 75" stroke="#60A5FA" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M25 30 L75 30 L70 85 C70 90, 30 90, 30 85 Z" fill="#93C5FD" stroke="#60A5FA" strokeWidth="3" />
    <ellipse cx="50" cy="35" rx="22" ry="5" fill="#BFDBFE" />
    <circle cx="20" cy="25" r="3" fill="#FDE047" className="animate-pulse" />
  </svg>
);

const WaterIcon = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M50 15 C50 15, 80 50, 80 70 C80 85, 65 95, 50 95 C35 95, 20 85, 20 70 C20 50, 50 15, 50 15 Z" fill="#7DD3FC" stroke="#0EA5E9" strokeWidth="3" />
    <path d="M40 60 C35 65, 35 75, 40 80" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
    <circle cx="75" cy="40" r="5" fill="#0EA5E9" opacity="0.6" />
    <path d="M85 65 L88 72 L95 75 L88 78 L85 85 L82 78 L75 75 L82 72 Z" fill="#FDE047" className="animate-pulse" />
  </svg>
);

const ClothesIcon = ({ size = 60, active = false }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M30 20 L20 35 L30 45 L30 85 L70 85 L70 45 L80 35 L70 20 L60 25 C55 20, 45 20, 40 25 L30 20 Z" fill={active ? "#FFFFFF" : "#F472B6"} stroke={active ? "#F472B6" : "#DB2777"} strokeWidth="3" strokeLinejoin="round" />
    <path d="M45 45 Q50 40 55 45 Q55 50 50 55 Q45 50 45 45 Z" fill={active ? "#F472B6" : "white"} opacity="0.9" />
  </svg>
);

const CustomSparkleIcon = ({ size = 60, active = false }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M50 10 L58 42 L90 50 L58 58 L50 90 L42 58 L10 50 L42 42 Z" fill={active ? "#FFFFFF" : "#FDE047"} stroke={active ? "#FDE047" : "#EAB308"} strokeWidth="4" strokeLinejoin="round" />
    <path d="M80 20 L84 30 L94 34 L84 38 L80 48 L76 38 L66 34 L76 30 Z" fill={active ? "#FDE047" : "#FEF08A"} className="animate-pulse" />
  </svg>
);

const StarMark = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg overflow-visible">
    <path d="M50 5 L63 38 L98 38 L70 59 L81 92 L50 72 L19 92 L30 59 L2 38 L37 38 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="4" strokeLinejoin="round" />
    <circle cx="85" cy="20" r="4" fill="#FFD700" className="animate-pulse" />
    <circle cx="15" cy="25" r="3" fill="#FFD700" className="animate-pulse" />
  </svg>
);

const UsagiCharacter = ({ size = 150, className }) => (
  <svg width={size} height={size} viewBox="0 0 400 400" fill="none" className={className}>
    <ellipse cx="130" cy="120" rx="45" ry="110" fill="white" stroke="#CBD5E1" strokeWidth="8"/>
    <ellipse cx="130" cy="120" rx="25" ry="70" fill="#F43F5E" />
    <ellipse cx="270" cy="120" rx="45" ry="110" fill="white" stroke="#CBD5E1" strokeWidth="8"/>
    <ellipse cx="270" cy="120" rx="25" ry="70" fill="#F43F5E" />
    <circle cx="200" cy="270" r="120" fill="white" stroke="#CBD5E1" strokeWidth="8"/>
    <circle cx="120" cy="290" r="25" fill="#FFE4E6" />
    <circle cx="280" cy="290" r="25" fill="#FFE4E6" />
    <circle cx="155" cy="260" r="15" fill="#0F172A" />
    <circle cx="245" cy="260" r="15" fill="#0F172A" />
    <circle cx="200" cy="295" r="10" fill="#F43F5E" />
    <path d="M175 325C190 335 210 335 225 325" stroke="#F43F5E" strokeWidth="10" strokeLinecap="round" fill="none"/>
  </svg>
);

const VisualCircleTimer = ({ secondsLeft, totalSeconds, size = 80 }) => {
  const radius = size / 2 - 5;
  const circumference = 2 * Math.PI * radius;
  const percentage = (secondsLeft / totalSeconds);
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="white" stroke="#f0fdfa" strokeWidth="4" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius / 2}
          fill="transparent"
          stroke="#7fffd4"
          strokeWidth={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 border-4 border-white/40 rounded-full shadow-inner pointer-events-none" />
      <div className="absolute inset-0 border-2 border-[#7fffd4]/30 rounded-full pointer-events-none" />
    </div>
  );
};

const TaskIcon = ({ name, size = 50, active = false, className }) => {
  const props = { size, className: className || (active ? "text-white" : "text-pink-600") };
  switch (name) {
    case 'onigiri': return <OnigiriIcon size={size} />;
    case 'clothes': return <ClothesIcon size={size} active={active} />;
    case 'cup': return <CupIcon size={size} />;
    case 'water': return <WaterIcon size={size} />;
    case 'sparkle': return <CustomSparkleIcon size={size} active={active} />;
    case 'heart': return <Heart {...props} className={active ? "text-white" : "text-rose-500"} />;
    default: return <Smile {...props} />;
  }
};

const App = () => {
  const DAYS_OF_WEEK = ['月', '火', '水', '木', '金', '土', '日'];
  const [currentTime, setCurrentTime] = useState(new Date());
  const [departureTime, setDepartureTime] = useState("08:00");
  const [tasks, setTasks] = useState([
    { id: 1, label: 'あさごはん', duration: 30, icon: 'onigiri', completed: false },
    { id: 2, label: 'きがえ', duration: 10, icon: 'clothes', completed: false },
    { id: 3, label: 'はみがき', duration: 10, icon: 'cup', completed: false },
    { id: 4, label: 'トイレ', duration: 3, icon: 'heart', completed: false },
    { id: 5, label: 'かおをふく', duration: 3, icon: 'water', completed: false },
    { id: 6, label: 'わすれものチェック', duration: 5, icon: 'sparkle', completed: false },
  ]);
  const [stamps, setStamps] = useState([false, false, false, false, false, false, false]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [taskSecondsLeft, setTaskSecondsLeft] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval = null;
    if (activeTaskId !== null && taskSecondsLeft > 0) {
      interval = setInterval(() => setTaskSecondsLeft((prev) => prev - 1), 1000);
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
    return Math.max(0, Math.floor(diff / 6000
