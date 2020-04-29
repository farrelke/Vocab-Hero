

export type UnsplashImage = {
  id: string;
  full: string;
  small: string;
  regular: string;
  raw: string;
  thumb: string;
};

export const searchPhotos = (keyword: string): Promise<UnsplashImage[]> => {
  return fetch(`https://vocab-hero.netlify.app/.netlify/functions/unsplash?keyword=${keyword}`)
    .then(res => res.json())
    .then(json =>
      json.results.map(res => {
        return { id: res.id, ...res.urls };
      })
    );
};
