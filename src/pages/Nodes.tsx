import * as React from 'react'
import { Typography, Menu, Layout, Table } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const { Header, Content } = Layout

const { Title, Text } = Typography

//import { useQuery, gql } from '@apollo/client'
import { useQuery } from 'urql'

const NODES = `
    query GetNodes {
        getNodes {
            id
            model
            ramUsed
            ramFree
            currentRamPercent
            uptime
            loadAvg5
            applicationInstances
        }
    }
`

export default function Nodes() {
    const [result, reexecuteQuery] = useQuery({ query: NODES })

    const { data, fetching, error } = result

    if (fetching) return <LoadingOutlined />
    if (error) return <Text>{`${error.message}`}</Text>

    console.log(data)

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'model',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: 'RAM Free (GB)',
            dataIndex: 'ramFree',
            key: 'ramFree',
        },
        {
            title: 'Ram Used (GB)',
            dataIndex: 'ramUsed',
            key: 'ramUsed',
        },
        {
            title: 'Load Avg 5',
            dataIndex: 'loadAvg5',
            key: 'loadAvg5',
        },
        {
            title: 'Uptime (S)',
            dataIndex: 'uptime',
            key: 'uptime',
        },
    ]

    let tableData = data.getNodes.map((node, index) => {
        return {
            key: index,
            id: node.id,
            model: node.model,
            ramFree: (node.ramFree / 1000000).toFixed(2),
            ramUsed: (node.ramUsed / 100000).toFixed(2),
            loadAvg5: node.loadAvg5.toFixed(3) * 100 + '%',
            uptime: node.uptime,
        }
    })

    return <Table dataSource={tableData} columns={columns} />
}
