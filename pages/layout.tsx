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
import styled from 'styled-components'

const { Header, Sider, Content } = Layout

interface IMylayout {
  children: any
}

const StyledWrapper = styled.div`
  .logo {
    height: 32px;
    margin: 16px;
    /* border-radius: 50%; */
    background: rgba(255, 255, 255, 0.2);
  }

  /* .site-layout-sub-header-background {
    background: #262626;
  } */

  .site-layout-background {
    background: #1f1f1f;
  }

  .site-layout {
    background: #262626;
  }
`

const MyLayout: React.FC<IMylayout> = ({ children }: IMylayout) => {
  const [collapsed, setCollapsed] = useState(true)
  const router = useRouter()

  return (
    <StyledWrapper>
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
              margin: '24px 24px',
              padding: 24,
              minHeight: 280,
              overflow: 'auto'
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </StyledWrapper>
  )
}

export default MyLayout
