import React from "react";
import { Row } from "antd";
import { editorStateFromRaw, MegadraftEditor } from "megadraft";
import moment from "moment";
import { useParams } from "react-router-dom";
import { GET_ENTRY } from "../Queries";
import { useQuery } from "@apollo/react-hooks";

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
    <div className="editor-container">
      <Row>
        <h1 className="editor-heading">{title || "Eintrag:"}</h1>
      </Row>
      <Row>{date}</Row>
      <Row>{location}</Row>
      <Row id="editor-row">
        <MegadraftEditor
          editorState={editorStateFromRaw(JSON.parse(content))}
          readOnly
        />
      </Row>
    </div>
  );
}
