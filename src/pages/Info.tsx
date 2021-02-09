import * as React from 'react'
import { useState } from 'react'
import { Row, Col, List, Typography, Steps, notification, Space, Card } from 'antd'
const { Step } = Steps
import ReactMarkdown from 'react-markdown'
import config from '../config'

const { Title, Text } = Typography

import styles from '../styles'

interface InfoState {
    deploymentStep: number
}

function Info() {
    const [deploymentStep, setDeploymentStep] = useState(0)

    const markdownStyle = {
        backgroundColor: config.palette.background,
        border: `1px solid ${config.palette.darkBorder}`,
        padding: 10,
        borderRadius: 5,
    }

    const exampleAppToml = `
    [app] 
    name="test-app" 
    version="1.0.0" 
    author="Ethan Shry" 
    endpoint="https://github.com/ethanshry/scapegoat" 
    `

    const exampleConfigToml = `
    [config]
    lang="python3|node" 
    test="" 
    run="python3 ./src/main.py"
    port=9000 
    `

    const copyText = ev => {
        ev.persist()
        let selection = window.getSelection()
        let range = document.createRange()
        range.selectNodeContents(ev.target)
        selection.removeAllRanges()
        selection.addRange(range)
        document.execCommand('copy')
        notification.open({
            message: 'Text copied to clipboard',
            description:
                'Paste the copied URL into the browser to test your shipwreck.toml location. Make sure to change the owner and repo!',
        })
    }

    const shipwreckAppData = [
        {
            title: 'name',
            description: 'The name of your application',
        },
        {
            title: 'version',
            description: 'Version of your application',
        },
        {
            title: 'author',
            description: "The name of the app's author",
        },
        {
            title: 'endpoint',
            description: 'The url of your github repository for your application',
        },
    ]

    const shipwreckConfigData = [
        {
            title: 'lang',
            description:
                'The language of your application. Used to select the dockerfile used to deploy your app. Currently supports "python3" and "node"',
        },
        {
            title: 'test',
            description: 'The command to run tests on your application',
        },
        {
            title: 'run',
            description: 'The command to run your application',
        },
        {
            title: 'port',
            description: 'The port your application will be exposed on',
        },
    ]

    return (
        <Space direction="vertical" style={styles.spaceStyle}>
            <Card title="About">
                <Row>
                    Kraken is a LAN-based, fault-tolerant, distributed application deployment
                    environment. The intention is to make use of existing local computing resources
                    for development instead of spinning up and paying for cloud computing. Specific
                    use cases include:
                    <ul>
                        <li>Local API development</li>
                        <li>Automated unit testing</li>
                        <li>Running of long-time jobs off of your primary hardware</li>
                    </ul>
                </Row>

                <Row>
                    In-Depth Documentation for the Kraken platform can be found&nbsp;
                    <a href="https://github.com/ethanshry/Kraken/tree/master/documentation">here</a>
                    .
                </Row>

                <Row>
                    The source code for the Kraken backend can be found&nbsp;
                    <a href="https://github.com/ethanshry/Kraken">here</a>.
                </Row>

                <Row>
                    The source code for the Kraken UI can be found&nbsp;
                    <a href="https://github.com/ethanshry/Kraken-UI">here</a>.
                </Row>
            </Card>
            <Card title="Onboarding">
                <Row>
                    <Steps
                        type="navigation"
                        current={deploymentStep}
                        onChange={i => setDeploymentStep(i)}
                    >
                        <Step
                            title="Step 1"
                            description="Create shipwreck.toml file"
                            status={
                                deploymentStep > 0
                                    ? 'finish'
                                    : deploymentStep == 0
                                    ? 'process'
                                    : 'wait'
                            }
                        />
                        <Step
                            title="Step 2"
                            description="Determine Platform Compatibility"
                            status={
                                deploymentStep > 1
                                    ? 'finish'
                                    : deploymentStep == 1
                                    ? 'process'
                                    : 'wait'
                            }
                        />
                        <Step
                            title="Step 3"
                            description="Onboard"
                            status={
                                deploymentStep > 2
                                    ? 'finish'
                                    : deploymentStep == 2
                                    ? 'process'
                                    : 'wait'
                            }
                        />
                    </Steps>
                </Row>
                <Row>
                    {deploymentStep == 0 && (
                        <Space direction="vertical">
                            <Row style={{ marginTop: 10 }}>
                                <Title>The shipwreck.toml</Title>
                            </Row>
                            <Row>
                                <Text>
                                    The <Text code>shipwreck.toml</Text> file is how the Kraken App
                                    Deployment Platform learns about your application. Think of it
                                    as a <Text code>package.json</Text> or{' '}
                                    <Text code>Cargo.toml</Text>
                                    file for a Kraken app.
                                </Text>

                                <Text>
                                    The <Text code>shipwreck.toml</Text> must be named exactly that,
                                    and must be placed at the root of your project's directory. For
                                    a good sanity check, if you can see a file at
                                    <Text
                                        code
                                        // @ts-ignore
                                        onClick={() => copyText()}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        https://api.github.com/repos/[github_owner_username]/[repo_name]/contents/shipwreck.toml
                                    </Text>
                                    Then you have put it in the right place.
                                </Text>
                            </Row>
                            <Row>
                                <Col span={12} style={{ marginTop: 10, paddingRight: 10 }}>
                                    <Title level={2}>app</Title>
                                    <Text>
                                        the app section contains data pertaining to your application
                                        overall
                                    </Text>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={shipwreckAppData}
                                        renderItem={(item: any) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={item.title}
                                                    description={item.description}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Col>
                                <Col span={12} style={{ marginTop: 40 }}>
                                    <div style={markdownStyle}>
                                        <ReactMarkdown>{exampleAppToml}</ReactMarkdown>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} style={{ marginTop: 10, paddingRight: 10 }}>
                                    <Title level={2}>config</Title>
                                    <Text>
                                        The config section contains data pertaining to the
                                        configuration of your application's deployment and
                                        deployment environment
                                    </Text>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={shipwreckConfigData}
                                        renderItem={(item: any) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={item.title}
                                                    description={item.description}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Col>
                                <Col span={12} style={{ marginTop: 40 }}>
                                    <div style={markdownStyle}>
                                        <ReactMarkdown>{exampleConfigToml}</ReactMarkdown>
                                    </div>
                                </Col>
                            </Row>
                        </Space>
                    )}
                    {deploymentStep == 1 && (
                        <Space direction="vertical">
                            <Row style={{ marginTop: 10 }}>
                                <Text>
                                    While the Kraken App Deployment Platform handles the deployment
                                    aspects of your project, it does not currently avoid conflicts
                                    with your deployments. As a result,{' '}
                                    <Text mark>
                                        it is up to you to ensure that no two projects will conflict
                                        with each other
                                    </Text>
                                    .{' '}
                                </Text>
                            </Row>
                            <Row>
                                <Text strong>
                                    Ensure that any application which exposes a port does not
                                    conflict with commonly used ports (i.e. 80, 8080), ports used by
                                    services (i.e. RabbitMQ's 5672/15672, or MySQLs 3306), or the
                                    port used by the Kraken App Platform, 8000.
                                </Text>
                            </Row>
                        </Space>
                    )}
                    {deploymentStep == 2 && (
                        <Space direction="vertical">
                            <Row style={{ marginTop: 10 }}>
                                <Text>
                                    To onboard an application to the platform, simply copy the URL
                                    from the address bar of the browser for whatever repo you want
                                    to create a deployment for.
                                </Text>
                            </Row>
                            <Row>
                                <Text mark>DO NOT use the git clone URL for your repository.</Text>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Text>
                                    Then take that URL to the <Text mark>Deployments</Text> tab of
                                    the Kraken App Deployment Platform, and paste it into the{' '}
                                    <Text mark>Git URL for Deployment</Text> field. Then click{' '}
                                    <Text mark>Validate Deployment</Text>, and if that is succesful,{' '}
                                    <Text mark>Create Deployment</Text>!
                                </Text>
                            </Row>
                        </Space>
                    )}
                </Row>
            </Card>
            <Card title="Issues">
                <Row>
                    If you see something, say something! Issues for both UI features and Backend
                    features can be raised&nbsp;
                    <a href="https://github.com/ethanshry/Kraken/issues/new">here</a>.
                </Row>
            </Card>
        </Space>
    )
}

export default Info
