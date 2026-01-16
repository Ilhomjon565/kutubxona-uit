'use client';

import { useState } from 'react';

interface LogoProps {
  src?: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}

export default function Logo({ 
  src = '/logo.png', 
  alt = 'UIT Logo', 
  className = '',
  width,
  height,
  fallbackSrc = 'https://uit.uz/logo.png'
}: LogoProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // Use direct path for local logo, with cache busting for external
  const logoUrl = imgSrc.startsWith('/') 
    ? imgSrc 
    : imgSrc.includes('uit.uz') 
    ? `${imgSrc}?v=3` 
    : imgSrc;

  return (
    <img
      src={logoUrl}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      loading="eager"
      decoding="async"
      style={{ 
        objectFit: 'contain',
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  );
}

