import { getJsonFile } from "../FetchUtils";
import { GithubVocabListsURL } from "../../constants";


export type GithubFile = {
  name: string, downloadUrl: string
}

export async function getVocabDecks(): Promise<GithubFile> {
  const files = await getJsonFile(GithubVocabListsURL) as any;
  return files.map(file => {
    // remove .json from the file name
    const name = file.name.replace(/\.[^/.]+$/, "");
    return { name, downloadUrl: file.download_url };
  })
}