import { useState } from "react";
import type { Record } from "../types";
import { Button } from "./Button";

interface Props {
  onAdd: (record: Omit<Record, "id" | "owner_id">) => Promise<void>;
}

export const RecordForm = ({ onAdd }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"MONEY" | "ITEM">("MONEY");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !content.trim()) {
      setError("名前と内容は必須です。");
      return;
    }

    if (Number(amount) < 0) {
      setError("金額は0円以上を入力してください。");
      return;
    }

    try {
      await onAdd({
        name,
        content,
        amount: amount === "" ? 0 : Number(amount),
        type,
        is_complete: false,
      });

      setName("");
      setContent("");
      setAmount("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit record:", error);
      setError("データの送信に失敗しました。入力内容を確認してください。");
    }
  };

  // 折りたたみ時は追加ボタンのみ表示
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mb-8 py-3 bg-white border border-gray-200 rounded-xl shadow-sm font-bold text-blue-600
              hover:bg-blue-50 hover:border-blue-300 transition"
      >
        ＋ 記録を追加
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100"
    >
      {/*エラーメッセージの表示*/}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded border border-red-200">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-700">記録を追加</h3>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsOpen(false);
          }}
          className="text-sm text-gray-400 font-bold hover:text-gray-600"
        >
          閉じる
        </button>
      </div>
      <div className="space-y-4">
        <input
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        ></input>
        <input
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></input>
        <div className="flex gap-2">
          <input
            type="number"
            className="flex-1 px-4 py-2 border rounded-lg outline-none"
            placeholder="金額"
            value={amount}
            onChange={(e) => {
              const val = e.target.value;
              setAmount(val === "" ? "" : Number(val));
            }}
          ></input>
          <select
            className="px-4 py-2 border rounded-lg bg-white outline-none"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="MONEY">お金</option>
            <option value="ITEM">モノ</option>
          </select>
        </div>
        <Button disabled={!name.trim() || !content.trim()} type="submit">
          登録
        </Button>
      </div>
    </form>
  );
};
