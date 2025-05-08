import React from 'react';

const FilterEnableCheckbox = (props) => {
    return (
        <div className='mr-3'>
            <input
                type="checkbox"
                onChange={props.onToggle}
                defaultChecked={props.initialValue}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded-sm accent-violet-600"
            />
        </div>
    );
};

export default FilterEnableCheckbox;