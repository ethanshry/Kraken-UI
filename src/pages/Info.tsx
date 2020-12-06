import * as React from 'react'
import { Typography, Menu, Layout, Table, Input, Alert, Button } from 'antd'
import { Space, Card } from 'antd'
import { LoadingOutlined, RetweetOutlined, DeleteOutlined } from '@ant-design/icons'
import DeploymentsTable from '../components/DeploymentsTable'
const { Header, Content } = Layout
import { Steps } from 'antd'
import { Row, Col } from 'antd'
const { Step } = Steps
import { Query, Mutation } from 'urql'
import { table } from 'console'
import ReactMarkdown from 'react-markdown'
import config from '../config'

const { Title, Text } = Typography

import styles from '../styles'

interface InfoState {
    deploymentStep: number
}

class Info extends React.Component<{}, InfoState> {
    constructor(props) {
        super(props)
        this.state = { deploymentStep: 0 }
    }

    changeDeploymentStep = index => {
        this.setState({
            deploymentStep: index,
        })
    }

    markdownStyle = {
        backgroundColor: config.palette.background,
        border: `1px solid ${config.palette.darkBorder}`,
        padding: 10,
        borderRadius: 5,
    }

    exampleToml = `
    [app] 
    name="test-app" 
    version="1.0.0" 
    author="Ethan Shry" 
    endpoint="https://github.com/ethanshry/scapegoat" 
    
    [config]
    lang="python3|node" 
    test="" 
    run="python3 ./src/main.py"
    port=9000 
    
    [env-vars] 
    test-var="test-var content"
    `

    render() {
        return (
            <Space direction="vertical" style={styles.spaceStyle}>
                <Card title="About">
                    <Row></Row>
                </Card>
                <Card title="Onboarding">
                    <Row>
                        <Steps
                            type="navigation"
                            current={this.state.deploymentStep}
                            onChange={this.changeDeploymentStep}
                        >
                            <Step
                                title="Step 1"
                                description="Create shipwreck.toml file"
                                status={
                                    this.state.deploymentStep > 0
                                        ? 'finish'
                                        : this.state.deploymentStep == 0
                                        ? 'process'
                                        : 'wait'
                                }
                            />
                            <Step
                                title="Step 2"
                                description="Determine Platform Compatibility"
                                status={
                                    this.state.deploymentStep > 1
                                        ? 'finish'
                                        : this.state.deploymentStep == 1
                                        ? 'process'
                                        : 'wait'
                                }
                            />
                            <Step
                                title="Step 3"
                                description="Onboard"
                                status={
                                    this.state.deploymentStep > 2
                                        ? 'finish'
                                        : this.state.deploymentStep == 2
                                        ? 'process'
                                        : 'wait'
                                }
                            />
                        </Steps>
                    </Row>
                    <Row>
                        {this.state.deploymentStep == 0 && (
                            <Col style={{ marginTop: 10 }}>
                                <div style={this.markdownStyle}>
                                    <ReactMarkdown>{this.exampleToml}</ReactMarkdown>
                                </div>
                            </Col>
                        )}
                        {this.state.deploymentStep == 1 && <div>1</div>}
                        {this.state.deploymentStep == 2 && <div>2</div>}
                    </Row>
                </Card>
            </Space>
        )
    }
}
export default Info
