import * as React from 'react'
import { useState } from 'react'
import {
    Typography,
    Input,
    Alert,
    Button,
    Row,
    Col,
    Select,
    Steps,
    Timeline,
    Space,
    Card,
} from 'antd'
import { RetweetOutlined, DeleteOutlined } from '@ant-design/icons'
import DeploymentsTable from '../components/DeploymentsTable'
import LogsTable from '../components/LogsTable'
import { Query, Mutation } from 'urql'

const { Text } = Typography
const { Option } = Select
const { Step } = Steps

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

function useInput(initialValue) {
    const [value, setValue] = useState(initialValue)

    const bind = {
        value,
        onChange: e => {
            console.log(e.target.value)
            setValue(e.target.value)
        },
    }

    return [value, bind]
}

function Deployments() {
    const [deploymentStep, setDeploymentStep] = useState(0)
    const [deploymentBranch, setDeploymentBranch] = useState('')
    const [deploymentStepPercent, setDeploymentStepPercent] = useState(0)
    const [deploymentAlertText, setDeploymentAlertText] = useState('')
    const [urlInput, bindUrlInput] = useInput('')
    const [activeDetailId, setActiveDetailId] = useState('20dca356-0701-4fee-86d8-29bf06bfc2da')

    const spaceStyle = {
        width: 'calc(100% - 20px)',
        margin: '10px',
    }

    const columnStyle = {
        padding: '0px 10px 0px 10px',
    }

    const testDeployment = async () => {
        let url = urlInput
        setDeploymentStep(1)
        let pieces = url.split('/')
        if (pieces.length < 5) {
            setDeploymentStepPercent(100)
            setDeploymentAlertText('URL is invalid, not enough pieces. Did you include http://?')
            return
        }
        if (pieces[2] != 'github.com') {
            setDeploymentStepPercent(100)
            setDeploymentAlertText('URL is invalid, domain does not match github.com')
            return
        }
        setDeploymentStep(2)
        setDeploymentStepPercent(0)
        let data = await fetch(
            `https://api.github.com/repos/${pieces[3]}/${pieces[4]}/contents/shipwreck.toml`
        )
        let json = await data.json()
        if (json.sha == undefined) {
            setDeploymentStepPercent(100)
            setDeploymentAlertText('Cannot find a shipwreck.toml in the specified repository')
            return
        }
        setDeploymentStep(2)
        setDeploymentStepPercent(0)
        setDeploymentAlertText('')
        return true
    }

    return (
        <Space direction="vertical" style={spaceStyle}>
            <Card title="Create a New Deployment">
                <Row>
                    <Col span={12} style={columnStyle}>
                        <Text>Git Url for Deployment</Text>
                        <Input placeholder="Basic usage" {...bindUrlInput} />

                        <Text>Git Branch for Deployment</Text>
                        <Input placeholder="Basic usage" {...bindUrlInput} />

                        <Button style={{ marginTop: '10px' }} onClick={() => testDeployment()}>
                            Validate Deployment
                        </Button>
                    </Col>
                    <Col span={12} style={columnStyle}>
                        <Steps
                            direction="vertical"
                            current={deploymentStep}
                            percent={deploymentStepPercent}
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
                    {deploymentAlertText !== '' && (
                        <Alert message={deploymentAlertText} type="error" />
                    )}
                    {deploymentStep == 3 && (
                        <Mutation query={CREATE_DEPLOYMENT}>
                            {({ executeMutation }) => (
                                <Button
                                    style={{ marginTop: '10px' }}
                                    onClick={() =>
                                        executeMutation({
                                            url: urlInput,
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
                            if (activeDetailId == deployment.id) {
                                timeEntries = deployment.statusHistory.map(i => (
                                    <Timeline.Item label={new Date(i.time * 1000).toISOString()}>
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
                                    defaultValue={activeDetailId}
                                    onChange={i => setActiveDetailId(i)}
                                >
                                    {ids}
                                </Select>
                                <div style={{ marginBottom: 20 }}></div>
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

export default Deployments
