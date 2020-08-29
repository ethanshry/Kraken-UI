import * as React from 'react'
import { Typography, Menu, Layout } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const { Header, Content } = Layout

const { Title, Text } = Typography

import { useQuery, gql } from '@apollo/client'

const NODES = gql`
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
    const { loading, error, data } = useQuery(NODES)

    if (loading) return <LoadingOutlined />
    if (error) return <Text>{`${error}`}</Text>

    console.log(data)

    return <Text>{`${data}`}</Text>
}
