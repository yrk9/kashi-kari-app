import { useState } from 'react';
import { apiClient } from '../api';

interface Props {
    fetchRecords: () => Promise<void>;
}

export const RecordForm = ({ fetchRecords }: Props) => {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [type, setType] = useState<"MONEY" | "ITEM">("MONEY");
    const [error, setError] = useState<string | null>(null);

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
    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        {/*エラーメッセージの表示*/}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded border border-red-200">{error}</div>
        )}
        <h3 className="text-lg font-bold text-gray-700 mb-4">新規登録</h3>
        <div className="space-y-4">
          <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} required></input>
          <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
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
    )
}