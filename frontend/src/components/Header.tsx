interface Props {
  token: string | null;
  handleLogout: () => void;
  handleTransfar: (transfar: string) => void;
}

export const Header = ({ token, handleLogout, handleTransfar }: Props) => {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="flex items-center justify-between md:max-w-6xl max-w-md mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-extrabold text-gray-900">
          貸し借りマネージャー
        </h1>

        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 rounded-lg font-bold hover:bg-gray-300 transition"
          >
            {token ? "ログアウト" : "ログイン"}
          </button>

          <button
            onClick={() => handleTransfar("register")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-300 transition"
          >
            登録
          </button>
        </div>
      </div>
    </header>
  );
};
