import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { Icon } from 'antd';

export default function Timeline() {
  return (
    <VerticalTimeline>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="2011 - present"
        iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
        icon={<Icon type="plus" />}
      >
        <h3 className="vertical-timeline-element-title">Creative Director</h3>
        <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
        <p>Creative Direction, User Experience, Visual Design, Project Management, Team Leading</p>
      </VerticalTimelineElement>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="2010 - 2011"
        iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
        icon={<Icon type="plus" />}
      >
        <h3 className="vertical-timeline-element-title">Art Director</h3>
        <h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
        <p>Creative Direction, User Experience, Visual Design, SEO, Online Marketing</p>
      </VerticalTimelineElement>
    </VerticalTimeline>
  );
}
