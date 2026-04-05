import React, { useEffect, useState } from 'react';
import { apiClient } from './api';

interface Record {
  id: number;
  name: string;
  content: string;
  amount: number | null;
  type: 'MONEY' | 'ITEM';
  is_complete: boolean;
}

function App() {
  const [records, setRecords] = useState<Record[]>([]);

  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"MONEY" | "ITEM">("MONEY");
  const [error, setError] = useState<string | null>(null);
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

//送信処理
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError(null);

  if (!name.trim() || !content.trim()) {
    setError('名前と内容は必須です。');
    return;
  }

  if (amount < 0) {
    setError("金額は0円以上を入力してください。");
    return;
  }

  try {
    await apiClient('/records', {
      method: 'POST',
      body: JSON.stringify({ name, content, amount, type, is_complete: false }),
    });
    setName('');
    setContent('');
    setAmount(0);
    fetchRecords();
  } catch (error) {
    console.error('Failed to submit record:', error);
    setError('データの送信に失敗しました。入力内容を確認してください。');
  }
};

//完了トグル処理
const handleToggleComplete = async (record: Record) => {
  try {
    await apiClient(`/records/${record.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...record,
        is_complete: !record.is_complete
      }),
    });
    fetchRecords();
  } catch (error) {
    console.error('Failed to toggle complete:', error);
  }
};

//データの削除
const handleDelete = async (id: number) => {
  if (!confirm("本当に削除しますか？")) return;
  try {
    await apiClient(`/records/${id}`, {
      method: 'DELETE',
    });
    fetchRecords();
  } catch (error) {
    console.error('Failed to delete record:', error);
  }
}

const filteredRecords = records.filter((record) => {
  const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesStatus = 
    filterStatus === "ALL" ? true :
    filterStatus === "ACTIVE" ? !record.is_complete : record.is_complete;
    return matchesSearch && matchesStatus;
});

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto">

      {/* タイトル */}
      <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8 flex items-center justify-center gap-2">
        <span className="text-4xl">🤝</span>貸し借りマネージャー
      </h1>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        {/*エラーメッセージの表示*/}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded border border-red-200">{error}</div>
        )}
        <h3 className="text-lg font-bold text-gray-700 mb-4">新規登録</h3>
        <div className="space-y-4">
          <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outrline-none transition"
          placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} required></input>
          <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outrline-none transition"
          placeholder="内容" value={content} onChange={(e) => setContent(e.target.value)} required></input>
        <div className="flex gap-2">
          <input type="number" className="flex-1 px-4 py-2 border rounded-lg outline-none"
                 placeholder="金額" value={amount} onChange={(e) => setAmount(Number(e.target.value))}></input>
          <select 
            className="px-4 py-2 border rounded-lg bg-white outline-none"
            value={type} onChange={(e) => setType(e.target.value as any)}
          >
            <option value="MONEY">お金</option>
            <option value="ITEM">モノ</option>
          </select>
        </div>
        <button 
          disabled={!name.trim() || !content.trim()}
          type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow-lg
                transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed">
          登録
        </button>
       </div>
      </form>

      {/* 検索・フィルタリング部分 */}
      <div className="mb-6 space-y-4">
        {/* 検索入力 */}
        <div className="relative">
          <input 
            type="text"
            placeholder="名前で検索..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          ></input>
          <span className="absolute left-3 top-2.5 opacity-40"></span>
        </div>

        {/* ステータス切り替え*/}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {(["ALL", "ACTIVE", "COMPLETED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 py-1.5 text-sm font-bold rounded-md transition ${
                filterStatus === status ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {status === "ALL" ? "すべて" : status === "ACTIVE" ? "未完了" : "完了済み"}
            </button>
          ))}
        </div>
      </div>

      {/* データ表示部分 */}
      <div className="space-y-4">
      {filteredRecords.length === 0 ? (
        <p className="text-center text-gray-500">データがありません</p>
      ) : (
          filteredRecords.map((record) => (
            <div key={record.id} className={`p-5 rounded-xl shadow-sm border transition ${record.is_complete ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-white border-blue-50'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg text-gray-800">{record.name}</h4>
                  <p className="text-gray-600 mt-1">{record.content}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.type === 'MONEY' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                  {record.type === 'MONEY' ? 'MONEY' : 'ITEM'}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-black text-blue-600">
                  {record.amount ? `${record.amount.toLocaleString()} 円` : '-'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleComplete(record)}
                   className={`px-3 py-1 rounded-md text-sm font-bold transition ${record.is_complete ? 'bg-gray-400 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                  >
                    {record.is_complete ? ' (完了)' : ' (未完了)'}
                  </button>

                  {/* 削除ボタン */}
                  <button onClick={() => handleDelete(record.id)}
                    className="px-3 py-1 bg-red-50 hover:bg-red-100 tex-red-500 rounded-md text-sm font-bold transition"
                > 
                  削除
                </button>
              </div>
            </div>
          </div>
          ))
      )}
      </div>
    </div>
  </div>
  );
}

export default App;
