'use client';

import { useState, useEffect } from 'react';

export default function Publish() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      setArticles(data);
      if (data.length > 0) {
        setSelectedArticle(data[0]);
      }
    } catch (error) {
      console.error('获取文章列表失败:', error);
    }
  };

  const handlePublish = async () => {
    if (!selectedArticle) return;
    
    setIsPublishing(true);
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId: selectedArticle.id }),
      });
      
      if (response.ok) {
        alert('发布成功！');
        fetchArticles(); // 刷新文章列表
      } else {
        throw new Error('发布失败');
      }
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">发布管理</h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">待发布文章</h2>
            <div className="space-y-2">
              {articles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    selectedArticle?.id === article.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {article.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">发布设置</h2>
              <button
                onClick={handlePublish}
                disabled={!selectedArticle || isPublishing}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  !selectedArticle || isPublishing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isPublishing ? '发布中...' : '发布到微信'}
              </button>
            </div>

            {selectedArticle ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    文章标题
                  </label>
                  <input
                    type="text"
                    value={selectedArticle.title}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    发布时间
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    发布类型
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="immediate">立即发布</option>
                    <option value="scheduled">定时发布</option>
                  </select>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">请选择一篇文章进行发布</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 