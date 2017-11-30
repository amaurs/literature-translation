import React from 'react';

class Data extends React.Component {
    render() {
        return <pre className="json"><code>{JSON.stringify(this.props.data, null, 4)}</code></pre>;
    }
}

export default Data;