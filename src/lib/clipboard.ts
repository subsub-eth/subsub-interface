/**
 * Copies some text to the clipboard
 * @param text string to be copied
 */
export async function copyTextToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
