import { useQuery } from "@apollo/client";
import React from "react";
import { GET_IMAGE_URL } from "../Queries";

interface Props {
  imageKey: string;
}

interface ImageUrl {
  url: string;
}

interface Data {
  getImageUrl: ImageUrl;
}

const ImageBlock = function({ imageKey }: Props) {
  const { loading, error, data } = useQuery<Data>(GET_IMAGE_URL, {
    variables: { key: imageKey },
  });

  if (loading || error) return <div />;

  debugger;
  return <img src={data.getImageUrl.url} />;
};

export default ImageBlock;
