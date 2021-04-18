import { PlusCircleOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Card } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router";
import { GET_IMAGES_OF_ENTRY } from "../Queries";
import { Image } from "./Image";
import { ImageUploadModal } from "./ImageUploadModal";

interface ImageType {
  imageId: number;
  title: string;
}

interface Data {
  getImagesOfEntry: Array<ImageType>;
}

interface Params {
  entryId: string;
}

export function ImageBlock({ editable = false }: { editable?: boolean }) {
  const { entryId } = useParams<Params>();
  const { loading, error, data, refetch } = useQuery<Data>(
    GET_IMAGES_OF_ENTRY,
    {
      variables: { entryId: parseInt(entryId) },
    }
  );
  const [showImageUpload, setShowImageUpload] = useState(false);

  const onModalClose = () => {
    refetch();
    setShowImageUpload(false);
  };

  if (loading || error) return <div />;

  return (
    <div>
      <Card>
        <div className="image-block">
          {data.getImagesOfEntry.map((image: ImageType) => {
            return (
              <Image
                key={image.imageId}
                imageId={image.imageId}
                title={image.title}
              />
            );
          })}
          {editable && (
            <div
              key="add-image"
              className="add-image-entry"
              onClick={() => setShowImageUpload(true)}
            >
              <PlusCircleOutlined />
            </div>
          )}
        </div>
      </Card>
      {editable && (
        <ImageUploadModal show={showImageUpload} onClose={onModalClose} />
      )}
    </div>
  );
}
