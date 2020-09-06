import React from 'react'

const Rank = ({name,rank}) => {
    return (
        <div>
            <div className='white f3'>
                {name + ', your current rank is '+rank }
            </div>
            {/* <div className='white f3'>
            {'Andrei, your current rank is...'}
            </div> */}
        </div>
    );
}

export default Rank;

