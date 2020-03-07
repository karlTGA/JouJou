import React from 'react';
import { Row, Col, Form, Input, Button, DatePicker, Switch } from 'antd';
import { MegadraftEditor, editorStateFromRaw } from 'megadraft';

export default function EntryEditor() {
  const [editorState, setEditorState] = React.useState(editorStateFromRaw(null));

  const handleEditorStateUpdate = newEditorState => {
    setEditorState(newEditorState);
  };

  return (
    <div className="editor-container">
      <Row>
        <h1 className="editor-heading">Neuer Eintrag:</h1>
      </Row>
      <Row>
        <Form>
          <Form.Item label="Titel">
            <Input />
          </Form.Item>
          <Form.Item label="Datum">
            <DatePicker />
          </Form.Item>
          <Form.Item label="Public">
            <Switch />
          </Form.Item>
        </Form>
      </Row>
      <Row id="editor-row">
        <MegadraftEditor editorState={editorState} onChange={handleEditorStateUpdate} placeholder="Add some text" />
      </Row>
      <Row id="save-button-row">
        <Button type="primary" size="large">
          Save{' '}
        </Button>
      </Row>
    </div>
  );
}
