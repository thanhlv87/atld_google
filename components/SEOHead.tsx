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
  schema?: any; // Thêm Schema JSON-LD tùy chọn
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
  articleSection,
  schema,
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

    const canonicalUrl = url || window.location.href;
    updateMetaTag('property', 'og:url', canonicalUrl);

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
    updateMetaTag('property', 'twitter:url', canonicalUrl);

    // Update canonical URL
    updateCanonicalLink(canonicalUrl);

    // Update or create custom JSON-LD schema
    const existingScript = document.querySelector('script[data-seo-schema="true"]');
    if (existingScript) {
      existingScript.remove();
    }
    if (schema) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-schema', 'true');
      script.text = typeof schema === 'string' ? schema : JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup custom schema on unmount
      const scriptToCleanup = document.querySelector('script[data-seo-schema="true"]');
      if (scriptToCleanup) {
        scriptToCleanup.remove();
      }
    };
  }, [
    title,
    description,
    image,
    url,
    type,
    keywords,
    author,
    publishedTime,
    modifiedTime,
    articleSection,
    schema,
  ]);

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
