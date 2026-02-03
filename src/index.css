import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, 
  Star, 
  Zap,
  Trophy,
  Coins,
  Play,
  Pause,
  RotateCcw,
  Shield,
  Sword,
  X,
  UserCircle
} from 'lucide-react';

// --- キャラクター：勇者 ---
const YushaCharacter = ({ size = 150, className }) => (
  <svg width={size} height={size} viewBox="0 0 400 400" fill="none" className={className}>
    <path d="M130 180 C 100 250, 80 350, 100 380 L 300 380 C 320 350, 300 250, 270 180 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="8"/>
    <rect x="150" y="180" width="100" height="120" rx="20" fill="#2563EB" stroke="#1E40AF" strokeWidth="8"/>
    <circle cx="200" cy="130" r="60" fill="#FCD34D" />
    <path d="M140 130 A 60 60 0 0 1 260 130 L 260 170 Q 200 190 140 170 Z" fill="#64748B" stroke="#334155" strokeWidth="8"/>
    <circle cx="180" cy="140" r="6" fill="#1E293B" />
    <circle cx="220" cy="140" r="6" fill="#1E293B" />
    <path d="M120 225 L 135 250 L 155 260 L 135 275 L 120 300 L 105 275 L 85 260 L 105 250 Z" fill="#FCD34D"/>
    <path d="M280 200 L 280 320" stroke="#CBD5E1" strokeWidth="16" strokeLinecap="round"/>
  </svg>
);

