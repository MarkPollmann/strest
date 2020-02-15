import React, { useState } from "react";

interface IDropdownProps<T> {
  value?: T;
  options: Array<{ label: string; value: T }>;
  onChange: (t: T) => void;
  tooltip?: string;
  mainCallback?: () => void;
}

export function Dropdown<T>(props: IDropdownProps<T>) {
  let [open, setOpen] = useState(false);

  function toggle() {
    setOpen(!open);
  }

  let selectedOption = props.options.find(op => op.value === props.value);

  return (
    <div>
      <div
        className="bg-blue-500 h-8 justify-center items-center flex text-white cursor-pointer rounded overflow-hidden"
      >
        <div className="border-r py-2 px-4 border-gray-400 tooltip" onClick={() => props.mainCallback ? props.mainCallback() : toggle}>
          {props.tooltip &&
            <div className="tooltip-text border bg-white rounded p-3 -mt-6 -mr-6 rounded text-gray-500 text-xs">
              {props.tooltip}
            </div>
          }
          {selectedOption?.label}
        </div>
        <div className="p-2 text-xs" onClick={toggle}>
          ▼
        </div>
      </div>
      {open && (
        <div className="bg-gray-100 shadow-lg flex flex-col items-center text-gray-700 rounded mt-1 cursor-pointer absolute" style={{ minWidth: 100 }}>
          {props.options.map(op => (
            <div
              key={`${op.label}`}
              onClick={() => {
                props.onChange(op.value);
                setOpen(false);
              }}
              className="w-full text-center px-3 hover:bg-blue-300 py-1 border-b border-gray-400"
            >
              {op.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
