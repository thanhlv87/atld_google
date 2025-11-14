import React, { useState, useEffect } from 'react';
import {
  db,
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs
} from '../services/firebaseConfig';
import { BlogPost } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import BlogCard from '../components/BlogCard';
import { Page } from '../App';
import LazyImage from '../components/LazyImage';

interface BlogDetailPageProps {
  postId: string;
  onNavigate: (page: Page, postId?: string) => void;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ postId, onNavigate }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postRef = doc(db, 'blogPosts', postId);
        const postDoc = await getDoc(postRef);

        if (!postDoc.exists()) {
          setError('Bài viết không tồn tại');
          setLoading(false);
          return;
        }

        const postData = { id: postDoc.id, ...postDoc.data() } as BlogPost;
        setPost(postData);

        // Update document title and meta tags
        document.title = `${postData.title} | SafetyConnect`;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', postData.excerpt);
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', `${postData.title} | SafetyConnect`);
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute('content', postData.excerpt);
        }

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage && postData.coverImage) {
          ogImage.setAttribute('content', postData.coverImage);
        }

        // Update Twitter Card tags
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        if (twitterTitle) {
          twitterTitle.setAttribute('content', `${postData.title} | SafetyConnect`);
        }

        const twitterDescription = document.querySelector('meta[property="twitter:description"]');
        if (twitterDescription) {
          twitterDescription.setAttribute('content', postData.excerpt);
        }

        const twitterImage = document.querySelector('meta[property="twitter:image"]');
        if (twitterImage && postData.coverImage) {
          twitterImage.setAttribute('content', postData.coverImage);
        }

        // Increment view count (silently fail if not authorized)
        try {
          await updateDoc(postRef, {
            viewCount: increment(1)
          });
        } catch (error) {
          // Ignore permission errors for view count
          console.log('Could not update view count (expected for non-admin users)');
        }

        // Fetch related posts (same category, limit 3)
        const relatedQuery = query(
          collection(db, 'blogPosts'),
          where('published', '==', true),
          where('category', '==', postData.category),
          orderBy('publishedAt', 'desc'),
          firestoreLimit(4)
        );
        const relatedSnapshot = await getDocs(relatedQuery);
        const related = relatedSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as BlogPost))
          .filter(p => p.id !== postId)
          .slice(0, 3);
        setRelatedPosts(related);

        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError('Không thể tải bài viết');
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner size="large" message="Đang tải bài viết..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-lg shadow-lg p-12">
          <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lỗi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => onNavigate('blog' as Page)}
            className="bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all"
          >
            Quay lại Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => onNavigate('blog' as Page)}
            className="text-primary hover:text-orange-500 font-semibold flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
            Quay lại Blog
          </button>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-96 bg-gray-900">
        <LazyImage
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block bg-gradient-to-r from-primary to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
                <span>{post.author.name}</span>
              </div>
              <span>•</span>
              <span>
                <i className="fas fa-calendar-alt mr-2"></i>
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span>•</span>
              <span>
                <i className="fas fa-eye mr-2"></i>
                {post.viewCount} lượt xem
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Excerpt */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <p className="text-xl text-gray-700 italic border-l-4 border-primary pl-6">
              {post.excerpt}
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-primary prose-strong:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Social Sharing */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <i className="fas fa-share-alt text-primary"></i>
              Chia sẻ bài viết
            </h3>
            <div className="flex flex-wrap gap-3">
              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <i className="fab fa-facebook-f"></i>
                Facebook
              </a>

              {/* Zalo Share */}
              <a
                href={`https://chat.zalo.me/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <i className="fas fa-comment-dots"></i>
                Zalo
              </a>

              {/* Copy Link */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Đã sao chép link!');
                }}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <i className="fas fa-link"></i>
                Sao chép link
              </button>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i className="fas fa-tags text-primary"></i>
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <i className="fas fa-newspaper text-primary"></i>
                Bài viết liên quan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard
                    key={relatedPost.id}
                    post={relatedPost}
                    onClick={() => onNavigate('blog-detail' as Page, relatedPost.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
