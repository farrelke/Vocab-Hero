import { getJsonFile } from "./FetchUtils";


export async function getVocabDecks(): Promise<{ name: string, download_url: string }> {
  const files = await getJsonFile("https://api.github.com/repos/farrelke/chinese-vocab/contents/data");
  console.log(files);
  return files as any;
}