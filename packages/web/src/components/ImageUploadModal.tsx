import React, { useState } from "react";
import { Modal, Upload, message } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/lib/upload";
import {
  RcCustomRequestOptions,
  RcFile,
  UploadFile,
} from "antd/lib/upload/interface";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useParams } from "react-router";

interface Params {
  entryId: string;
}

const { Dragger } = Upload;

const UPLOAD_IMAGE_MUTATION = gql`
  mutation($file: Upload!, $entryId: Int!) {
    imageUpload(file: $file, entryId: $entryId) {
      entry_id
      image_id
      original
      large
      medium
      small
      title
      date
      location
      updated_at
      created_at
    }
  }
`;

export default function ImageUploadModal({
  show,
  onClose,
  onImageUpload,
}: {
  show: boolean;
  onClose: () => void;
  onImageUpload: (key: string) => void;
}) {
  const { entryId } = useParams<Params>();
  const [uploadImageMutation] = useMutation(UPLOAD_IMAGE_MUTATION);
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

  const handleOk = async function() {
    onClose();
  };

  const handleImageFile = async (info: UploadChangeParam<UploadFile<any>>) => {
    const { status } = info.file;
    setFileList(info.fileList);

    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
      setFileList([]);
      onClose();
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleFile = async ({
    file,
    onSuccess,
    onError,
  }: RcCustomRequestOptions) => {
    try {
      const {
        data: { imageUpload },
      } = await uploadImageMutation({
        variables: { file, entryId: parseInt(entryId) },
      });

      debugger;
      onImageUpload(imageUpload.key);
      onSuccess(imageUpload, file);
    } catch (err) {
      onError(err);
      throw err;
    }
  };

  const handleFileRemove = async (file: UploadFile<any>): Promise<boolean> => {
    return true;
  };

  return (
    <Modal title="Add Image" visible={show} onOk={handleOk} onCancel={onClose}>
      <Dragger
        multiple={false}
        name="file"
        accept="image/gif, image/jpeg, image/png"
        fileList={fileList}
        onChange={handleImageFile}
        onRemove={handleFileRemove}
        customRequest={handleFile}
      >
        <p className="ant-upload-drag-icon">
          <PictureOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag image to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single image. Possible are jpegs, png and gifs.
        </p>
      </Dragger>
    </Modal>
  );
}
