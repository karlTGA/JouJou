import React from "react";
import { Row, Col } from "antd";
import { editorStateFromRaw, MegadraftEditor } from "megadraft";
import moment from "moment";
import { useParams } from "react-router-dom";
import { GET_ENTRY } from "../Queries";
import { useQuery } from "@apollo/react-hooks";
import BackToTimeline from "./BackToOverview";

interface Props {
  title?: string;
  date?: moment.Moment;
  isPublic?: boolean;
  location?: string;
  content?: string | null;
}

export interface Entry {
  entryId?: string;
  title: string;
  date: moment.Moment;
  isPublic: boolean;
  location: string;
  content: string | null;
}
export type Entries = Entry[];

interface Data {
  getEntry: Entry;
}

export default function EntryView() {
  const { entryId } = useParams();
  const { loading, error, data } = useQuery<Data>(GET_ENTRY, {
    variables: { entryId: parseInt(entryId) },
  });

  if (loading) return <></>;
  const { title, date, isPublic, content, location } = data.getEntry;

  return (
    <div>
      <BackToTimeline />
      <div className="viewer-container">
        <Row>
          <h1 className="viewer-heading">{title || "Eintrag:"}</h1>
        </Row>
        <Row className="viewer-meta-field">
          <Col span={2} className="meta-key">
            Datum:
          </Col>
          <Col span={12}>{moment(date).format("LL")}</Col>
        </Row>
        <Row className="viewer-meta-field">
          <Col span={2} className="meta-key">
            Ort:
          </Col>
          <Col span={12}>{location}</Col>
        </Row>
        <Row className="viewer">
          <MegadraftEditor
            editorState={editorStateFromRaw(JSON.parse(content))}
            readOnly
          />
        </Row>
      </div>
    </div>
  );
}
