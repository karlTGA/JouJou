import React from "react";
import { useHistory } from "react-router";
import { Button, Icon } from "antd";

export default function BackToTimeline() {
  const history = useHistory();

  const handleButtonClick = () => {
    history.push("/overview");
  };

  return (
    <Button className="back-to-overview-button" onClick={handleButtonClick}>
      <Icon type="left" />
      Zurück zur Timeline
    </Button>
  );
}
