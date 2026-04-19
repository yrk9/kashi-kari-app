import { useEffect, useState } from 'react';
import { apiClient } from './api';
import type{ Record } from './types';
import { Filter } from './components/Filter';
import { Summary } from './components/Summary';
import { RecordForm } from './components/RecordForm';
import { RecordItem } from './components/RecordItem';
import { AuthForm } from './components/AuthForm';

function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isGuest, setIsGuest] = useState(false);

  const fetchRecords = async () => {
      try {
        const data = await apiClient('/records');
        setRecords(data);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      }
  };

  useEffect(() => {
    fetchRecords();
}, []);

const activeRecords = records.filter(r => !r.is_complete);
const totalPendingAmount = activeRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
const pendingCount = activeRecords.length;

const handleLogin = (newToken: string) => {
  setToken(newToken);
  localStorage.setItem('token', newToken);
};

const handleLogout = () => {
  setToken(null);
  setIsGuest(false);
  localStorage.removeItem('token');
};

if (!token && !isGuest) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12">
      <AuthForm onLogin={handleLogin}></AuthForm>
        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsGuest(true)}
            className="text-gray-400 font-bold hover:text-gray-500 transition border-blue-500"
          >
            ログインせずに利用する(データは保存されません)
          </button>
        </div>
    </div>
  );
}

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-black">
          {token ? 'マイページ': 'ゲストモード'}
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
        >
          {token ? 'ログアウト' : 'ログイン画面へ'}
        </button>
      </header>

      <main>
        {token ? (
          <p className="text-green-600 font-bold mb-4">データはサーバに保存されます。</p>
        ) : (
          <p className="text-amber-600 font-bold mb-4">注意: ブラウザを閉じるとデータが削除されます</p>
        )}

        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-md mx-auto">

          {/* タイトル */}
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8 flex items-center justify-center gap-2">
            <span className="text-4xl">🤝</span>貸し借りマネージャー
          </h1>

          {/* サマリー */}
          <Summary totalAmount={totalPendingAmount} totalItems={pendingCount} />

          {/* 入力フォーム */}
          <RecordForm fetchRecords={fetchRecords} />

          {/* 検索・フィルタリング部分 */}
          <Filter 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />


          {/* データ表示部分 */}
          <RecordItem 
            records={records}
            filterStatus={filterStatus}
            searchQuery={searchQuery}
            fetchRecords={fetchRecords}
          />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
