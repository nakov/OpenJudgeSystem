import React from 'react';
import './SpinningLoader.scss';

const SpinningLoader = () => {
    return(<div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>)
}

export default SpinningLoader;