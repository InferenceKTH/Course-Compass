import React, { useState, useRef } from "react";
import FilterEnableCheckbox from "./FilterEnableCheckbox";
import Tooltip from "./ToolTip";

const CollapsibleCheckboxes = (props) => {
  const [expandedLabel, setExpandedLabel] = useState(props?.initialValues?.map(i => i?.label));
  const [expanded, setExpanded] = useState([]);
  const [filterEnabled, setFilterEnabled] = useState(props.filterEnable);
  const [checkedSubItems, setCheckedSubItems] = useState({});
  const [initalLoad, setInitalLoad] = useState(true);

  const strokeWidth = 5;

  let paramFieldType = "checkboxhierarchy";

  const checkboxRef = useRef(null);

  const rows = props.fields;

  const toggleExpand = (id, subItems) => {  
    let entry = rows.find(item => item.id === id);
    if (!entry?.subItems || (entry?.subItems.length == 1 && !entry?.subItems[0])) { 
      props.HandleFilterChange([paramFieldType, props.filterName,
        entry?.label
      ]);
    }else if (entry && entry?.label && entry?.subItems) {
      subItems?.map((_, index) => {
        if ((checkedSubItems[`${id}-${index}`] && expanded[id]) || (!expanded[id])) {
            props.HandleFilterChange([paramFieldType, props.filterName,
              entry?.label + "/" + entry?.subItems[index]
              
            ]);
        }

        setSubCheckbox(id, index);
      });
    }
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const setSubCheckbox = (mainId, index) => {
    const key = `${mainId}-${index}`;
    setCheckedSubItems((prev) => ({
      ...prev,
      [key]: ((expanded[mainId] && prev[key]) || !expanded[mainId]) ? !prev[key]:false,
    }));
  };

  const toggleSubCheckbox = (mainId, index) => {
    const key = `${mainId}-${index}`;
    props.HandleFilterChange([paramFieldType, props.filterName,
      rows.find(item => item.id === mainId)?.label + "/" + rows.find(item => item.id === mainId)?.subItems[index]
    ]);
    setCheckedSubItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  React.useEffect(() => {
    if (rows && rows.length > 0 && initalLoad) {
      let tempExpanded = {};
      let tempChecked = {};
      rows.forEach(r => r.subItems.forEach((_, index) => {
        tempChecked[`${r.id}-${index}`] = false;
      }));
      props?.initialValues?.forEach(i => {
        let mainRow = rows.find((item) => item.label === i.label);
        if (mainRow) {
          tempExpanded[mainRow.id] = true;
          i.subItems.forEach(s => {
            let subItemIndex = mainRow.subItems.findIndex(item => item === s);
            if (subItemIndex !== -1) {
              tempChecked[`${mainRow.id}-${subItemIndex}`] = true;
            }
          });
        }
      });
      setCheckedSubItems(tempChecked);
      setInitalLoad(false);
      setExpanded(tempExpanded);
    }
  }, [rows]);
  


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
