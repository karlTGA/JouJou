import React, { useState, useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Row,
  Switch,
  Popconfirm,
  Col,
} from "antd";
import {
  editorStateFromRaw,
  editorStateToJSON,
  MegadraftEditor,
} from "megadraft";
import moment from "moment";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_ENTRY, GET_ENTRY, REMOVE_ENTRY } from "../Queries";
import { useParams, useHistory } from "react-router-dom";
import BackToTimeline from "./BackToOverview";
import Sidebar, { ContentInfo } from "./Sidebar";

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

interface Params {
  entryId: string;
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
  const { entryId } = useParams<Params>();
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

  const handleNewContentFromSidebar = (info: ContentInfo) => {
    console.log(info.key);
  };

  return (
    <div>
      <BackToTimeline />
      <div className="editor-container">
        <Row>
          <Col span={24}>
            <h1 className="editor-heading">Eintrag bearbeiten:</h1>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form>
              <Col span={6}>
                <Form.Item label="Titel">
                  <Input
                    value={title}
                    onChange={({ target }) =>
                      handleEntryChange("title", target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Ort">
                  <Input
                    value={location}
                    onChange={({ target }) =>
                      handleEntryChange("location", target.value)
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={7}>
                <Form.Item label="Datum">
                  <DatePicker
                    value={moment(date)}
                    onChange={(date) =>
                      handleEntryChange("date", date.toISOString())
                    }
                  />
                </Form.Item>
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Form.Item label="Öffentlich" className="editor-public-switch">
                  <Switch
                    checked={isPublic}
                    onChange={(value) => handleEntryChange("isPublic", value)}
                  />
                </Form.Item>
              </Col>
            </Form>
          </Col>
        </Row>
        <Row className="editor">
          <Col span={24}>
            <MegadraftEditor
              editorState={content}
              onChange={handleEditorStateUpdate}
              placeholder="Wie war euer Tag? ..."
              sidebarRendererFn={() => (
                <Sidebar onNewContent={handleNewContentFromSidebar} />
              )}
            />
          </Col>
        </Row>
        <Row id="save-button-row">
          <Col
            span={4}
            offset={20}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {entry.entryId != null && (
              <Popconfirm
                title="Bist du sicher, dass du den Eintrag löschen möchtest?"
                onConfirm={handleDeleteClick}
                okText="Ja"
                cancelText="Nein"
              >
                <Button danger size="large" style={{ marginRight: "10px" }}>
                  Delete
                </Button>
              </Popconfirm>
            )}
            <Button type="primary" size="large" onClick={handleSaveClick}>
              Save
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
