import type { Record } from '../types';
import { apiClient } from '../api';

interface Props {
    records: Record[];
    filterStatus: "ALL" | "ACTIVE" | "COMPLETED";
    searchQuery: string;
    fetchRecords: () => Promise<void>;
}

export const RecordItem = ({records, filterStatus, searchQuery, fetchRecords}: Props) => {

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
    )
};