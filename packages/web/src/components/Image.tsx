import { useQuery } from "@apollo/client";
import React from "react";
import { GET_IMAGE_URLS } from "../Queries";
import { Image as AntImage } from "antd";

interface Props {
  imageId: number;
  title: string;
}

interface Data {
  getImageUrls: {
    smallUrl: string;
    largeUrl: string;
  };
}

export function Image({ imageId }: Props) {
  const { loading, error, data } = useQuery<Data>(GET_IMAGE_URLS, {
    variables: { imageId },
    pollInterval: 10000,
  });

  if (loading || error) return <div />;

  return (
    <div>
      <AntImage
        src={data.getImageUrls.smallUrl}
        preview={{ src: data.getImageUrls.largeUrl }}
      />
    </div>
  );
}
