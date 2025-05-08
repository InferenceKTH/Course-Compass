import { useEffect, useState } from "react";
import ToolTip from './ToolTip';

export default function ButtonGroupField(props) {
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const normalizedInitialValue = props.initialValue.toLowerCase();
    const normalizedItems = props.items.map(item => item.toLowerCase());
    setActiveIndex(normalizedItems.findIndex(item => item === normalizedInitialValue));
  }, [props.initialValue, props.items]);


  const handleClick = (index) => {
    setActiveIndex(index);
    props.HandleFilterChange(["buttongroup","eligibility",props.items[index]]);
  };
  const getButtonClasses = (index) => {
    const baseClasses = `flex-auto py-1 px-4 inline-flex items-center gap-x-2 text-sm 
      font-medium focus:z-10 border border-gray-200 shadow-2xs hover:bg-[#8785ac]
      focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none`;
    const activeClass = activeIndex === index ? "bg-violet-500" : "bg-transparent";
    const roundedClasses =
      index === 0
        ? "rounded-l-lg"
        : index === props.items.length - 1
        ? "rounded-r-lg"
        : "border-l-0";
    return `${baseClasses} ${activeClass} ${roundedClasses}`;
  };
  return (
    <div className="my-1">
        <div className="flex flex-col sm:inline-flex sm:flex-row rounded-lg shadow-2xs 
      w-full items-center font-medium text-white bg-[#aba8e0]">
          {props.items.map((item, index) => (
            <button
              key={index}
              type="button"
              className={getButtonClasses(index)}
              onClick={() => handleClick(index)}
            >
              {item}
              
        <ToolTip
                text={`select this option to filter courses using the ${item} filtering option`}
                position={index == props.items.length - 1 ? "left" : "right"}
                hiddenIcon={true}
        />
            </button>
          ))}
        </div>
      </div>
  );
}