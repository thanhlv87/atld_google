import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { Timestamp } from '../services/firebaseConfig';
import LazyImage from './LazyImage';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Link
      to={`/blog/${post.id}`}
      className="block bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
    >
      {/* Cover Image - Square Ratio */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-200">
        <LazyImage
          src={post.coverImage}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-primary to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {post.category}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center gap-2 text-white text-xs">
            <i className="fas fa-calendar-alt"></i>
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            <span className="mx-2">•</span>
            <i className="fas fa-eye"></i>
            <span>{post.viewCount} lượt xem</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white text-xs font-bold">
              {post.author.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-600">{post.author.name}</span>
          </div>
          <button className="text-primary hover:text-orange-500 transition-colors flex items-center gap-2 text-sm font-semibold">
            Đọc thêm
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
