


export type ImageAuthor = {
  name: string,
  link: string
}

export type UnsplashImage = {
  id: string;
  full: string;
  small: string;
  regular: string;
  raw: string;
  thumb: string;

  link: string,
  author: ImageAuthor
};

export const searchPhotos = (keyword: string): Promise<UnsplashImage[]> => {
  return fetch(`https://vocab-hero.netlify.app/.netlify/functions/unsplash?keyword=${keyword}`)
    .then(res => res.json())
    .then(json =>
      json.results.map(res => {
        const author = { name: res?.user?.name, link: res?.user?.links?.html   };
        return { id: res.id, ...res.urls, link: res.links?.html, author  };
      })
    );
};
