import { useQuery } from '@apollo/react-hooks';
import { Icon } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { GET_ENTRIES } from '../Queries';
import { Entries } from './EntryEditor';

interface Data {
  getEntries: Entries;
}

export default function Timeline() {
  const { loading, error, data } = useQuery<Data>(GET_ENTRIES);

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
      {data.getEntries.map(entry => (
        <>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            key={entry.id}
            date={entry.date}
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            icon={<Icon type="plus" />}
          >
            <h3 className="vertical-timeline-element-title">{entry.title}</h3>
            {entry.location != null && <h4 className="vertical-timeline-element-subtitle">{entry.location}</h4>}
            <p>Creative Direction, User Experience, Visual Design, Project Management, Team Leading</p>
          </VerticalTimelineElement>
        </>
      ))}
    </VerticalTimeline>
  );
}
