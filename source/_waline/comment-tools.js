import DOMPurify from 'dompurify';
import { loadImage } from 'unlazy';

export const sanitizeComment = html => DOMPurify.sanitize(html, {
  FORBID_TAGS: ['form', 'input', 'style'],
  FORBID_ATTR: ['autoplay', 'style']
});

export const prepareCommentAnchor = async target => {
  const images = Array.from(document.querySelectorAll('main img')).filter(image =>
    target.contains(image) || (image.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING));
  let timeout;
  await Promise.race([
    Promise.all(images.map(image => {
      image.loading = 'eager';
      if (image.dataset.src || image.dataset.srcset) return new Promise(resolve => loadImage(image, resolve));
      return image.decode().catch(() => {});
    })),
    new Promise(resolve => { timeout = setTimeout(resolve, 3000); })
  ]);
  clearTimeout(timeout);
  await new Promise(requestAnimationFrame);
};
