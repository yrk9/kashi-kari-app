interface Props {
  totalAmount: number;
  totalItems: number;
}

export const Summary = ({ totalAmount, totalItems }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-blue-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-200">
        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">
          未返却の合計
        </p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-block">
            {totalAmount.toLocaleString()}
          </span>
          <span className="text-sm opacity-80">円</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
          未完了の件数
        </p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-black text-gray-800">
            {totalItems}
          </span>
          <span className="text-sm text-gray-500 font-bold">件</span>
        </div>
      </div>
    </div>
  );
};
