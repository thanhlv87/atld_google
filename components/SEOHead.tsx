import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image = 'https://raw.githubusercontent.com/thanhlv87/pic/refs/heads/main/connected.png',
  url,
  type = 'website',
  keywords = [],
  author,
  publishedTime,
  modifiedTime,
  articleSection
}) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta description
    updateMetaTag('name', 'description', description);

    // Update keywords if provided
    if (keywords.length > 0) {
      updateMetaTag('name', 'keywords', keywords.join(', '));
    }

    // Update author if provided
    if (author) {
      updateMetaTag('name', 'author', author);
    }

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('property', 'og:site_name', 'SafetyConnect');

    if (url) {
      updateMetaTag('property', 'og:url', url);
    }

    // Article-specific Open Graph tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('property', 'article:published_time', publishedTime);
      }
      if (modifiedTime) {
        updateMetaTag('property', 'article:modified_time', modifiedTime);
      }
      if (author) {
        updateMetaTag('property', 'article:author', author);
      }
      if (articleSection) {
        updateMetaTag('property', 'article:section', articleSection);
      }
    }

    // Update Twitter Card tags
    updateMetaTag('property', 'twitter:card', 'summary_large_image');
    updateMetaTag('property', 'twitter:title', title);
    updateMetaTag('property', 'twitter:description', description);
    updateMetaTag('property', 'twitter:image', image);

    if (url) {
      updateMetaTag('property', 'twitter:url', url);
    }

    // Update canonical URL
    if (url) {
      updateCanonicalLink(url);
    }
  }, [title, description, image, url, type, keywords, author, publishedTime, modifiedTime, articleSection]);

  return null;
};

// Helper function to update or create meta tags
function updateMetaTag(attribute: string, attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attributeValue);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

// Helper function to update canonical link
function updateCanonicalLink(url: string) {
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }

  canonicalLink.setAttribute('href', url);
}

export default SEOHead;

