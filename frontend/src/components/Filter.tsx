import type { FilterStatus } from "../types";

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
}

export const Filter = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
}: Props) => {
  return (
    <div>
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
                filterStatus === status
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {status === "ALL"
                ? "すべて"
                : status === "ACTIVE"
                  ? "未完了"
                  : "完了済み"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
