import React, { useState, useEffect } from 'react';
import {
  db,
  storage,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  storageRef,
  uploadBytes,
  getDownloadURL,
  type User
} from '../services/firebaseConfig';
import { BlogPost } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface BlogManagementProps {
  user: User;
}

const BlogManagement: React.FC<BlogManagementProps> = ({ user }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('An toàn lao động');
  const [tags, setTags] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [published, setPublished] = useState(true);

  const categories = [
    'An toàn lao động',
    'Luật lệ & Quy định',
    'Case Study',
    'Tin tức',
    'Hướng dẫn',
    'Kiến thức chuyên sâu'
  ];

  useEffect(() => {
    const postsCollection = collection(db, 'blogPosts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BlogPost));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setTitle('');
    setExcerpt('');
    setContent('');
    setCategory('An toàn lao động');
    setTags('');
    setCoverImageFile(null);
    setCoverImageUrl('');
    setPublished(false);
    setEditingPost(null);
    setShowForm(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCategory(post.category);
    setTags(post.tags.join(', '));
    setCoverImageUrl(post.coverImage);
    setPublished(post.published);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!coverImageFile) return coverImageUrl;

    const fileName = `blog-covers/${Date.now()}_${coverImageFile.name}`;
    const imageRef = storageRef(storage, fileName);
    await uploadBytes(imageRef, coverImageFile);
    return await getDownloadURL(imageRef);
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImage();

      // Check image: required for new post, optional for editing
      if (!imageUrl && !editingPost) {
        alert('Vui lòng chọn ảnh bìa');
        setUploading(false);
        return;
      }

      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const slug = generateSlug(title);

      const postData = {
        title: title.trim(),
        slug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        coverImage: imageUrl || coverImageUrl, // Use new image or keep existing
        category,
        tags: tagsArray,
        author: {
          uid: user.uid,
          name: user.displayName || user.email || 'Admin',
          email: user.email || ''
        },
        published,
        viewCount: editingPost?.viewCount || 0,
        updatedAt: serverTimestamp(),
        ...(published && !editingPost?.publishedAt ? { publishedAt: serverTimestamp() } : {})
      };

      if (editingPost) {
        // Update existing post
        await updateDoc(doc(db, 'blogPosts', editingPost.id), postData);
        alert('Cập nhật bài viết thành công!');
      } else {
        // Create new post
        await addDoc(collection(db, 'blogPosts'), {
          ...postData,
          createdAt: serverTimestamp()
        });
        alert('Tạo bài viết thành công!');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;

    try {
      await deleteDoc(doc(db, 'blogPosts', postId));
      alert('Xóa bài viết thành công!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Không thể xóa bài viết');
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Đang tải bài viết..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          <i className="fas fa-newspaper text-primary mr-2"></i>
          Quản lý Blog
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
          {showForm ? 'Đóng' : 'Tạo bài viết'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhập tiêu đề bài viết"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tóm tắt <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                  placeholder="Nhập tóm tắt ngắn gọn (hiển thị trên card)"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={10}
                  placeholder="Nhập nội dung bài viết (hỗ trợ HTML)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Danh mục
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="VD: an-toan, luat-le, huong-dan"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ảnh bìa {!editingPost && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {(coverImageUrl || coverImageFile) && (
                  <p className="text-sm text-green-600 mt-2">
                    <i className="fas fa-check-circle mr-1"></i>
                    {coverImageFile ? 'Ảnh mới đã chọn' : 'Đang dùng ảnh hiện tại'}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Xuất bản bài viết (nếu không chọn, bài viết sẽ ở trạng thái nháp)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <LoadingSpinner size="small" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    {editingPost ? 'Cập nhật' : 'Tạo bài viết'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bài viết
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lượt xem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{post.title}</p>
                        <p className="text-sm text-gray-500">{post.author.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{post.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        post.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {post.published ? 'Đã xuất bản' : 'Nháp'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{post.viewCount}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Xóa"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-inbox text-4xl mb-3"></i>
            <p>Chưa có bài viết nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
