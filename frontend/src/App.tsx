import { useEffect, useState } from 'react';
import { apiClient } from './api';
import type{ Record } from './types';
import { Filter } from './components/Filter';
import { Summary } from './components/Summary';
import { RecordForm } from './components/RecordForm';
import { RecordItem } from './components/RecordItem';

function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");

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

  return (
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
  );
}

export default App;
