import React from 'react';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';

export default function AddEntryButton() {
  const history = useHistory();

  function handleButtonClick() {
    history.push('/editor');
  }
  return (
    <Button
      type="primary"
      shape="circle"
      icon="plus"
      size="large"
      id="floating-action-button"
      onClick={handleButtonClick}
    />
  );
}
