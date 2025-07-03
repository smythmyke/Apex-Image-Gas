/**
 * Convert markdown to HTML with proper formatting
 * Based on govtoolspro's approach
 */

function convertMarkdownToHTML(markdown) {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Remove markdown code block wrappers if present
  if (html.startsWith('```markdown') && html.endsWith('```')) {
    html = html
      .replace(/^```markdown\n?/, '')
      .replace(/\n?```$/, '')
      .trim();
  }
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*\*(.*)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Lists - Handle both * and - formats
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
  html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Numbered lists
  html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');
  
  // Blockquotes
  html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');
  
  // Code blocks
  html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr>');
  
  // Fix list grouping
  html = html.replace(/(<li>.*?<\/li>)\s*(?=<li>)/gs, '$1');
  html = html.replace(/(<li>.*?<\/li>)(?!\s*<li>)/gs, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  
  // Convert double newlines to paragraphs
  html = html.split('\n\n').map(para => {
    para = para.trim();
    
    // Don't wrap if it's already HTML or starts with special markdown characters
    if (para && !para.startsWith('<') && !para.match(/^[#*>\-\d]/)) {
      return `<p>${para}</p>`;
    }
    
    return para;
  }).join('\n\n');
  
  // Clean up extra newlines
  html = html.replace(/\n{3,}/g, '\n\n');
  
  return html;
}

module.exports = { convertMarkdownToHTML };