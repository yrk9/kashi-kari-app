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
  }
};

  return (
    <div style={{padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif'}}>
      <h1 style={{borderBottom: '2px solid #333', paddingBottom: '10px'}}>貸し借り記録</h1>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px'}}>
        <h3>新規登録</h3>
        <div>
          <input placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} required></input>
          <input placeholder="内容" value={content} onChange={(e) => setContent(e.target.value)} required></input>
        </div>
        <div style={{ marginTop: '10px'}}>
          <input type="number" placeholder="金額" value={amount} onChange={(e) => setAmount(Number(e.target.value))}></input>
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="MONEY">お金</option>
            <option value="ITEM">モノ</option>
          </select>
          <button type="submit" style={{ marginLeft: '10px'}}>登録</button>
        </div>
      </form>

      {records.length === 0 ? (
        <p>データがありません</p>
      ) : (
        <ul style={{listStyle: 'none', padding: 0}}>
          {records.map((record) => (
            <li key={record.id} style={{
              background: '#f9f9f9',
              margin: '10px 0',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{record.name}</span>
              <span style={{ color: '#555'}}> {record.content}</span>
              <div style={{ marginTop: '5px', fontWeight: 'bold', color: '#007bff' }}>
                {record.type === 'MONEY' ? `¥${record.amount}` : '物品'}
                {record.is_complete ? ' (完了)' : ' (未完了)'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
