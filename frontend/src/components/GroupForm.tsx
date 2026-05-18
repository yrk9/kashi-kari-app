import { useState } from "react";
import { apiClient } from "../api";

export const GroupForm = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [generatedUrl, setGeneratedUrl] = useState("");

  const handleCreate = async () => {
    const response = await apiClient("/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ description, total_amount: amount }),
    });

    if (response.ok) {
      const data = await response.json();
      // 共有URLを生成 (uuidを使用)
      const url = `${window.location.origin}/group/${data.id}`;
      setGeneratedUrl(url);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6">グループ精算を作成</h2>

      {!generatedUrl ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="何代?"
            className="w-full p-3 border roundedd-xl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></input>

          <input
            type="number"
            placeholder="合計金額"
            className="w-full p-3 border rounded-xl"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          ></input>

          <button
            onClick={handleCreate}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold"
          >
            リンクを発行する
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-green-600 font-bold">リンクが作成されました</p>
          <div className="p-3 bg-gray-100 rounded-lg break-all text-sm">
            {generatedUrl}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(generatedUrl)}
            className="w-full py-2 bg-gray-800 text-white rounded-xl text-sm"
          >
            URLをコピーする
          </button>
        </div>
      )}
    </div>
  );
};
