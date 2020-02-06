import React, { useState } from "react";

interface IDropdownProps<T> {
  value?: T;
  options: Array<{ label: string; value: T }>;
  onChange: (t: T) => void;
}

export function Dropdown<T>(props: IDropdownProps<T>) {
  let [open, setOpen] = useState(false);

  let selectedOption = props.options.find(op => op.value === props.value);
  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        className="bg-blue-500 h-10 w-24 justify-center items-center flex text-white font-bold cursor-pointer border-b-4 border-blue-700"
      >
        {selectedOption?.label}
      </div>
      {open && (
        <div className="bg-blue-500 flex flex-col items-center text-white rounded mt-1 cursor-pointer">
          {props.options.map(op => (
            <div
              key={`${op.label}`}
              onClick={() => {
                props.onChange(op.value);
                setOpen(false);
              }}
            >
              {op.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
