export default async function copyToClipboard(value: string): Promise<void> {
  return navigator.clipboard.writeText(value);
}
