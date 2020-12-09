import * as React from 'react'
import { Typography, Menu, Layout, Table, Input, Alert, Button } from 'antd'
import { Space, Card } from 'antd'
import { LoadingOutlined, RetweetOutlined, DeleteOutlined } from '@ant-design/icons'
import DeploymentsTable from '../components/DeploymentsTable'
import LogsTable from '../components/LogsTable'
const { Header, Content } = Layout
import { Steps, Timeline } from 'antd'
import { Row, Col, Select } from 'antd'
const { Step } = Steps
const { Title, Text } = Typography
import { Query, Mutation } from 'urql'
import { table } from 'console'

const { Option } = Select

const DEPLOYMENTS = `
    query GetDeployments {
        getDeployments {
            id
            srcUrl
            version
            commit
            status
            statusHistory {
                status
                time
            }
            resultsUrl
            deploymentUrl
            node
          }
    }
`

const LOGS = `
    query GetLogs {
        getAvailableLogs
    }
`

const CREATE_DEPLOYMENT = `
  mutation CreateDeployment($url: String!) {
    createDeployment(deploymentUrl: $url)
  }
`

const UPDATE_DEPLOYMENT = `
  mutation UpdateDeployment($id: String!) {
    pollRedeploy(deploymentId: $id)
  }
`

const CANCEL_DEPLOYMENT = `
  mutation CancelDeployment($id: String!) {
    cancelDeployment(deploymentId: $id)
  }
`
/*
export default function Deployments() {
    const spaceStyle = {
        width: 'calc(100% - 20px)',
        margin: '10px',
    }
    const tableStyle = {}
    const [result, reexecuteQuery] = useQuery({
        query: DEPLOYMENTS,
        requestPolicy: 'network-only',
        pollInterval: 1000,
    })

    const { data, fetching, error } = result

    let tableData = data
    console.log(tableData)
    console.log(fetching)
    if (tableData) {
        tableData = tableData.getDeployments.map((deployment, index) => {
            return {
                key: index,
                id: deployment.id,
                status: deployment.status,
                srcUrl: deployment.srcUrl,
                version: deployment.version,
            }
        })
    }

    return (
        <Space direction="vertical" style={spaceStyle}>
            <Card title="Create a New Deployment">
                <Space direction="horizontal">
                    <Space direction="vertical">
                        <Text>Git Url for Deployment</Text>
                        <Input placeholder="Basic usage" />
                    </Space>
                    <Space direction="vertical">
                        <Steps direction="vertical" current={0}>
                            <Step title="Awaiting Url" description="" />
                            <Step
                                title="Validating Repository Link"
                                description="The URL connects to a valid Git Repository"
                            />
                            <Step
                                title="Configuration Exists"
                                description="A shipwreck.toml exists in the repository root"
                            />
                        </Steps>
                    </Space>
                </Space>
            </Card>
            <Card title="Active Deployments">
                <div style={tableStyle}>
                    <DeploymentsTable data={tableData} fetching={fetching} error={error} />
                </div>
            </Card>
        </Space>
    )
}
*/

interface AppState {
    deploymentStep: number
    deploymentUrl: string
    deploymentStepPercent: number
    deploymentAlertText: string
    urlInput: any
    activeDetailId: string
}

class Deployments extends React.Component<{}, AppState> {
    constructor(props) {
        super(props)
        this.state = {
            deploymentStep: 0,
            deploymentUrl: '',
            deploymentStepPercent: 0,
            deploymentAlertText: '',
            urlInput: React.createRef(),
            activeDetailId: '20dca356-0701-4fee-86d8-29bf06bfc2da',
        }
    }

    spaceStyle = {
        width: 'calc(100% - 20px)',
        margin: '10px',
    }

    columnStyle = {
        padding: '0px 10px 0px 10px',
    }

    testDeployment = async () => {
        let url = this.state.urlInput.current.state.value
        this.setState({ deploymentUrl: url, deploymentStep: 1 })
        let pieces = url.split('/')
        if (pieces.length < 5) {
            this.setState({
                deploymentStepPercent: 100,
                deploymentAlertText: 'URL is invalid, not enough pieces. Did you include http://?',
            })
            return
        }
        if (pieces[2] != 'github.com') {
            this.setState({
                deploymentStepPercent: 100,
                deploymentAlertText: 'URL is invalid, domain does not match github.com',
            })
            return
        }
        this.setState({ deploymentStep: 2, deploymentStepPercent: 0 })
        let data = await fetch(
            `https://api.github.com/repos/${pieces[3]}/${pieces[4]}/contents/shipwreck.toml`
        )
        let json = await data.json()
        if (json.sha == undefined) {
            this.setState({
                deploymentStepPercent: 100,
                deploymentAlertText: 'Cannot find a shipwreck.toml in the specified repository',
            })
            return
        }
        this.setState({ deploymentStep: 3, deploymentStepPercent: 100, deploymentAlertText: '' })
        return true
    }

