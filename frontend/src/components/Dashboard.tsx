import React, { useState } from 'react'
import { Filter } from './Filter';
import { RecordForm } from './RecordForm';
import { RecordItem } from './RecordItem';
import { apiClient } from '../api';
import type{ Record } from '../types';

interface Props {
    token: string | null;
    records: Record[];
    setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
    handleLogout:() => void;
    fetchRecords:() => void;
}

export const Dashboard = ({token, records, setRecords, handleLogout, fetchRecords} :Props) => {
    const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    if (!Array.isArray(records)) {
        return <div className="text-center py-10">読み込み中...</div>;
    }

    const handleAddRecord = async (newRecordData: any) => {
      if (token) {
        try {
          await apiClient('/records', {
            method: 'POST',
            body: JSON.stringify(newRecordData),
          });
          await fetchRecords();
        } catch (error) {
          console.error('Failed to post record:', error);
          throw error;
        }
      } else {
        const guestRecord: Record = {
          ...newRecordData,
          id: Date.now(),
        };
        setRecords(prev => [...prev, guestRecord]);
      }
    } 
    
    const handleToggleComplete = async (record: Record) => {
      if (token) {
        try {
          await apiClient(`/records/${record.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              ...record,
              is_complete: !record.is_complete
            }),
          });
          await fetchRecords();
        } catch (e) {
          console.error(e);
        }
      } else {
        setRecords(prev => prev.map(r => r.id === record.id ? {...r, is_complete: !r.is_complete} :r));
      }
    };
    
    const handleDeleteRecord = async (id: number) => {
      if (!confirm("本当に削除しますか?")) return;
    
      if (token) {
        try {
          await apiClient(`/records/${id}`, {method: 'DELETE'});
          await fetchRecords();
        } catch (e) {
          console.error(e);
        }
      } else {
        setRecords(prev => prev.filter(r => r.id !== id));
      }
    };

    //const activeRecords = records.filter(r => !r.is_complete);
    //const totalPendingAmount = activeRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
    //const pendingCount = activeRecords.length;
    console.log("Current records type:", typeof records, Array.isArray(records), records);
    
    return (
        <div>
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
                    {/*<Summary totalAmount={totalPendingAmount} totalItems={pendingCount} />*/}
        
                    {/* 入力フォーム */}
                    <RecordForm 
                    onAdd={handleAddRecord} />
        
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
                    onToggle={handleToggleComplete}
                    onDelete={handleDeleteRecord}
                    />
                    </div>
                </div>
            </main>
        </div>
    )
}