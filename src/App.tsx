import * as React from 'react'
import { Typography, Space } from 'antd'

const { Title, Text } = Typography

class App extends React.Component<{}, {}> {
    render() {
        return (
            <Space direction="vertical">
                <Title>Hello World!</Title>
                <Text>Welcome to Kraken-UI</Text>
            </Space>
        )
    }
}

export default App
