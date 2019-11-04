export function getJsonFile<T>(url: string): Promise<T> {
  return fetch(url).then(response => {
    return response.json();
  });
}
