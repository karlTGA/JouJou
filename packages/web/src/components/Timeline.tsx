import { useQuery } from "@apollo/client";
import { LoadingOutlined, FormOutlined } from "@ant-design/icons";
import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { GET_ENTRIES } from "../Queries";
import { ServerSideEntries, ServerSideEntry } from "./EntryEditor";
import { useHistory } from "react-router-dom";
import moment from "moment";

interface Data {
  getEntries: ServerSideEntries;
}

function getContentString(content: string | null) {
  let output = "";
  if (content == null) return output;

  const contentObject = JSON.parse(content);
  if (contentObject.blocks == null || contentObject.blocks.length === 0)
    return output;

  return contentObject.blocks[0].text;
}

export default function Timeline() {
  const { loading, error, data } = useQuery<Data>(GET_ENTRIES, {
    fetchPolicy: "no-cache",
  });
  const history = useHistory();

  const handleEntryClick = (entryId: string) => {
    history.push(`/entry/${String(entryId)}`);
  };

  if (loading) {
    return (
      <div className="loading-info">
        <LoadingOutlined />
        Loading ...
      </div>
    );
  }

  return (
    <VerticalTimeline>
      {data.getEntries.map((entry: ServerSideEntry) => {
        let content: string = getContentString(entry.content);

        return (
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date={
              <p onClick={() => handleEntryClick(entry.id)}>
                {moment(entry.date).format("LL")}
              </p>
            }
            key={entry.id}
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<FormOutlined onClick={() => handleEntryClick(entry.id)} />}
          >
            <div
              className="vertical-timeline-element-content-container"
              onClick={() => handleEntryClick(entry.id)}
            >
              <h3 className="vertical-timeline-element-title">{entry.title}</h3>
              {entry.location != null && (
                <h4 className="vertical-timeline-element-subtitle">
                  {entry.location}
                </h4>
              )}
              <p>{content}</p>
            </div>
          </VerticalTimelineElement>
        );
      })}
    </VerticalTimeline>
  );
}
