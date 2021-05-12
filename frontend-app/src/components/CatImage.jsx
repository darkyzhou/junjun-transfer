import React from 'react';
import { useMemo } from 'react';

const CAT_IMAGES = [''];

export const CatImage = ({ ...props }) => {
  const imageSrc = useMemo(() => CAT_IMAGES[new Date().getDate() % CAT_IMAGES.length], [new Date().getDate()]);
  return (
    <img src={imageSrc} alt="An image of a lovely cat ;)" {...props} className={`w-full h-full ${props.className}`} />
  );
};
