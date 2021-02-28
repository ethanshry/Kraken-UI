import * as React from 'react'
import NodesTable from '../components/NodesTable'

export default function Nodes() {
    const tableStyle = {
        margin: '10px',
    }
    return (
        <div style={tableStyle}>
            <NodesTable />
        </div>
    )
}
