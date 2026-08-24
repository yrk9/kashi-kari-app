import React, { useState } from "react";
import { Header } from "./Header";
import { Filter } from "./Filter";
import { RecordForm } from "./RecordForm";
import { RecordItem } from "./RecordItem";
import { Summary } from "./Summary";
import { apiClient } from "../api";
import type { Record } from "../types";

interface Props {
  token: string | null;
  records: Record[];
  setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
  handleLogout: () => void;
  fetchRecords: () => void;
  handleTransfar: (transfar: string) => void;
}

export const Dashboard = ({
  token,
  records,
  setRecords,
  handleLogout,
  fetchRecords,
  handleTransfar,
}: Props) => {
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "ACTIVE" | "COMPLETED"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  if (!Array.isArray(records)) {
    return <div className="text-center py-10">読み込み中...</div>;
  }

  const handleAddRecord = async (newRecordData: any) => {
    if (token) {
      try {
        await apiClient("/records", {
          method: "POST",
          body: JSON.stringify(newRecordData),
        });
        await fetchRecords();
      } catch (error) {
        console.error("Failed to post record:", error);
        throw error;
      }
    } else {
      const guestRecord: Record = {
        ...newRecordData,
        id: Date.now(),
      };
      setRecords((prev) => [...prev, guestRecord]);
    }
  };

  const handleToggleComplete = async (record: Record) => {
    if (token) {
      try {
        await apiClient(`/records/${record.id}`, {
          method: "PUT",
          body: JSON.stringify({
            ...record,
            is_complete: !record.is_complete,
          }),
        });
        fetchRecords();
      } catch (e) {
        console.error(e);
      }
    } else {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === record.id ? { ...r, is_complete: !r.is_complete } : r,
        ),
      );
    }
  };

  const handleDeleteRecord = async (id: number) => {
    if (!confirm("本当に削除しますか?")) return;

    if (token) {
      try {
        await apiClient(`/records/${id}`, { method: "DELETE" });
        fetchRecords();
      } catch (e) {
        console.error(e);
      }
    } else {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const activeRecords = records.filter((r) => !r.is_complete);
  const totalPendingAmount = activeRecords.reduce(
    (sum, r) => sum + (r.amount || 0),
    0,
  );
  const pendingCount = activeRecords.length;

  return (
    <div>
      <Header
        token={token}
        handleLogout={handleLogout}
        handleTransfar={handleTransfar}
      />
      <main>
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h2 className="text-xl font-black text-gray-900">
                {token ? "マイページ" : "ゲストモード"}
              </h2>
              {token ? (
                <p className="text-green-600 font-bold text-sm mt-1">
                  データはサーバに保存されます。
                </p>
              ) : (
                <p className="text-amber-600 font-bold text-sm mt-1">
                  注意: ブラウザを閉じるとデータが削除されます
                </p>
              )}
            </div>

            {/* サマリー */}
            <Summary
              totalAmount={totalPendingAmount}
              totalItems={pendingCount}
            />

            {/* 入力フォーム */}
            <RecordForm onAdd={handleAddRecord} />

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
  );
};
