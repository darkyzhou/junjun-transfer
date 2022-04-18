import React, { useMemo } from 'react';

const CAT_IMAGE_PATH = '/images';
const CAT_IMAGES = ['1.jpg', '2.jpg', '3.jpg'];

export const CatImage = (props) => {
  const imageIndex = useMemo(() => Math.floor(Math.random() * CAT_IMAGES.length), []);
  return <img src={`${CAT_IMAGE_PATH}/${CAT_IMAGES[imageIndex]}`} alt="An image of a lovely cat ;)" {...props} />;
};
