import React, { useState, useEffect } from "react";
import { Button, DatePicker, Form, Input, Row, Switch, Popconfirm } from "antd";
import {
  editorStateFromRaw,
  editorStateToJSON,
  MegadraftEditor,
} from "megadraft";
import moment from "moment";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { UPDATE_ENTRY, GET_ENTRY, REMOVE_ENTRY } from "../Queries";
import { useParams, useHistory } from "react-router-dom";
import BackToTimeline from "./BackToOverview";

export interface Entry {
  entryId?: string;
  title: string;
  date: string;
  isPublic: boolean;
  location: string;
  content: string | null;
}
export type Entries = Entry[];

interface DataQuery {
  getEntry: Entry;
}

function getEmptyEntry(): Entry {
  return {
    title: "",
    date: moment().toISOString(),
    isPublic: false,
    content: editorStateFromRaw(null),
    location: "",
  };
}

export default function EntryEditor() {
  const { entryId } = useParams();
  const history = useHistory();
  const [updateEntry, { data: dataMutation }] = useMutation<Entry>(
    UPDATE_ENTRY,
    {
      onCompleted: (data) => {
        history.push(`/entry/${entryId}`);
      },
    }
  );
  const [removeEntry, { data }] = useMutation<void>(REMOVE_ENTRY, {
    onCompleted: (data) => {
      history.push(`/overview`);
    },
  });
  const { loading, error, data: dataQuery } = useQuery<DataQuery>(GET_ENTRY, {
    variables: { entryId: parseInt(entryId) },
  });
  const [entry, setEntry] = useState(getEmptyEntry());

  useEffect(() => {
    if (dataQuery != null && dataQuery.getEntry != null) {
      setEntry({
        ...dataQuery.getEntry,
        date: dataQuery.getEntry.date,
        content: editorStateFromRaw(JSON.parse(dataQuery.getEntry.content)),
      });
    }
  }, [dataQuery]);

  const { title, date, isPublic, content, location } = entry;

  const handleEditorStateUpdate = (newEditorState: any) => {
    setEntry({
      ...entry,
      content: newEditorState,
    });
  };

  const handleEntryChange = (key: string, newValue: any) => {
    setEntry({
      ...entry,
      [key]: newValue,
    });
  };

  const handleSaveClick = () => {
    const saveObject = {
      title: entry.title || "",
      location: entry.location || "",
      isPublic: entry.isPublic || false,
      date: entry.date || "",
      content: editorStateToJSON(entry.content),
    };

    updateEntry({
      variables: { entryId: parseInt(entryId), newEntry: saveObject },
    });
  };

  const handleDeleteClick = () => {
    removeEntry({ variables: { entryId: parseInt(entryId) } });
  };

  return (
    <div>
      <BackToTimeline />
      <div className="editor-container">
        <Row>
          <h1 className="editor-heading">Eintrag bearbeiten:</h1>
        </Row>
        <Row>
          <Form>
            <Form.Item label="Titel">
              <Input
                value={title}
                onChange={({ target }) =>
                  handleEntryChange("title", target.value)
                }
              />
            </Form.Item>
            <Form.Item label="Ort">
              <Input
                value={location}
                onChange={({ target }) =>
                  handleEntryChange("location", target.value)
                }
              />
            </Form.Item>
            <Form.Item label="Datum">
              <DatePicker
                value={moment(date)}
                onChange={(date) =>
                  handleEntryChange("date", date.toISOString())
                }
              />
            </Form.Item>
            <Form.Item label="Öffentlich" className="editor-public-switch">
              <Switch
                checked={isPublic}
                onChange={(value) => handleEntryChange("isPublic", value)}
              />
            </Form.Item>
          </Form>
        </Row>
        <Row className="editor">
          <MegadraftEditor
            editorState={content}
            onChange={handleEditorStateUpdate}
            placeholder="Wie war euer Tag? ..."
          />
        </Row>
        <Row id="save-button-row">
          {entry.entryId != null && (
            <Popconfirm
              title="Bist du sicher, dass du den Eintrag löschen möchtest?"
              onConfirm={handleDeleteClick}
              okText="Ja"
              cancelText="Nein"
            >
              <Button
                type="danger"
                size="large"
                style={{ marginRight: "10px" }}
              >
                Delete
              </Button>
            </Popconfirm>
          )}
          <Button type="primary" size="large" onClick={handleSaveClick}>
            Save
          </Button>
        </Row>
      </div>
    </div>
  );
}
