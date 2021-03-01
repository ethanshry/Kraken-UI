import * as React from 'react'
import { Typography, Menu, Layout, Table, Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Skeleton } from 'antd'
import config from '../config'
import { RetweetOutlined, DeleteOutlined } from '@ant-design/icons'
import DeploymentsTable from '../components/DeploymentsTable'
import { Query, Mutation } from 'urql'

const { Header, Content } = Layout

const { Title, Text } = Typography

const DELETE_LOG = `
  mutation DeleteLog($id: String!) {
    deleteLog(logId: $id)
  }
`

export default function LogsTable(props) {
    let { data, fetching, error } = props

    if (fetching) return <Skeleton active />
    if (error) return <Text>{`${error.message}`}</Text>

    if (data === undefined) {
        data = []
    }

    data = data.map(d => {
        return {
            id: d,
            link: (
                <a target="_blank" href={`http://0.0.0.0:${config.serverPort}/log/${d}`}>
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
                            onClick={() =>
                                executeMutation({
                                    id: d,
                                })
                            }
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
