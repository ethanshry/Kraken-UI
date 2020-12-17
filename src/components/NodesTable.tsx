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
            addr
            ramUsed
            ramFree
            currentRamPercent
            uptime
            loadAvg5
        }
    }
`

// TODO implement https://github.com/borisyankov/react-sparklines

export default function NodesTable() {
    const [result, reexecuteQuery] = useQuery({
        query: NODES,
        requestPolicy: 'network-only',
        pollInterval: 1000,
    })

    const { data, fetching, error } = result

    if (fetching) return <LoadingOutlined />
    if (error) return <Text>{`${error.message}`}</Text>

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
