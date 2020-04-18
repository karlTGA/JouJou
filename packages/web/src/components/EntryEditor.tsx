import React from "react";
import { Button, DatePicker, Form, Input, Row, Switch } from "antd";
import {
  editorStateFromRaw,
  editorStateToJSON,
  MegadraftEditor,
} from "megadraft";
import moment from "moment";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_ENTRY } from "../Queries";

interface Props {
  title?: string;
  date?: moment.Moment;
  isPublic?: boolean;
  location?: string;
  content?: string | null;
}

export interface Entry {
  id?: string;
  title: string;
  date: moment.Moment;
  isPublic: boolean;
  location: string;
  content: string | null;
}
export type Entries = Entry[];

export default function EntryEditor({
  title = "",
  date = moment(),
  isPublic = false,
  content = null,
  location = "",
}: Props) {
  const [updateEntry, { data }] = useMutation(UPDATE_ENTRY);
  const [cacheContent, setCacheContent] = React.useState(
    editorStateFromRaw(content)
  );
  const [cacheTitle, setCachedTitle] = React.useState(title);
  const [cacheDate, setCacheDate] = React.useState<moment.Moment>(moment(date));
  const [cacheIsPublic, setCachePublic] = React.useState(isPublic);
  const [cacheLocation, setCacheLocation] = React.useState(location);

  const handleEditorStateUpdate = (newEditorState) => {
    setCacheContent(newEditorState);
  };

  const handleSaveClick = () => {
    const saveObject = {
      title: cacheTitle,
      date: cacheDate.toISOString(),
      isPublic: cacheIsPublic,
      content: editorStateToJSON(cacheContent),
    };

    updateEntry({ variables: { entryId: null, newEntry: saveObject } });
  };

  return (
    <div className="editor-container">
      <Row>
        <h1 className="editor-heading">Neuer Eintrag:</h1>
      </Row>
      <Row>
        <Form>
          <Form.Item label="Titel">
            <Input
              value={cacheTitle}
              onChange={({ target }) => setCachedTitle(target.value)}
            />
          </Form.Item>
          <Form.Item label="Ort">
            <Input
              value={cacheLocation}
              onChange={({ target }) => setCacheLocation(target.value)}
            />
          </Form.Item>
          <Form.Item label="Datum">
            <DatePicker
              value={cacheDate}
              onChange={(date) => setCacheDate(date)}
            />
          </Form.Item>
          <Form.Item label="Öffentlich">
            <Switch
              checked={cacheIsPublic}
              onChange={(value) => setCachePublic(value)}
            />
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
          Save{" "}
        </Button>
      </Row>
    </div>
  );
}
