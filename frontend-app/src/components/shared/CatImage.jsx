import React, { useMemo } from 'react';

const CAT_IMAGES = ['/images/gold-bengal-cat-black.jpg'];

export const CatImage = (props) => {
  const imageIndex = useMemo(() => Math.floor(Math.random() * CAT_IMAGES.length), []);
  return <img src={CAT_IMAGES[imageIndex]} alt="An image of a lovely cat ;)" {...props} />;
};
