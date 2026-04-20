import React, {useState} from 'react';

interface Props {
    onLogin: (token: string) => void;
}

export const AuthForm = ({onLogin}: Props) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/login' : '/signup';
        const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

        try {
            const options: RequestInit = isLogin
                ? {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams({username, password})
                }
                : {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username, password})
                };
            const response = await fetch(`${BASE_URL}${endpoint}`, options);
            const data = await response.json();

            if (!response.ok) throw new Error(data.detail || '認証に失敗しました');

            if (isLogin) {
                onLogin(data.access_token);
            } else {
                alert('登録完了! ログインしてください');
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-sm mx-auto">
            <h2 className="text-2xl font-black mb-6 text-center">
                {isLogin ? 'おかえりなさい': 'アカウント作成'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ユーザー名 */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">ユーザ名</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-blue-400"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required>
                    </input>
                </div>

                {/* パスワード */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">パスワード</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-blue-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required>
                    </input>
                </div>

                {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-700 transition shadow-lg shadow-blue-200"
                >
                    {isLogin ? 'ログイン': '新規登録'}
                </button>
            </form>

            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="w-full mt-4 text-sm text-gray-500 font-bold hover:underline"
            >
                {isLogin ? 'まだアカウントがない方はこちら': 'すでにアカウントをお持ちの方'}
            </button>
        </div>
    );
};
