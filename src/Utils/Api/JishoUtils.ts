import { JishoApiUrl } from "../../constants";

export type JishoResult = {
  slug: string;
  is_common: boolean;
  japanese: { word: string; reading: string }[];
  jlpt: string[];
  senses: { english_definitions: string[] }[];
};

export async function searchJisho(searchTerm: string): Promise<JishoResult[]> {
  const url = `${JishoApiUrl}/search/words?keyword=${encodeURIComponent(searchTerm)}`;
  const data = await fetch(url).then(d => d.json());
  return data.data;
}
