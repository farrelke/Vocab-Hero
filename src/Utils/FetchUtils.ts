export async function getJsonFile<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return res.json();
}
