'use client';

import { useState, useEffect } from 'react';

type Level = 'serious' | 'normal' | 'light' | 'joke';

interface HistoryItem {
  id: string;
  scenarioId: number;
  scenarioText: string;
  level: Level;
  excuse: string;
  timestamp: number;
}

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>('normal');
  const [generatedExcuse, setGeneratedExcuse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const scenarios = [
    {
      category: '学校',
      emoji: '🏫',
      color: 'bg-pink-100 hover:bg-pink-200',
      items: [
        { id: 1, text: '遅刻した - 先生に何て言おう...' },
        { id: 2, text: '宿題やってない - 明日提出なのに...' },
        { id: 3, text: '授業サボった - 欠席連絡が必要...' },
      ],
    },
    {
      category: '友達',
      emoji: '👥',
      color: 'bg-blue-100 hover:bg-blue-200',
      items: [
        { id: 4, text: '遊びの誘い断りたい - でも角立てたくない...' },
        { id: 5, text: 'LINE返信遅れた - 既読ついてるのに...' },
        { id: 6, text: '約束ドタキャン - 今から行けない...' },
      ],
    },
    {
      category: '恋愛',
      emoji: '💕',
      color: 'bg-rose-100 hover:bg-rose-200',
      items: [
        { id: 7, text: 'デート断りたい - でも嫌われたくない...' },
        { id: 8, text: '告白の返事保留 - もう少し考えたい...' },
      ],
    },
    {
      category: 'バイト',
      emoji: '💼',
      color: 'bg-yellow-100 hover:bg-yellow-200',
      items: [
        { id: 9, text: 'バイト辞めたい - 店長に伝えなきゃ...' },
        { id: 10, text: '急に休みたい - 当日だけど無理...' },
      ],
    },
  ];

  const levels = [
    { id: 'serious', label: '真面目' },
    { id: 'normal', label: '普通' },
    { id: 'light', label: 'ちょいふざけ' },
    { id: 'joke', label: '完全ネタ' },
  ];

  // ローカルストレージから履歴を読み込み
  useEffect(() => {
    const savedHistory = localStorage.getItem('excuseHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // 履歴をローカルストレージに保存
  const saveHistory = (newItem: HistoryItem) => {
    const updatedHistory = [newItem, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('excuseHistory', JSON.stringify(updatedHistory));
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const generateExcuse = async (scenarioId: number) => {
    setIsLoading(true);
    setSelectedScenario(scenarioId);
    setGeneratedExcuse('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenarioId,
          level: selectedLevel,
        }),
      });

      if (!response.ok) {
        throw new Error('生成に失敗しました');
      }

      const data = await response.json();
      setGeneratedExcuse(data.excuse);

      // 履歴に追加
      const scenarioText = scenarios
        .flatMap((s) => s.items)
        .find((item) => item.id === scenarioId)?.text || '';

      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        scenarioId,
        scenarioText,
        level: selectedLevel,
        excuse: data.excuse,
        timestamp: Date.now(),
      };
      saveHistory(historyItem);
    } catch (error) {
      console.error('Error:', error);
      showToastMessage('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedExcuse) {
      navigator.clipboard.writeText(generatedExcuse);
      showToastMessage('コピーしました!');
    }
  };

  const handleRegenerate = () => {
    if (selectedScenario) {
      generateExcuse(selectedScenario);
    }
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setGeneratedExcuse('');
  };

  const handleShareResult = () => {
    const url = window.location.href;
    const text = `${generatedExcuse}\n\n言い訳ジェネレーターで生成しました!\n${url}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleShareTool = () => {
    const url = window.location.href;
    const text = `言い訳ジェネレーター使ってみた!\n10秒で完璧な言い訳が作れる!\n${url}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setSelectedScenario(item.scenarioId);
    setSelectedLevel(item.level);
    setGeneratedExcuse(item.excuse);
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            言い訳ジェネレーター
          </h1>
          <p className="text-lg text-gray-600">10秒で完璧な言い訳</p>
        </div>

        {!generatedExcuse ? (
          <>
            {/* レベル選択 */}
            <div className="mb-8 bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-700 mb-4">
                もっともらしさレベル
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id as Level)}
                    className={`py-2 px-4 rounded-lg font-medium transition-all ${
                      selectedLevel === level.id
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* シチュエーション選択セクション */}
            <div className="space-y-8">
              {scenarios.map((scenario) => (
                <div key={scenario.category} className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                    <span className="text-2xl">{scenario.emoji}</span>
                    <span>{scenario.category}</span>
                  </h2>
                  <div className="space-y-2">
                    {scenario.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => generateExcuse(item.id)}
                        disabled={isLoading}
                        className={`w-full ${scenario.color} border-2 border-transparent hover:border-gray-300 transition-all duration-200 rounded-xl p-4 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <span className="text-gray-700 font-medium">
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* 生成結果 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                生成された言い訳
              </h2>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {generatedExcuse}
                </p>
              </div>

              {/* アクションボタン */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <span>📋</span>
                  <span>コピー</span>
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  <span>🔄</span>
                  <span>再生成</span>
                </button>
              </div>

              {/* シェアボタン */}
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-700">シェア</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleShareResult}
                    className="bg-sky-400 hover:bg-sky-500 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    結果をシェア
                  </button>
                  <button
                    onClick={handleShareTool}
                    className="bg-purple-400 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    ツールを紹介
                  </button>
                </div>
              </div>

              {/* 戻るボタン */}
              <button
                onClick={handleReset}
                className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                別の言い訳を作る
              </button>
            </div>
          </div>
        )}

        {/* 生成履歴 */}
        {history.length > 0 && !generatedExcuse && (
          <div className="mt-10 bg-white rounded-2xl p-6 shadow-md">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-bold text-gray-700">
                過去の生成履歴 ({history.length}件)
              </h3>
              <span className="text-gray-500">
                {showHistory ? '▲' : '▼'}
              </span>
            </button>

            {showHistory && (
              <div className="mt-4 space-y-3">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
                  >
                    <p className="text-sm text-gray-600 mb-1">
                      {item.scenarioText}
                    </p>
                    <p className="text-gray-800 text-sm line-clamp-2">
                      {item.excuse}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* フッター */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>困った時の救世主</p>
        </div>

        {/* トースト通知 */}
        {showToast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in-up">
            {toastMessage}
          </div>
        )}

        {/* ローディング中 */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-700 font-medium">言い訳を生成中...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
