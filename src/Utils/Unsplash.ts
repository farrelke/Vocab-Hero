


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
        const authorLink = res?.user?.links?.html;
        const author = {
          name: res?.user?.name,
          link:  authorLink ? `${authorLink}?utm_source=vocab-hero&utm_medium=referral` : ''
        };

        return { id: res.id, ...res.urls,  link: res.links?.html, author  };
      })
    );
};


// Unsplash requires apps to call this api when the user does something with a photo
export const triggerPhotoSelected = (image: UnsplashImage) => {
  return fetch(`https://vocab-hero.netlify.app/.netlify/functions/unsplash-download?imageId=${image.id}`);
};