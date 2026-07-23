const NAMESPACE = 'acollie-japanese-verb-quiz';
const KEY = 'hits';

/**
 * Increments and fetches a basic page-view counter via abacus (no-signup, no
 * account required). Returns null on any failure so a blocked/offline
 * request never breaks the page.
 */
export async function incrementAndGetHits(): Promise<number | null> {
  try {
    const res = await fetch(`https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`);
    if (!res.ok) return null;
    const data: { value: number } = await res.json();
    return data.value;
  } catch {
    return null;
  }
}