const App = () => {
  // ユーザープロファイル管理
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('current_hero_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [inputName, setInputName] = useState("");
  const [inputBirthday, setInputBirthday] = useState("");

  const DAYS_OF_WEEK = ['月', '火', '水', '木', '金', '土', '日'];
  const [currentTime, setCurrentTime] = useState(new Date());
  const [departureTime, setDepartureTime] = useState("08:00");
  const [tasks, setTasks] = useState([
    { id: 1, label: 'あさごはんをたべる', duration: 20, points: 10, completed: false },
    { id: 2, label: 'きがえ (すばやく!)', duration: 5, points: 20, completed: false },
    { id: 3, label: 'はみがき (ていねいに)', duration: 5, points: 15, completed: false },
    { id: 4, label: 'かおをあらう', duration: 3, points: 5, completed: false },
    { id: 5, label: 'もちものチェック', duration: 5, points: 30, completed: false, icon: <Shield size={24}/> },
    { id: 6, label: 'ハンカチ・ティッシュ', duration: 2, points: 10, completed: false },
  ]);

  // ユーザーごとのポイント取得
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (user) {
      const storageKey = `hero_points_${user.name}_${user.birthday}`;
      const savedPoints = localStorage.getItem(storageKey);
      setTotalPoints(savedPoints ? parseInt(savedPoints, 10) : 0);
    }
  }, [user]);

  // ポイント保存
  useEffect(() => {
    if (user) {
      const storageKey = `hero_points_${user.name}_${user.birthday}`;
      localStorage.setItem(storageKey, totalPoints.toString());
    }
  }, [totalPoints, user]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ログイン処理
  const handleLogin = (e) => {
    e.preventDefault();
    if (inputName && inputBirthday) {
      const newUser = { name: inputName, birthday: inputBirthday };
      setUser(newUser);
      localStorage.setItem('current_hero_user', JSON.stringify(newUser));
    }
  };

  // ログアウト処理
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('current_hero_user');
    setInputName("");
    setInputBirthday("");
  };

  const timeUntilDeparture = useMemo(() => {
    const [h, m] = departureTime.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    const diff = target.getTime() - currentTime.getTime();
    return Math.max(0, Math.floor(diff / 60000));
  }, [currentTime, departureTime]);

  const allCompleted = tasks.every(t => t.completed);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getRank = () => {
    if (totalPoints >= 2000) return "👑 伝説の勇者";
    if (totalPoints >= 1000) return "⚔️ 上級きし";
    if (totalPoints >= 500) return "🛡️ かけだし戦士";
    return "🌱 村の少年";
  };

  // --- ログイン画面の表示 ---
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-[2rem] border-4 border-blue-600 shadow-2xl max-w-sm w-full text-center">
          <YushaCharacter size={120} className="mx-auto mb-6" />
          <h1 className="text-2xl font-black text-yellow-400 mb-6 uppercase tracking-widest">勇者の登録</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 text-left">ハンドルネーム</label>
              <input 
                required
                type="text" 
                value={inputName} 
                onChange={(e) => setInputName(e.target.value)}
                className="w-full p-4 bg-slate-700 border-2 border-slate-600 rounded-xl text-white outline-none focus:border-blue-500"
                placeholder="なまえを入力"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 text-left">たんじょうび</label>
              <input 
                required
                type="date" 
                value={inputBirthday} 
                onChange={(e) => setInputBirthday(e.target.value)}
                className="w-full p-4 bg-slate-700 border-2 border-slate-600 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xl shadow-lg border-b-4 border-blue-800">
              冒険をはじめる！
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- メイン画面の表示 ---
  return (
    <div className="min-h-screen w-full bg-slate-800 font-sans text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-slate-900 shadow-2xl min-h-screen flex flex-col md:rounded-[2rem] md:my-4 md:border-4 md:border-slate-700 md:min-h-0 overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-gradient-to-b from-blue-900 to-slate-900 p-4 md:p-6 text-white shrink-0 relative border-b-4 border-yellow-500">
          <button onClick={() => setIsSettingsOpen(true)} className="absolute left-4 top-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg z-10"><Settings size={24} /></button>
          
          <div className="text-center mb-2">
            <span className="text-xs font-black bg-blue-600 px-3 py-1 rounded-full text-white uppercase tracking-tighter">勇者：{user.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-800/60 p-3 rounded-xl border-2 border-blue-500/30 text-center">
              <span className="text-[10px] font-bold text-blue-300 block mb-1">現在の時刻</span>
              <div className="text-2xl md:text-4xl font-mono font-black">{formatTime(currentTime)}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-3 rounded-xl border-2 border-yellow-300 text-slate-900 text-center shadow-lg">
              <span className="text-[10px] font-black block mb-1 text-yellow-900">獲得ポイント</span>
              <div className="text-2xl md:text-4xl font-black text-white">{totalPoints}</div>
              <div className="text-[10px] font-black bg-slate-900/80 text-yellow-400 px-2 py-0.5 rounded-full inline-block mt-1">{getRank()}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className={`w-full max-w-sm px-6 py-4 rounded-2xl border-4 shadow-lg flex flex-col items-center ${timeUntilDeparture > 5 ? 'bg-blue-600 border-blue-400' : 'bg-red-600 border-red-400 animate-pulse'}`}>
              <span className="text-xs font-black text-white/80">出発まで残り</span>
              <div className="text-6xl font-mono font-black text-white">{timeUntilDeparture}<span className="text-2xl ml-1">分</span></div>
            </div>
            <YushaCharacter size={120} />
          </div>
        </div>

        {/* TASK AREA */}
        <div className="p-4 bg-slate-800 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <div key={task.id} onClick={() => toggleTask(task.id)} className={`flex items-center p-4 rounded-xl border-2 transition-all ${task.completed ? 'bg-slate-700/50 border-slate-600 opacity-60' : 'bg-slate-700 border-slate-600'}`}>
                <div className="mr-4 w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center">
                  {task.icon || <Zap className="text-yellow-400" size={24} />}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-black ${task.completed ? 'line-through' : ''}`}>{task.label}</h3>
                  <span className="text-xs font-bold text-yellow-500">+{task.points} EXP</span>
                </div>
                {task.completed && <Star className="text-yellow-500" fill="currentColor" />}
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-slate-900 border-t-4 border-slate-700">
          <button 
            onClick={() => {
              if(allCompleted) {
                setTotalPoints(prev => prev + tasks.reduce((sum, t) => sum + t.points, 0));
                setTasks(tasks.map(t => ({...t, completed: false})));
                alert("ミッション完了！ポイントをゲットしたぞ！");
              }
            }}
            disabled={!allCompleted}
            className={`w-full py-6 rounded-2xl text-2xl font-black ${allCompleted ? 'bg-yellow-500 text-slate-900 border-b-4 border-amber-700' : 'bg-slate-700 text-slate-500'}`}
          >
            {allCompleted ? 'クエスト完了！' : 'ミッションをこなせ！'}
          </button>
        </div>
      </div>

      {/* 設定画面 */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 p-8 rounded-3xl w-full max-w-sm border-4 border-slate-600">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-white"><Settings /> 設定メニュー</h2>
            <div className="space-y-4">
              <button 
                onClick={handleLogout} 
                className="w-full py-4 bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 border-2 border-slate-600"
              >
                <UserCircle size={20} /> 別の勇者でログインしなおす
              </button>
              <button onClick={() => setIsSettingsOpen(false)} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black">とじる</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const formatTime = (date) => date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

export default App;
