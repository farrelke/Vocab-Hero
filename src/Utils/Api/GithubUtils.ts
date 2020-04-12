import { getJsonFile } from "../FetchUtils";

const GithubApiUrl = "https://api.github.com/repos/farrelke/Vocab-Hero/contents";
const GithubRawUrl = "https://raw.githubusercontent.com/farrelke/chinese-vocab/master";

export type GithubFile = {
  name: string;
  downloadUrl: string;
};

export async function getVocabDecks(): Promise<GithubFile[]> {
  const files = (await getJsonFile(`${GithubApiUrl}/VocabLists`)) as any;
  return files.map(file => {
    // remove .json from the file name
    const name = file.name.replace(/\.[^/.]+$/, "");
    return { name, downloadUrl: file.download_url };
  });
}

export function getHskDecks(): GithubFile[] {
  return [1, 2, 3, 4, 5, 6].map(level => ({
    name: `Hsk ${level}`,
    downloadUrl: `${GithubRawUrl}/data/hsk/hsk-${level}.json`
  }));
}

export function getShanghaineseDecks(): GithubFile[] {
  return [{ name: "Hsk 1", link: "hsk-1.zip" }, { name: "Hsk 2", link: "hsk-2.zip"  }].map(file => ({
    name: file.name,
    downloadUrl: `${GithubRawUrl}/data/shanghainese/${file.link}`
  }));
}
