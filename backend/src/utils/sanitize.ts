import sanitizeHtml from 'sanitize-html';

/**
 * Removes markup from user-controlled values that are stored and later shown
 * as plain text. React already escapes text nodes, but sanitizing here also
 * prevents unsafe markup from being persisted for future renderers.
 */
export function sanitizePlainText(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
  }).trim();
}

export function isSafeExternalUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}
