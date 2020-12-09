import * as React from 'react'
import { Typography, Menu, Layout, Table } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Skeleton } from 'antd'
import config from '../config'

const { Header, Content } = Layout

const { Title, Text } = Typography

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
    ]
    // @ts-ignore
    return <Table dataSource={data} columns={columns} />
}
