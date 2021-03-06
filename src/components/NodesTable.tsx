import * as React from 'react'
import { useState, useEffect } from 'react'
import { Typography, Table } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const { Text } = Typography

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
    const [hasMadeInitialRequest, setHasMadeInitialRequest] = useState(false)

    const [result, reexecuteQuery] = useQuery({
        query: NODES,
        requestPolicy: 'network-only',
    })

    useEffect(() => {
        if (!result.fetching) {
            const id = setTimeout(
                () => reexecuteQuery({ requestPolicy: 'network-only', isPolling: true }),
                5000
            )
            return () => clearTimeout(id)
        }
    }, [result.fetching, reexecuteQuery])

    const { data, fetching, error } = result

    if (!fetching && !hasMadeInitialRequest) {
        setHasMadeInitialRequest(true)
    }

    if (!hasMadeInitialRequest) return <LoadingOutlined />
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
            title: 'Address',
            dataIndex: 'addr',
            key: 'addr',
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
            addr: node.addr,
            ramFree: (node.ramFree / 1000000).toFixed(2),
            ramUsed: (node.ramUsed / 100000).toFixed(2),
            loadAvg5: node.loadAvg5.toFixed(3) * 100 + '%',
            uptime: node.uptime,
        }
    })

    return <Table<any> dataSource={tableData} columns={columns} />
}
