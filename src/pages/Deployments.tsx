import * as React from 'react'
import { useState, useEffect } from 'react'
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
    List,
} from 'antd'
import { RetweetOutlined, DeleteOutlined } from '@ant-design/icons'
import DeploymentsTable from '../components/DeploymentsTable'
import LogsTable from '../components/LogsTable'
import { Query, Mutation, useQuery } from 'urql'

const { Text } = Typography
const { Option } = Select
const { Step } = Steps

const GET_DEPLOYMENTS = `
    query GetDeployments {
        getDeployments {
            id
            srcUrl
            version
            commit
            status
            memMb
            maxMemMb
            cpuUsage
            size
            port
            statusHistory {
                status
                time
            }
            resultsUrl
            deploymentUrl
            node
        }
        getNodes {
            id
            addr
        }
    }
`

const CREATE_DEPLOYMENT = `
  mutation CreateDeployment($url: String!, $gitBranch: String!) {
    createDeployment(deploymentUrl: $url, gitBranch: $gitBranch)
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

let auth = process.env.AUTH
    ? {
          headers: new Headers({
              Authorization: `token ${process.env.AUTH}`,
          }),
      }
    : {}

function Deployments() {
    const [deploymentStep, setDeploymentStep] = useState(0)
    const [deploymentBranch, setDeploymentBranch] = useState('')
    const [deploymentStepPercent, setDeploymentStepPercent] = useState(0)
    const [deploymentAlertText, setDeploymentAlertText] = useState('')
    const [deploymentUrl, bindDeploymentUrl] = useInput('')
    const [activeDetailId, setActiveDetailId] = useState('')
    const [deploymentBranchOptions, setDeploymentBranchOptions] = useState([''])

    useEffect(() => {
        async function findBranches() {
            setDeploymentStep(1)
            let pieces = deploymentUrl.split('/')
            if (pieces.length < 5) {
                setDeploymentStepPercent(100)
                setDeploymentAlertText(
                    'URL is invalid, not enough pieces. Did you include http://?'
                )
                return
            }
            if (pieces[2] != 'github.com') {
                setDeploymentStepPercent(100)
                setDeploymentAlertText('URL is invalid, domain does not match github.com')
                return
            }
            setDeploymentStep(2)
            setDeploymentStepPercent(0)
            setDeploymentAlertText('')
            let data = await fetch(
                `https://api.github.com/repos/${pieces[3]}/${pieces[4]}/branches`,
                auth
            )
            let json = await data.json()
            setDeploymentBranchOptions(json.map(branchData => branchData.name))
            setDeploymentBranch('')
        }
        if (deploymentUrl == '') {
            if (deploymentStep != 0) {
                setDeploymentStep(0)
            }
        } else {
            findBranches()
        }
    }, [deploymentUrl])

    useEffect(() => {
        async function findBranches() {
            setDeploymentStep(1)
            let pieces = deploymentUrl.split('/')
            let data = await fetch(
                `https://api.github.com/repos/${pieces[3]}/${pieces[4]}/contents/shipwreck.toml?ref=${deploymentBranch}`,
                auth
            )
            let json = await data.json()
            if (json.sha == undefined) {
                setDeploymentStepPercent(100)
                setDeploymentAlertText('Cannot find a shipwreck.toml in the specified repository')
                return
            }
            setDeploymentStep(3)
            setDeploymentStepPercent(0)
            setDeploymentAlertText('')
        }
        console.log(deploymentBranch)
        console.log(deploymentBranch == '')
        console.log(deploymentStep)
        if (deploymentBranch == '') {
            if (deploymentStep != 0) {
                setDeploymentStep(0)
            }
        } else {
            findBranches()
        }
    }, [deploymentBranch])

    const spaceStyle = {
        width: 'calc(100% - 20px)',
        margin: '10px',
    }

    const columnStyle = {
        padding: '0px 10px 0px 10px',
    }

    const [hasMadeInitialRequest, setHasMadeInitialRequest] = useState(false)

    const [result, reexecuteQuery] = useQuery({
        query: GET_DEPLOYMENTS,
        requestPolicy: 'network-only',
    })

    useEffect(() => {
        if (!result.fetching) {
            const id = setTimeout(
                () => reexecuteQuery({ requestPolicy: 'network-only', isPolling: true }),
                1000
            )
            return () => clearTimeout(id)
        }
    }, [result.fetching, reexecuteQuery])

    let { data, fetching, error } = result

    if (!fetching && !hasMadeInitialRequest) {
        setHasMadeInitialRequest(true)
    }

    let deploymentData = data
    let ids = []
    let timeEntries = []
    let activeDeployment = []
    if (deploymentData?.getDeployments) {
        deploymentData = deploymentData.getDeployments.map((deployment, index) => {
            ids.push(<Option value={deployment.id}>{deployment.id}</Option>)
            let addr =
                deploymentData.getNodes.filter(n => n.id == deployment.node)[0]?.addr +
                ':' +
                deployment.port
            if (activeDetailId == deployment.id) {
                activeDeployment = [
                    {
                        title: 'Status',
                        description: deployment.status,
                    },
                    {
                        title: 'Git Commit',
                        description: deployment.commit,
                    },
                    {
                        title: 'Current RAM',
                        description: deployment.memMb + ' Mb',
                    },
                    {
                        title: 'Max RAM',
                        description: deployment.maxMemMb + ' Mb',
                    },
                    {
                        title: 'Current CPU',
                        description: deployment.cpuUsage + ' %',
                    },
                    {
                        title: 'Url',
                        description: addr,
                    },
                ]
                timeEntries = deployment.statusHistory.map(i => (
                    <Timeline.Item label={new Date(i.time * 1000).toISOString()}>
                        {i.status}
                    </Timeline.Item>
                ))
                timeEntries.push(<Timeline.Item>{status}</Timeline.Item>)
            }

            return {
                key: index,
                id: deployment.id.slice(0, 8),
                status: deployment.status,
                srcUrl: deployment.srcUrl,
                version: deployment.commit.slice(0, 8),
                addr,
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
        deploymentData = undefined
    }

    return (
        <Space direction="vertical" style={spaceStyle}>
            <Card title="Create a New Deployment">
                <Row>
                    <Col span={12} style={columnStyle}>
                        <Text>Git Url for Deployment</Text>
                        <Input
                            placeholder="http://github.com/username/projectname"
                            {...bindDeploymentUrl}
                        />

                        <Text>Git Branch for Deployment</Text>
                        <br />
                        <Select
                            value={deploymentBranch}
                            onChange={i => setDeploymentBranch(i)}
                            filterOption={i => true}
                            key={deploymentBranchOptions[0]}
                            dropdownMatchSelectWidth={true}
                            style={{ width: '100%' }}
                        >
                            {deploymentBranchOptions.map(o => (
                                <Option key={o} value={o}>
                                    {o}
                                </Option>
                            ))}
                        </Select>
                        <br />
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
                                            url: deploymentUrl,
                                            gitBranch: deploymentBranch,
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

            <div>
                <Card title="Deployment Details">
                    <DeploymentsTable
                        data={deploymentData}
                        fetching={!hasMadeInitialRequest}
                        error={error}
                    />
                </Card>
                <Card title="Deployment Details" style={{ marginTop: 10 }}>
                    <Select
                        defaultValue={activeDetailId}
                        onChange={i => setActiveDetailId(i)}
                        style={{ width: '100%', maxWidth: '400px' }}
                    >
                        {ids}
                    </Select>
                    <div style={{ marginBottom: 20 }}></div>
                    <Row>
                        <Col span={12} style={columnStyle}>
                            <Timeline mode="left">{timeEntries}</Timeline>
                        </Col>
                        <Col span={12} style={columnStyle}>
                            <List
                                itemLayout="horizontal"
                                style={{ textAlign: 'right' }}
                                dataSource={activeDeployment}
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
                    </Row>
                </Card>
            </div>
            <Card title="Deployment Logs">
                <LogsTable />
            </Card>
        </Space>
    )
}

export default Deployments
