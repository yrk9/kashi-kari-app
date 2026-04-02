import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await apiClient('/records');
        setRecords(data);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      }
  };
    fetchRecords();
}, []);

  return (
    <div style={{padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif'}}>
      <h1 style={{borderBottom: '2px solid #333', paddingBottom: '10px'}}>貸し借り記録</h1>

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
