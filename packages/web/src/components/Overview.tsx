import { Layout } from 'antd';
import React from 'react';
import Timeline from './Timeline';

const { Header, Content } = Layout;

export default function Overview() {
  return (
    <Layout>
      <Header />
      <Content className="entry-overview-content">
        <Timeline />
      </Content>
    </Layout>
  );
}
