import * as React from 'react'
import { Typography, Menu, Layout, Table } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import NodesTable from '../components/NodesTable'
const { Header, Content } = Layout

const { Title, Text } = Typography

export default function Platform() {
    const tableStyle = {
        margin: '10px',
    }
    return (
        <div style={tableStyle}>
            <NodesTable />
        </div>
    )
}
