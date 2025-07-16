// Simple HTML sanitizer for safe content rendering
export default function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Recursively sanitize nodes
  return sanitizeNode(tempDiv);
}

function sanitizeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    const tagName = element.tagName.toLowerCase();
    
    // Only allow safe tags
    if (!isAllowedTag(tagName)) {
      return element.textContent || '';
    }

    // Process attributes
    const sanitizedAttributes = sanitizeAttributes(element);
    
    // Process child nodes
    const childContent = Array.from(element.childNodes)
      .map(sanitizeNode)
      .join('');

    // Return sanitized element
    return `<${tagName}${sanitizedAttributes}>${childContent}</${tagName}>`;
  }

  return '';
}

function isAllowedTag(tagName: string): boolean {
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'u', 'i', 'b', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'code', 'pre'
  ];
  return allowedTags.includes(tagName);
}

function sanitizeAttributes(element: Element): string {
  const allowedAttributes = ['class', 'id', 'style'];
  const attributes: string[] = [];

  for (const attr of allowedAttributes) {
    const value = element.getAttribute(attr);
    if (value) {
      // Basic attribute value sanitization
      const sanitizedValue = value.replace(/[<>"']/g, '');
      attributes.push(`${attr}="${sanitizedValue}"`);
    }
  }

  return attributes.length > 0 ? ` ${attributes.join(' ')}` : '';
} 