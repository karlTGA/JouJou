import { useQuery } from "@apollo/react-hooks";
import { Icon } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { GET_ENTRIES } from "../Queries";
import { Entries, Entry } from "./EntryEditor";
import { useHistory } from "react-router-dom";

interface Data {
  getEntries: Entries;
}

export default function Timeline() {
  const { loading, error, data } = useQuery<Data>(GET_ENTRIES);
  const history = useHistory();

  const handleEntryClick = (entryId: number) => {
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
      {data.getEntries.map((entry: Entry) => (
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date={entry.date}
          key={entry.entryId}
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={<Icon type="plus" />}
        >
          <div
            className="vertical-timeline-element-content-container"
            onClick={() => handleEntryClick(entry.entryId)}
          >
            <h3 className="vertical-timeline-element-title">{entry.title}</h3>
            {entry.location != null && (
              <h4 className="vertical-timeline-element-subtitle">
                {entry.location}
              </h4>
            )}
            <p>
              Creative Direction, User Experience, Visual Design, Project
              Management, Team Leading
            </p>
          </div>
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
}
