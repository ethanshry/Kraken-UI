import * as React from 'react'
import { Typography, Menu, Layout } from 'antd'
import {
    AppstoreOutlined,
    CloudServerOutlined,
    ClusterOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons'
import { createClient, Provider } from 'urql'
import config from './config'

/********
 * Assets:
 * Kraken Icon: https://www.flaticon.com/free-icon/kraken_1355845
 *
 */

const client = createClient({
    url: `/graphql`,
    fetchOptions: () => {
        return {
            headers: {},
        }
    },
})

const { Header, Content, Footer, Sider } = Layout

const { Title, Text } = Typography

import Info from './pages/Info'
import Nodes from './pages/Nodes'
import Deployments from './pages/Deployments'
import Platform from './pages/Platform'

interface AppState {
    activeTab: string
}

class App extends React.Component<{}, AppState> {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 'info',
        }
    }

    handleNavClick = e => {
        this.setState({ activeTab: e.key })
    }

    render() {
        console.log(process.env.AUTH)
        return (
            <Provider value={client}>
                <Layout>
                    <Header>
                        <Title
                            style={{
                                lineHeight: '64px',
                                marginBottom: 0,
                                color: config.palette.textLight,
                            }}
                        >
                            <img
                                src={`/kraken.svg`}
                                width={'auto'}
                                height={64}
                                style={{
                                    filter:
                                        'invert(100%) sepia(0%) saturate(4445%) hue-rotate(171deg) brightness(103%) contrast(100%)',
                                    marginRight: 10,
                                }}
                            />
                            Kraken App Deployment Platform
                        </Title>
                    </Header>
                    <Layout>
                        <Sider style={{ height: 'calc(100vh - 64px)' }}>
                            <Menu
                                onClick={this.handleNavClick}
                                defaultSelectedKeys={[this.state.activeTab]}
                                style={{ height: '100%' }}
                            >
                                <Menu.Item icon={<InfoCircleOutlined />} key="info">
                                    Info
                                </Menu.Item>
                                <Menu.Item icon={<ClusterOutlined />} key="nodes">
                                    Nodes
                                </Menu.Item>
                                <Menu.Item icon={<AppstoreOutlined />} key="deployments">
                                    Deployments
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Content>
                            {this.state.activeTab === 'info' && <Info />}
                            {this.state.activeTab === 'nodes' && <Nodes />}
                            {this.state.activeTab === 'deployments' && <Deployments />}
                        </Content>
                    </Layout>
                </Layout>
            </Provider>
        )
    }
}

export default App
