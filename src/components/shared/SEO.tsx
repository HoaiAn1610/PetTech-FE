import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export function SEO({ title, description, ogTitle, ogDescription, ogImage }: SEOProps) {
  useEffect(() => {
    document.title = title;

    // Helper function to set or update meta tags
    const updateMetaTag = (name: string, value: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", value);
    };

    // Update standard meta tags
    updateMetaTag("description", description);
    
    // Update OpenGraph social sharing meta tags
    updateMetaTag("og:title", ogTitle || title, true);
    updateMetaTag("og:description", ogDescription || description, true);
    updateMetaTag("og:image", ogImage || "https://images.unsplash.com/photo-1733783489145-f3d3ee7a9ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", true);
    updateMetaTag("og:type", "website", true);
    
    // Update Twitter Cards meta tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", ogTitle || title);
    updateMetaTag("twitter:description", ogDescription || description);
    updateMetaTag("twitter:image", ogImage || "https://images.unsplash.com/photo-1733783489145-f3d3ee7a9ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080");

  }, [title, description, ogTitle, ogDescription, ogImage]);

  return null;
}

export default SEO;
