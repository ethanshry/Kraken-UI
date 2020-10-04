import * as React from 'react'
import { Typography, Menu, Layout, Table } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const { Header, Content } = Layout

const { Title, Text } = Typography

//import { useQuery, gql } from '@apollo/client'
import { useQuery } from 'urql'

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

export default function DeploymentsTable(data, fetching, error) {
    if (fetching) return <LoadingOutlined />
    if (error) return <Text>{`${error.message}`}</Text>

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Git Url',
            dataIndex: 'srcUrl',
            key: 'srcUrl',
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
        },
    ]

    let tableData = data.getDeployments.map((deployment, index) => {
        return {
            key: index,
            id: deployment.id,
            status: deployment.status,
            srcUrl: deployment.srcUrl,
            version: deployment.version,
        }
    })

    return <Table dataSource={tableData} columns={columns} />
}
