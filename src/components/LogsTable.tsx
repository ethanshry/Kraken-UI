import * as React from 'react'
import { Typography, Table, Button } from 'antd'
import { useState, useEffect } from 'react'
import { Skeleton } from 'antd'
import config from '../config'
import { DeleteOutlined } from '@ant-design/icons'
import { Mutation, useQuery } from 'urql'

const { Text } = Typography

const GET_LOGS = `
    query GetLogs {
        getAvailableLogs
    }
`

const DELETE_LOG = `
  mutation DeleteLog($id: String!) {
    deleteLog(logId: $id)
  }
`

export default function LogsTable() {
    const [hasMadeInitialRequest, setHasMadeInitialRequest] = useState(false)

    const [result, reexecuteQuery] = useQuery({
        query: GET_LOGS,
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

    let { data, fetching, error } = result

    if (!fetching && !hasMadeInitialRequest) {
        setHasMadeInitialRequest(true)
    }

    if (!hasMadeInitialRequest) return <Skeleton active />
    if (error) return <Text>{`${error.message}`}</Text>

    if (data?.getAvailableLogs) {
        data = data.getAvailableLogs
    } else {
        data = []
    }

    data = data.map(d => {
        return {
            id: d,
            link: (
                <a target="_blank" href={`/log/${d}`}>
                    View Log
                </a>
            ),
            destroy: (
                <Mutation query={DELETE_LOG}>
                    {({ executeMutation }) => (
                        <Button
                            style={{ margin: 'auto' }}
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                executeMutation({
                                    id: d,
                                })
                                reexecuteQuery()
                            }}
                        />
                    )}
                </Mutation>
            ),
            key: d,
        }
    })

    const columns = [
        {
            title: 'Deployment Id',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id.localeCompare(b.id),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
        },
        {
            title: 'Delete',
            dataIndex: 'destroy',
            key: 'destroy',
        },
    ]
    // @ts-ignore
    return <Table dataSource={data} columns={columns} />
}
