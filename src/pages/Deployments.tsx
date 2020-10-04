import * as React from 'react'
import { Typography, Menu, Layout, Table } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import DeploymentsTable from '../components/DeploymentsTable'
const { Header, Content } = Layout

const { Title, Text } = Typography
import { useQuery } from 'urql'
import { table } from 'console'

const DEPLOYMENTS = `
    query GetDeployments {
        getDeployments {
            id
            srcUrl
            version
            commit
            status
            resultsUrl
            deploymentUrl
            node
          }
    }
`

export default function Deployments() {
    const tableStyle = {
        margin: '10px',
    }
    const [result, reexecuteQuery] = useQuery({
        query: DEPLOYMENTS,
        requestPolicy: 'network-only',
        pollInterval: 1000,
    })

    const { data, fetching, error } = result

    let tableData = data
    console.log(tableData)
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
        <div style={tableStyle}>
            <DeploymentsTable data={tableData} fetching={fetching} error={error} />
        </div>
    )
}
