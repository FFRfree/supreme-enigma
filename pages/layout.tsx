import React, { useState } from 'react'
import {
  AreaChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ScheduleOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import { Breadcrumb, Layout, Menu } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'

const { Header, Sider, Content } = Layout

interface IMylayout {
  children: any
}

const MyLayout: React.FC<IMylayout> = ({ children }: IMylayout) => {
  const [collapsed, setCollapsed] = useState(true)
  const router = useRouter()

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" />
        <Menu
          theme="dark"
          selectedKeys={[router.asPath]}
          mode="inline"
          items={[
            {
              key: '/',
              icon: (
                <Link href="/">
                  <UserOutlined />
                </Link>
              ),
              label: 'main'
            },
            {
              key: '/admin',
              icon: (
                <Link href="/admin">
                  <ScheduleOutlined />
                </Link>
              ),
              label: 'schedule'
            },
            {
              key: '/graph',
              icon: (
                <Link href="/graph">
                  <AreaChartOutlined />
                </Link>
              ),
              label: 'graph'
            },
            {
              key: '/testPage',
              icon: (
                <Link href="/testPage">
                  <UploadOutlined />
                </Link>
              ),
              label: 'test'
            }
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MyLayout
