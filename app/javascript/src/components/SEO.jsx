import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { SEOConfig } from './SEOConfig';

const SEO = () => {
  const location = useLocation();
  const route = SEOConfig.routes[location.pathname] || SEOConfig.default;
  const canonicalUrl = `https://www.format-forge.in${location.pathname}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{route.title}</title>
      <meta name="description" content={route.description} />
      <meta name="keywords" content={route.keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={route.title} />
      <meta property="og:description" content={route.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={SEOConfig.default.image} />
      <meta property="og:site_name" content="Format Forge" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={route.title} />
      <meta name="twitter:description" content={route.description} />
      <meta name="twitter:image" content={SEOConfig.default.image} />

      {/* Schema.org JSON-LD */}
      {route.schema && (
        <script type="application/ld+json">
          {JSON.stringify(route.schema)}
        </script>
      )}
    </Helmet>
  );
};
export default SEO;