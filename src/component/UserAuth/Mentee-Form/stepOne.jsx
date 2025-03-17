import { GlobalContext } from '@/component/GlobalStore/GlobalState';
import React, { useContext } from 'react';

function StepOne() {
    const { handleIncreament ,} = useContext(GlobalContext)
    return (
        <div>
            StepOne
            <button onClick={handleIncreament}>Continue</button>
        </div>
    );
}

export default StepOne;