import React from "react";
import { Modal, Upload, message } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/lib/upload";
import {
  RcCustomRequestOptions,
  RcFile,
  UploadFile,
} from "antd/lib/upload/interface";
import gql from "graphql-tag";
import { useApolloClient, useMutation } from "@apollo/client";

const { Dragger } = Upload;

const UPLOAD_IMAGE_MUTATION = gql`
  mutation($file: Upload!) {
    imageUpload(file: $file) {
      filename
      mimetype
      encoding
    }
  }
`;

export default function ImageUploadModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  const [uploadImageMutation] = useMutation(UPLOAD_IMAGE_MUTATION);
  const apolloClient = useApolloClient();

  const handleOk = async function() {};

  const handleImageFile = async (info: UploadChangeParam<UploadFile<any>>) => {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
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
      const res = await uploadImageMutation({
        variables: { file },
      });
      onSuccess(res, file);
    } catch (err) {
      onError(err);
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
