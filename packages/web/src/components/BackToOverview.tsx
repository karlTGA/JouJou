import React from "react";
import { useHistory } from "react-router";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

export default function BackToTimeline() {
  const history = useHistory();

  const handleButtonClick = () => {
    history.push("/overview");
  };

  return (
    <Button
      className="back-to-overview-button"
      icon={<LeftOutlined />}
      onClick={handleButtonClick}
    >
      Zurück zur Timeline
    </Button>
  );
}
