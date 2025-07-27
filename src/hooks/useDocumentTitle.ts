import { useEffect } from 'react';

interface UseDocumentTitleProps {
  title: string;
  description?: string;
  keywords?: string;
}

export function useDocumentTitle({ title, description, keywords }: UseDocumentTitleProps) {
  useEffect(() => {
    const previousTitle = document.title;
    const fullTitle = `${title} | Админ-панель кофейни`;
    
    // Store previous meta values for cleanup
    const previousMeta = new Map<string, string>();
    
    // Helper function to update meta tag
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let metaTag = document.querySelector(selector) as HTMLMetaElement;
      
      if (metaTag) {
        previousMeta.set(name, metaTag.getAttribute('content') || '');
      }
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (property) {
          metaTag.setAttribute('property', name);
        } else {
          metaTag.setAttribute('name', name);
        }
        document.head.appendChild(metaTag);
        previousMeta.set(name, '');
      }
      
      metaTag.setAttribute('content', content);
    };
    
    // Update title
    document.title = fullTitle;
    
    // Update basic meta tags
    if (description) {
      updateMetaTag('description', description);
      
      // Open Graph meta tags
      updateMetaTag('og:title', fullTitle, true);
      updateMetaTag('og:description', description, true);
      updateMetaTag('og:type', 'website', true);
      updateMetaTag('og:site_name', 'Админ-панель кофейни', true);
      
      // Twitter Card meta tags
      updateMetaTag('twitter:card', 'summary');
      updateMetaTag('twitter:title', fullTitle);
      updateMetaTag('twitter:description', description);
    }
    
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    
    // Cleanup function to restore previous values
    return () => {
      document.title = previousTitle;
      
      // Restore previous meta values
      previousMeta.forEach((prevContent, metaName) => {
        const selectors = [
          `meta[name="${metaName}"]`,
          `meta[property="${metaName}"]`
        ];
        
        for (const selector of selectors) {
          const metaTag = document.querySelector(selector);
          if (metaTag) {
            if (prevContent) {
              metaTag.setAttribute('content', prevContent);
            } else {
              metaTag.remove();
            }
            break;
          }
        }
      });
    };
  }, [title, description, keywords]);
}