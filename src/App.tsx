import * as React from 'react'
import { Typography, Menu, Layout } from 'antd'
import { AppstoreOutlined, CloudServerOutlined, ClusterOutlined } from '@ant-design/icons'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

const apolloClient = new ApolloClient({
    uri: 'https://localhost:8000/graphql',
    cache: new InMemoryCache(),
})

const { Header, Content, Footer, Sider } = Layout

const { Title, Text } = Typography

import Nodes from './pages/Nodes'

interface AppState {
    activeTab: string
}

class App extends React.Component<{}, AppState> {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 'nodes',
        }
    }

    handleNavClick = e => {
        this.setState({ activeTab: e.key })
    }

    render() {
        return (
            <ApolloProvider client={apolloClient}>
                <Layout>
                    <Header>
                        <Title style={{ lineHeight: '64px', marginBottom: 0 }}>
                            Kraken App Deployment Platform
                        </Title>
                    </Header>
                    <Layout>
                        <Sider style={{ height: 'calc(100vh - 64px)' }}>
                            <Menu
                                onClick={this.handleNavClick}
                                defaultSelectedKeys={['nodes']}
                                style={{ height: '100%' }}
                            >
                                <Menu.Item icon={<ClusterOutlined />} key="nodes">
                                    Nodes
                                </Menu.Item>
                                <Menu.Item icon={<AppstoreOutlined />} key="deployments">
                                    Deployments
                                </Menu.Item>
                                <Menu.Item icon={<CloudServerOutlined />} key="platform">
                                    Platform
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Content>
                            {this.state.activeTab === 'nodes' && <Nodes />}
                            {this.state.activeTab !== 'nodes' && <Text>WIP</Text>}
                        </Content>
                    </Layout>
                </Layout>
            </ApolloProvider>
        )
    }
}

export default App