    updateActiveDetailId = id => {
        this.setState({ activeDetailId: id })
    }
    /*
    createDeployment = async (url) => {
        const [state, executeMutation] = useMutation(CREATE_DEPLOYMENT)

        const submit = React.useCallback(() => {
            executeMutation({url})
        }, [executeMutation, url])
    }
    */

    render() {
        return (
            <Space direction="vertical" style={this.spaceStyle}>
                <Card title="Create a New Deployment">
                    <Row>
                        <Col span={12} style={this.columnStyle}>
                            <Text>Git Url for Deployment</Text>
                            <Input placeholder="Basic usage" ref={this.state.urlInput} />

                            <Button style={{ marginTop: '10px' }} onClick={this.testDeployment}>
                                Validate Deployment
                            </Button>
                        </Col>
                        <Col span={12} style={this.columnStyle}>
                            <Steps
                                direction="vertical"
                                current={this.state.deploymentStep}
                                percent={this.state.deploymentStepPercent}
                            >
                                <Step title="Awaiting Url" description="" />
                                <Step
                                    title="Validating Repository Link"
                                    description="The URL connects to a valid Git Repository"
                                />
                                <Step
                                    title="Configuration Exists"
                                    description="A shipwreck.toml exists in the repository root"
                                />
                                <Step title="Deployment is Valid" />
                            </Steps>
                        </Col>
                    </Row>
                    <Row>
                        {this.state.deploymentAlertText !== '' && (
                            <Alert message={this.state.deploymentAlertText} type="error" />
                        )}
                        {this.state.deploymentStep == 3 && (
                            <Mutation query={CREATE_DEPLOYMENT}>
                                {({ executeMutation }) => (
                                    <Button
                                        style={{ marginTop: '10px' }}
                                        onClick={() =>
                                            executeMutation({
                                                url: this.state.urlInput.current.state.value,
                                            })
                                        }
                                    >
                                        Create Deployment
                                    </Button>
                                )}
                            </Mutation>
                        )}
                    </Row>
                </Card>

                <Query query={DEPLOYMENTS} requestPolicy="network-only" pollInterval={1000}>
                    {({ fetching, data, error }) => {
                        let tableData = data
                        let ids = []
                        let timeEntries = []
                        if (tableData?.getDeployments) {
                            tableData = tableData.getDeployments.map((deployment, index) => {
                                ids.push(<Option value={deployment.id}>{deployment.id}</Option>)
                                if (this.state.activeDetailId == deployment.id) {
                                    timeEntries = deployment.statusHistory.map(i => (
                                        <Timeline.Item
                                            label={new Date(i.time * 1000).toISOString()}
                                        >
                                            {i.status}
                                        </Timeline.Item>
                                    ))
                                    timeEntries.push(<Timeline.Item>{status}</Timeline.Item>)
                                }
                                return {
                                    key: index,
                                    id: deployment.id,
                                    status: deployment.status,
                                    srcUrl: deployment.srcUrl,
                                    version: deployment.version,
                                    update: (
                                        <Mutation query={UPDATE_DEPLOYMENT}>
                                            {({ executeMutation }) => (
                                                <Button
                                                    type="primary"
                                                    icon={<RetweetOutlined />}
                                                    onClick={() =>
                                                        executeMutation({
                                                            id: deployment.id,
                                                        })
                                                    }
                                                />
                                            )}
                                        </Mutation>
                                    ),
                                    destroy: (
                                        <Mutation query={CANCEL_DEPLOYMENT}>
                                            {({ executeMutation }) => (
                                                <Button
                                                    style={{ margin: 'auto' }}
                                                    type="primary"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() =>
                                                        executeMutation({
                                                            id: deployment.id,
                                                        })
                                                    }
                                                />
                                            )}
                                        </Mutation>
                                    ),
                                }
                            })
                        } else {
                            tableData = undefined
                        }
                        return (
                            <div>
                                <Card title="Deployment Details">
                                    <DeploymentsTable
                                        data={tableData}
                                        fetching={fetching}
                                        error={error}
                                    />
                                </Card>
                                <Card title="Deployment Details" style={{ marginTop: 10 }}>
                                    <Select
                                        defaultValue={this.state.activeDetailId}
                                        onChange={this.updateActiveDetailId}
                                    >
                                        {ids}
                                    </Select>
                                    <Timeline mode="left">{timeEntries}</Timeline>
                                </Card>
                            </div>
                        )
                    }}
                </Query>
                <Card title="Deployment Logs">
                    <Query query={LOGS} requestPolicy="network-only" pollInterval={5000}>
                        {({ fetching, data, error }) => {
                            let tableData = data
                            if (tableData?.getAvailableLogs) {
                                tableData = tableData.getAvailableLogs
                            } else {
                                tableData = undefined
                            }
                            return <LogsTable data={tableData} fetching={fetching} error={error} />
                        }}
                    </Query>
                </Card>
            </Space>
        )
    }
}

export default Deployments
