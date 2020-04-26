import React from "react";
import { Button } from "antd";
import { useHistory, useLocation } from "react-router-dom";

export default function AddOrEditEntryButton() {
  const history = useHistory();
  const location = useLocation();

  const isInViewer = location.pathname.startsWith("/entry/");
  const isInEditor = location.pathname.startsWith("/editor");

  const handleButtonClick = () => {
    if (isInViewer) {
      const entryId = location.pathname.slice(7);
      history.push(`/editor/${entryId}`);
    } else {
      history.push("/editor");
    }
  };

  if (isInEditor) return <></>;

  return (
    <Button
      type="primary"
      shape="circle"
      icon={isInViewer ? "edit" : "plus"}
      size="large"
      id="floating-action-button"
      onClick={handleButtonClick}
    />
  );
}
