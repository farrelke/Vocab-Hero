

export type UnsplashImage = {
  id: string;
  full: string;
  small: string;
  regular: string;
  raw: string;
  thumb: string;
};

export const searchPhotos = (keyword: string): Promise<UnsplashImage[]> => {
  return <any>[];
  /* unsplash.search
    .photos(keyword, 1, 10, { orientation: "landscape" })
    .then(res => res.json())
    .then(json =>
      json.results.map(res => {
        return { id: res.id, ...res.urls };
      })
    );

   */
};
