import * as React from "react";
import { useState } from "react";
import "./SearchImageBox.scss";
import { searchPhotos, UnsplashImage } from "../../../Utils/Unsplash";

type Props = {

  setImageUrl: (url: string) => unknown
};

const SearchImageBox = (props: Props) => {
  const [keyword, setKeyword] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchImages = async () => {
    setLoading(true);
    const newImages = await searchPhotos(keyword);
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
    props.setImageUrl(image.regular);
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
        {!loading &&
          images.map(image => (
            <div className="SearchImageBox__imageContainer" onClick={() => selectImage(image)} >
              <img key={image.id} className="SearchImageBox__image" src={image.small} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SearchImageBox;
