import { getJsonFile } from "./FetchUtils";


export type GithubFile = {
  name: string, downloadUrl: string
}

export async function getVocabDecks(): Promise<GithubFile> {
  const files = await getJsonFile("https://api.github.com/repos/farrelke/chinese-vocab/contents/VocabLists") as any;
  return files.map(file => {
    const name = file.name.replace(/\.[^/.]+$/, "");
    return { name, downloadUrl: file.download_url };
  })
}