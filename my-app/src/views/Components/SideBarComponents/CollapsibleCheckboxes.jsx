import React, { useState, useRef } from "react";
import FilterEnableCheckbox from "./FilterEnableCheckbox";
import Tooltip from "./ToolTip";

const CollapsibleCheckboxes = (props) => {
  const [expanded, setExpanded] = useState({});
  const [filterEnabled, setFilterEnabled] = useState(props.filterEnable);
  const [checkedSubItems, setCheckedSubItems] = useState({});
  const [stupidLines, setStupidLines] = useState(0);

  const strokeWidth = 5;

  let paramFieldType = "checkboxhierarchy";

  const checkboxRef = useRef(null);

  const rows = props.fields;

  const toggleExpand = (id, subItems) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    let label = rows.find(item => item.id === id).label;
    subItems.map((_, index) => {
      setSubCheckbox(id, index)
      if (rows.find(item => item.id === id)?.subItems && rows.find(item => item.id === id)?.subItems.length>0 && rows.find(item => item.id === id)?.subItems[0]) {
        props.HandleFilterChange([paramFieldType, props.filterName,
          label + "/" + rows.find(item => item.id === id).subItems[index]
        ]);
      } else {
        props.HandleFilterChange([paramFieldType, props.filterName,
          label
        ]);
      }
    });
  };

  const setSubCheckbox = (mainId, index) => {
    const key = `${mainId}-${index}`;
    setCheckedSubItems((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const toggleSubCheckbox = (mainId, index) => {
    const key = `${mainId}-${index}`;
    setCheckedSubItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    props.HandleFilterChange([paramFieldType, props.filterName,
      rows.find(item => item.id === mainId).label + "/" + rows.find(item => item.id === mainId).subItems[index]
    ]);
  };


  return (
    <div className="m-2">
      <div className="mb-2 text-white flex items-center justify-between">
        <div className="flex-none items-center">
          <h3>{String(props.filterName).charAt(0).toUpperCase() + String(props.filterName).slice(1)}</h3>
        </div>
        <div className="flex-auto pl-3 pt-2">
          <Tooltip
            text={props.description}
            position={"right"}
          />
        </div>
        <FilterEnableCheckbox
          ref={checkboxRef}
          initialValue={filterEnabled}
          onToggle={() => { setFilterEnabled(!filterEnabled); props.HandleFilterEnable([props.filterName, !filterEnabled]); }}
        />
      </div>
      <div className={`${filterEnabled ? "opacity-100" : "opacity-50"}`} onClick={() => {
        if (!filterEnabled && checkboxRef.current) {
          checkboxRef.current.click();
        }
      }}>
        <div className="rounded-lg shadow-2xs w-full text-white bg-[#aba8e0] border border-gray-200 p-4">
          {rows.map((row) => (
            <div key={row.id} className="relative pl-4  ml-2">
              <div className="flex items-center gap-2 mb-1 relative">
                <input
                  type="checkbox"
                  id={`checkbox-${row?.id}`}
                  checked={expanded[row?.id] || false}
                  onChange={() => toggleExpand(row?.id, row?.subItems)}
                  className="accent-violet-500 z-10"
                />
                <label htmlFor={`checkbox-${row.id}`} className="cursor-pointer font-semibold">
                  {row.label}
                </label>
              </div>

              <svg
                width="40"
                height={`${expanded[row.id] ? (((!row?.subItems || row?.subItems?.length > 1) ? row.subItems.length : 0)) * 24 + 34 : 30}`}
                viewBox={`0 0 40 ${expanded[row.id] ? (((!row?.subItems || row?.subItems?.length > 1) ? row.subItems.length : 0)) * 24 + 34 : 30}`}
                preserveAspectRatio="none"
                className="absolute left-[-25px] top-[-5px]"
              >
                {/*big horizontal line */}
                <path
                  d={`M20 0 V${((!row?.subItems || row?.subItems?.length > 1) ? row.subItems.length : 0) * 24 + 33}`}
                  stroke="white"
                  strokeWidth={strokeWidth}
                  fill="none"
                  className=""
                />
                {/*top vertical line */}
                {row.id === 1 && (
                  <path
                    d={`M20 2 H33`}
                    stroke="white"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className=""
                  />
                )}
                {/*bottom vertical line */}
                {row.id === rows.length && (
                  <path
                    d={`M20 ${(expanded[row.id] ? row.subItems.length : 1) * 34 - 8} H33`}
                    stroke="white"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className=""
                  />
                )}

              </svg>

              {expanded[row.id] && row.subItems.length > 1 && (
                <div className="mt-2 relative ">
                  {/*vertical line */}
                  <svg
                    width="40"
                    height={`${(row.subItems.length) * 24}`}
                    viewBox={`0 0 40 ${(row.subItems.length) * 24}`}
                    preserveAspectRatio="none"
                    className="absolute left-[-14px] top-[-10px] transition-all duration-300 ease-in-out stroke-animate"
                  >
                    <path
                      d={`M20 0 V${(row.subItems.length) * 32}`}
                      stroke="white"
                      strokeWidth={strokeWidth}
                      fill="none"
                      className="transition-all duration-300 ease-in-out stroke-animate"
                    />
                  </svg>
                  {row.subItems.map((subItem, index) => {
                    const checkboxId = `sub-checkbox-${row.id}-${index}`;
                    const key = `${row.id}-${index}`;

                    return (
                      <div key={checkboxId} className="relative pl-6 flex items-center">
                        {/* SVG line only if the checkbox is checked */}
                        {checkedSubItems[key] && (
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 50"
                            preserveAspectRatio="none"
                            className="absolute left-[-14px] top-1 transition-all duration-300 ease-in-out stroke-animate"
                          >
                            <path
                              d="M20 10 H33"
                              stroke="white"
                              strokeWidth={strokeWidth}
                              fill="none"
                              className="transition-all duration-300 ease-in-out stroke-animate"
                            />
                          </svg>
                        )}

                        <input
                          type="checkbox"
                          id={checkboxId}
                          className="accent-violet-500"
                          checked={!!checkedSubItems[key]}
                          onChange={() => toggleSubCheckbox(row.id, index)}
                        />
                        <label htmlFor={checkboxId} className="cursor-pointer ml-2 truncate max-w-xs">
                          {subItem}
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleCheckboxes;
