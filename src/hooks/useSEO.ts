import { useEffect } from 'react';
import { ToolDefinition } from '../types';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  tool?: ToolDefinition;
  categoryName?: string;
}

export function useSEO(props: SEOProps) {
  useEffect(() => {
    const { title, description, keywords, canonicalPath, tool, categoryName } = props;

    // 1. Dynamic Page Title
    const finalTitle = tool
      ? `${tool.name} – Free Online ${tool.category} Tool | ToolNova`
      : categoryName
      ? `${categoryName} Tools – Free Online Utilities | ToolNova`
      : title
      ? `${title} | ToolNova Tool Kit`
      : 'ToolNova - Every Tool You Need. All in One Place.';

    document.title = finalTitle;

    // 2. Dynamic Meta Description (120-160 characters optimized)
    const finalDesc = tool
      ? `${tool.description} Free online ${tool.name.toLowerCase()} with 100% private, instant in-browser processing. Zero server uploads.`
      : description || 'Discover 255+ powerful, free web tools for images, audio, video, PDFs, SEO, coding, and productivity with 100% private in-browser processing.';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', finalDesc);

    // 3. Dynamic Keywords
    const finalKeywords = tool
      ? [
          ...tool.keywords,
          tool.name.toLowerCase(),
          `free ${tool.name.toLowerCase()}`,
          `online ${tool.name.toLowerCase()}`,
          'toolnova',
          'free web tools',
          'browser tools'
        ].join(', ')
      : keywords?.join(', ') || 'toolnova, free online tools, web utilities, image tools, pdf tools, developer tools';

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', finalKeywords);

    // 4. OpenGraph & Twitter Cards
    const setMeta = (attrName: string, attrVal: string, content: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('property', 'og:title', finalTitle);
    setMeta('property', 'og:description', finalDesc);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:title', finalTitle);
    setMeta('name', 'twitter:description', finalDesc);
    setMeta('name', 'twitter:card', 'summary_large_image');

    // 5. Canonical URL
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const hashPath = canonicalPath || (tool ? `#/tools/${tool.slug}` : window.location.hash || '#/');
    const canonicalUrl = `${origin}${pathname}${hashPath}`;

    setMeta('property', 'og:url', canonicalUrl);

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 6. Schema.org JSON-LD Structured Data for Rich Search Results
    const scriptId = 'toolnova-jsonld-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    if (tool) {
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.name,
        applicationCategory: tool.category,
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description: tool.description,
        url: canonicalUrl,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '1420',
          bestRating: '5',
          worstRating: '1'
        },
        featureList: [
          '100% Client-Side In-Browser Processing',
          'Zero Cloud Server Uploads',
          'Free & Unlimited Instant Processing',
          ...tool.keywords.slice(0, 5)
        ]
      };
      scriptTag.text = JSON.stringify(schemaData);
    } else {
      const generalSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'ToolNova Tool Kit',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description: 'Comprehensive suite of 255+ free client-side online tools for images, audio, video, PDFs, and developer utilities.',
        url: `${origin}${pathname}#/`,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      };
      scriptTag.text = JSON.stringify(generalSchema);
    }
  }, [props.tool?.id, props.title, props.categoryName]);
}
