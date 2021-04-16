import { useQuery } from "@apollo/client";
import { Card, Carousel, Image } from "antd";
import React, { CSSProperties } from "react";
import { GET_IMAGE_URLS } from "../Queries";

interface Props {
  imageKeys: Array<string>;
}

interface ImageUrl {
  urls: Array<string>;
}

interface Data {
  getImageUrls: ImageUrl;
}

const cardStyle: CSSProperties = {
  height: "500px",
};

function getContentStyle(url: string): CSSProperties {
  return {
    background: "grey",
    color: "#fff",
    backgroundImage: `url(${url})`,
    backgroundPosition: "0 -250px",
  };
}

const ImageBlock = function({ imageKeys }: Props) {
  const { loading, error, data } = useQuery<Data>(GET_IMAGE_URLS, {
    variables: { keys: imageKeys },
  });

  if (loading || error) return <div />;

  return (
    <Card style={cardStyle}>
      <Image src={data.getImageUrls.urls[0]} height="460px" />
      <Image src={data.getImageUrls.urls[0]} height="460px" />
    </Card>
  );
};

export default ImageBlock;
