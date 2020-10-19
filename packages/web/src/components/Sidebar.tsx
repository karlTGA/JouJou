import React, { useState } from "react";
import { Button } from "antd";
import {
  CloseOutlined,
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import ImageUploadModal from "./ImageUploadModal";

enum SidemenuState {
  OPEN = "open",
  CLOSED = "closed",
}

export interface ContentInfo {
  type: "image";
  key: string;
}

interface Props {
  onNewContent: (info: ContentInfo) => void;
}

export default function Sidebar({ onNewContent }: Props) {
  const [sidemenuState, setSidemenuState] = useState(SidemenuState.CLOSED);
  const [showImageUpload, setShowImageUpload] = useState(false);

  return (
    <div className="sidebar">
      <div className="sidebar__menu" style={{ top: "0px" }}>
        <ul className="sidebar__sidemenu-wrapper">
          <li
            className={classNames([
              "sidemenu",
              { "sidemenu--open": sidemenuState === SidemenuState.OPEN },
            ])}
          >
            <Button
              icon={
                sidemenuState === SidemenuState.OPEN ? (
                  <CloseOutlined />
                ) : (
                  <PlusOutlined />
                )
              }
              shape="circle"
              type="primary"
              style={{ borderWidth: "0px", backgroundColor: "#000" }}
              onClick={() =>
                setSidemenuState(
                  sidemenuState === SidemenuState.OPEN
                    ? SidemenuState.CLOSED
                    : SidemenuState.OPEN
                )
              }
            />
            <div>
              <ul
                className={classNames([
                  "sidemenu__items",
                  {
                    "sidemenu__items--open":
                      sidemenuState === SidemenuState.OPEN,
                  },
                ])}
                style={{
                  maxHeight:
                    sidemenuState === SidemenuState.OPEN ? "144px" : "0px",
                }}
              >
                <li className="sidemenu__item">
                  <Button
                    icon={<PictureOutlined />}
                    shape="circle"
                    type="primary"
                    style={{ backgroundColor: "#000", borderWidth: "0px" }}
                    onClick={() => setShowImageUpload(true)}
                  />
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <ImageUploadModal
        show={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onImageUpload={(key) => onNewContent({ type: "image", key })}
      />
    </div>
  );
}
