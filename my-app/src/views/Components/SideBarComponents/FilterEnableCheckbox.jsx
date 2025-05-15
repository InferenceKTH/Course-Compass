import React, { forwardRef } from "react";

/**
 * A basic checkbox to enable the filters. 
 * Used in the SidebarView.
 */
const FilterEnableCheckbox = forwardRef(({ initialValue, onToggle }, ref) => {
    return (
        <div className='mr-3'>
            <input
                ref={ref}
                type="checkbox"
                onChange={onToggle}
                defaultChecked={initialValue}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded-sm accent-violet-600"
            />
        </div>
    );
});

export default FilterEnableCheckbox;