import React, { useMemo } from 'react';

const CAT_IMAGES = ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'];

export const CatImage = (props) => {
  const imageIndex = useMemo(() => Math.floor(Math.random() * CAT_IMAGES.length), []);
  return <img src={CAT_IMAGES[imageIndex]} alt="An image of a lovely cat ;)" {...props} />;
};
