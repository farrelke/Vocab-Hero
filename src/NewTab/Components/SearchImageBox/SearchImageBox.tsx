import * as React from "react";
import { useState } from "react";
import "./SearchImageBox.scss";
import { ImageAuthor, searchPhotos, UnsplashImage } from "../../../Utils/Unsplash";

type Props = {
  initialImage?: { imageUrl?: string; imageAuthor?: ImageAuthor };
  setImageUrl: (url: string, userInfo?: ImageAuthor) => unknown;
};

const SearchImageBox = (props: Props) => {
  const [keyword, setKeyword] = useState("");
  const [images, setImages] = useState(() =>
    props.initialImage ? ([{ small: props.initialImage.imageUrl, user: props.initialImage.imageAuthor }] as any) : []
  );
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const searchImages = async () => {
    setWarning("");
    setImages([]);
    if (keyword === "") {
      return
    }
    setLoading(true);

    const newImages = await searchPhotos(keyword);
    if (newImages.length === 0) {
      setWarning("No results");
    }
    setImages(newImages);
    setLoading(false);
  };

  const onKeyDown = async (event: any) => {
    if (event.keyCode === 13) {
      await searchImages();
    }
  };

  const selectImage = (image: UnsplashImage) => {
    setImages([image]);
    props.setImageUrl(image.regular, image.author);
  };

  return (
    <div className="SearchImageBox">
      <div className="SearchImageBox__controls">
        <input
          type="text"
          className="SearchImageBox__input InputAdd__input"
          value={keyword}
          onChange={e => setKeyword(e.currentTarget.value)}
          onKeyDown={onKeyDown}
        />
        <div className="InputAdd__btn InputAdd__btn--inputBtn" onClick={searchImages}>
          Search
        </div>
      </div>

      <div className="SearchImageBox__box">
        {loading && <div className="SearchImageBox__loading">Loading...</div>}
        {warning && !loading && <div className="SearchImageBox__loading">{warning}</div>}
        {!loading && (
          <>
            {images.map(image => (
              <div key={image.id} className="SearchImageBox__imageContainer" onClick={() => selectImage(image)}>
                <img className="SearchImageBox__image" src={image.small} />
                {image.author && (
                  <div className="SearchImageBox__attribute">
                    by{" "}
                    <a target="_blank" href={image.author.link}>
                      {image.author.name}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchImageBox;
