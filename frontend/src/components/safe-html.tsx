import { useMemo } from 'react';
import sanitizeHtml from '../utils/sanitizeHtml';

interface SafeHtmlProps {
  html: string;
  className?: string;
  maxLength?: number;
}

export default function SafeHtml({ html, className = '', maxLength }: SafeHtmlProps) {
  const sanitizedHtml = useMemo(() => {
    const sanitized = sanitizeHtml(html);
    
    if (!maxLength) {
      return sanitized;
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitized;
    const textContent = tempDiv.textContent || '';
    
    if (textContent.length <= maxLength) {
      return sanitized;
    }
    
    // Truncate and add ellipsis
    const truncated = textContent.substring(0, maxLength);
    return `${sanitized.substring(0, sanitized.indexOf(truncated) + truncated.length)}...`;
  }, [html, maxLength]);

  return (
    <div 
      className={className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
} 