import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import LoadingSpinner from './LoadingSpinner';

interface AIBlogWriterProps {
  onGenerate: (data: {
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
    suggestedCategory: string;
  }) => void;
}

const AIBlogWriter: React.FC<AIBlogWriterProps> = ({ onGenerate }) => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('An toàn lao động');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setApiKeySaved(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim().startsWith('AIza')) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setApiKeySaved(true);
      setShowApiKeyInput(false);
      setError('');
    } else {
      setError('API key không hợp lệ. Key phải bắt đầu bằng "AIza"');
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setApiKeySaved(false);
  };

  const categories = [
    'An toàn lao động',
    'Luật lệ & Quy định',
    'Case Study',
    'Tin tức',
    'Hướng dẫn',
    'Kiến thức chuyên sâu'
  ];

  // Sample topics for quick selection
  const sampleTopics = [
    'Quy định mới về an toàn điện trong công nghiệp',
    'Cách phòng tránh tai nạn lao động tại công trường xây dựng',
    'Hướng dẫn sử dụng thiết bị bảo hộ lao động đúng cách',
    'Nghị định 44/2016 về An toàn vệ sinh lao động',
    'Kỹ năng sơ cấp cứu cơ bản tại nơi làm việc',
    'Đánh giá rủi ro an toàn lao động theo ISO 45001',
    'Phòng cháy chữa cháy trong nhà máy sản xuất',
    'An toàn hóa chất trong phòng thí nghiệm'
  ];

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Vui lòng nhập API key trước. Click "Cài đặt API Key"');
      setShowApiKeyInput(true);
      return;
    }

    if (!topic.trim()) {
      setError('Vui lòng nhập chủ đề bài viết');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Bạn là một chuyên gia về An toàn Lao động tại Việt Nam. Hãy viết một bài blog chuyên nghiệp, chi tiết và hữu ích về chủ đề sau:

Chủ đề: ${topic.trim()}
Danh mục: ${category}
${keywords ? `Từ khóa liên quan: ${keywords.trim()}` : ''}

Yêu cầu:
1. Viết bằng tiếng Việt chuẩn, chuyên nghiệp
2. Nội dung phải chính xác, dựa trên quy định pháp luật Việt Nam (Luật An toàn Lao động, các Nghị định, Thông tư liên quan)
3. Cấu trúc rõ ràng với các heading (dùng HTML tags: <h2>, <h3>)
4. Độ dài: 800-1200 từ
5. Bao gồm:
   - Mở bài giới thiệu vấn đề
   - Nội dung chính với các tiểu mục
   - Phần kết luận và khuyến nghị
6. Sử dụng các thẻ HTML để format: <p>, <strong>, <em>, <ul>, <ol>, <li>
7. Tạo nội dung SEO-friendly nhưng tự nhiên
8. Đưa ra ví dụ thực tế nếu có thể

Trả về theo định dạng JSON với cấu trúc sau:
{
  "title": "Tiêu đề bài viết hấp dẫn (60-80 ký tự)",
  "excerpt": "Tóm tắt ngắn gọn 2-3 câu (150-200 ký tự)",
  "content": "Nội dung đầy đủ với HTML formatting",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "suggestedCategory": "Danh mục phù hợp nhất"
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      let blogData;
      try {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
        const jsonText = jsonMatch ? jsonMatch[1] : text;
        blogData = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parseError);
        blogData = {
          title: topic,
          excerpt: text.substring(0, 200) + '...',
          content: text,
          tags: keywords ? keywords.split(',').map(k => k.trim()) : [],
          suggestedCategory: category
        };
      }

      onGenerate({
        title: blogData.title,
        excerpt: blogData.excerpt,
        content: blogData.content,
        tags: blogData.tags || [],
        suggestedCategory: blogData.suggestedCategory || category
      });

      // Reset form
      setTopic('');
      setKeywords('');

    } catch (err: any) {
      console.error('Error generating blog:', err);
      if (err.message?.includes('API_KEY_INVALID')) {
        setError('API key không hợp lệ. Vui lòng kiểm tra lại.');
        setShowApiKeyInput(true);
      } else {
        setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <i className="fas fa-magic text-white text-xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">AI Blog Writer</h3>
            <p className="text-sm text-gray-600">Tạo bài viết chuyên nghiệp với Gemini AI</p>
          </div>
        </div>
        <button
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            apiKeySaved
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          }`}
        >
          <i className={`fas ${apiKeySaved ? 'fa-check-circle' : 'fa-key'}`}></i>
          {apiKeySaved ? 'API Key đã lưu' : 'Cài đặt API Key'}
        </button>
      </div>

      {/* API Key Input */}
      {showApiKeyInput && (
        <div className="bg-white rounded-lg p-4 mb-4 border-2 border-purple-300">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fas fa-key text-purple-500"></i>
            Cấu hình Gemini API Key
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="AIza..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Lấy API key tại: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">https://aistudio.google.com/app/apikey</a>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveApiKey}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2"
              >
                <i className="fas fa-save"></i>
                Lưu API Key
              </button>
              {apiKeySaved && (
                <button
                  onClick={handleClearApiKey}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-all flex items-center gap-2"
                >
                  <i className="fas fa-trash"></i>
                  Xóa
                </button>
              )}
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
            Chủ đề bài viết
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
            placeholder="VD: Hướng dẫn sử dụng thiết bị bảo hộ lao động trong môi trường nguy hiểm"
          />
        </div>

        {/* Sample Topics */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2"
          >
            <i className={`fas fa-chevron-${showAdvanced ? 'up' : 'down'}`}></i>
            {showAdvanced ? 'Ẩn tùy chọn nâng cao' : 'Hiện tùy chọn nâng cao & gợi ý'}
          </button>
        </div>

        {showAdvanced && (
          <>
            {/* Quick Topics */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <i className="fas fa-star text-yellow-500 mr-2"></i>
                Gợi ý chủ đề phổ biến
              </label>
              <div className="flex flex-wrap gap-2">
                {sampleTopics.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setTopic(sample)}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-2 rounded-full hover:bg-purple-200 transition-all"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Từ khóa liên quan (tùy chọn)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="VD: thiết bị bảo hộ, mũ bảo hiểm, giày an toàn"
              />
              <p className="text-xs text-gray-500 mt-1">Giúp AI tạo nội dung tập trung hơn vào các khía cạnh bạn muốn</p>
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <i className="fas fa-exclamation-circle mt-1"></i>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="small" />
              <span>Đang tạo bài viết với AI...</span>
            </>
          ) : (
            <>
              <i className="fas fa-wand-magic-sparkles"></i>
              <span>Tạo bài viết với AI</span>
            </>
          )}
        </button>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <i className="fas fa-info-circle text-blue-500 mt-1"></i>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold">Cách sử dụng:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Nhập chủ đề bài viết hoặc chọn từ gợi ý</li>
                <li>Chọn danh mục và thêm từ khóa nếu muốn (tùy chọn)</li>
                <li>Nhấn "Tạo bài viết với AI" và đợi 10-20 giây</li>
                <li>AI sẽ tự động điền tiêu đề, tóm tắt, nội dung và tags</li>
                <li>Xem lại, chỉnh sửa nếu cần, rồi publish!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBlogWriter;
