interface Props {
  handleTransfar: (transfar: string) => void;
}

export const TopPage = ({ handleTransfar }: Props) => {
  return (
    <div>
      <header className="flex justify-end items-center mb-8 px-4 py-4">
        <button
          onClick={() => handleTransfar("login")}
          className="px-4 py-2 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
        >
          ログイン
        </button>
      </header>

      <main>
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-md mx-auto flex flex-col gap-4 mt-8">
            {/* タイトル */}
            <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8 flex items-center justify-center gap-2">
              貸し借りマネージャー
            </h1>

            <button
              onClick={() => handleTransfar("dashboard")}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-700 transition shadow-lg shadow-blue-200"
            >
              個別の貸し借り
            </button>

            <button
              onClick={() => handleTransfar("group")}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-700 transition shadow-lg shadow-blue-200"
            >
              グループで貸し借り
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
