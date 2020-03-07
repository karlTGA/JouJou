import React from 'react';
import { Row, Col, Form, Input, Button, DatePicker, Switch } from 'antd';
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from 'megadraft';
import moment from 'moment';

export default function EntryEditor({ title, date, isPublic, content }) {
  const [cacheContent, setCacheContent] = React.useState(editorStateFromRaw(content));
  const [cacheTitle, setCachedTitle] = React.useState(title || '');
  const [cacheDate, setCacheDate] = React.useState<moment>(moment(date) || moment());
  const [cacheIsPublic, setCachePublic] = React.useState(isPublic || false);

  const handleEditorStateUpdate = newEditorState => {
    setCacheContent(newEditorState);
  };

  const handleSaveClick = () => {
    const saveObject = {
      title: cacheTitle,
      date: cacheDate.toISOString(),
      isPublic: cacheIsPublic,
      content: editorStateToJSON(cacheContent)
    };

    // save_my_content(content);
    console.log(saveObject);
  };

  return (
    <div className="editor-container">
      <Row>
        <h1 className="editor-heading">Neuer Eintrag:</h1>
      </Row>
      <Row>
        <Form>
          <Form.Item label="Titel">
            <Input value={cacheTitle} onChange={({ target }) => setCachedTitle(target.value)} />
          </Form.Item>
          <Form.Item label="Datum">
            <DatePicker value={cacheDate} onChange={date => setCacheDate(date)} />
          </Form.Item>
          <Form.Item label="Public">
            <Switch value={cacheIsPublic} onChange={value => setCachePublic(value)} />
          </Form.Item>
        </Form>
      </Row>
      <Row id="editor-row">
        <MegadraftEditor
          editorState={cacheContent}
          onChange={handleEditorStateUpdate}
          placeholder="Wie war euer Tag? ..."
        />
      </Row>
      <Row id="save-button-row">
        <Button type="primary" size="large" onClick={handleSaveClick}>
          Save{' '}
        </Button>
      </Row>
    </div>
  );
}
