import * as React from 'react'
import { Typography, Menu, Layout, Table } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Skeleton } from 'antd'

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

export default function DeploymentsTable(props) {
    let { data, fetching, error } = props
    if (fetching) return <Skeleton active />
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
        {
            title: 'Address',
            dataIndex: 'addr',
            key: 'addr',
        },
        {
            title: 'Update',
            dataIndex: 'update',
            key: 'update',
            width: 50,
        },
        {
            title: 'Destroy',
            dataIndex: 'destroy',
            key: 'destroy',
            width: 50,
        },
    ]

    return <Table dataSource={data} columns={columns} />
}
