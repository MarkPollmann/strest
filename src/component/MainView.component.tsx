import React, { useContext, useState } from "react";
import { Store } from "../Store";
import { getSelectedTemplate } from "../reducer/request.reducer";
import { Row } from ".";

interface IDropdownProps<T> {
  value?: T;
  options: Array<{ label: string; value: T }>;
  onChange: (t: T) => void;
}

function Dropdown<T>(props: IDropdownProps<T>) {
  let [open, setOpen] = useState(false);

  let selectedOption = props.options.find(op => op.value === props.value);
  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        className="bg-blue-500 p-1 w-24 justify-center flex text-white text-bold cursor-pointer border-b-4 border-blue-700"
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

export function MainView() {
  let { state, dispatch } = useContext(Store);
  let [verb, setVerb] = useState("GET");

  let template = getSelectedTemplate(state);

  if (!template) {
    return <div>No template selected</div>;
  }

  return (
    <div className="p-4 w-full h-screen">
      <Row>
        <div className="flex-shrink-0">
          <div className="text-sm text-gray-700 px-2">Name</div>
          <input
            type="text"
            className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg px-4 block w-128 appearance-none leading-normal p-1"
            value={template.name}
            placeholder="100"
          />
        </div>
        <div className="flex-1 mx-4">
          <div className="text-sm text-gray-700">Params</div>
          <Row className="focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg overflow-hidden">
            <Dropdown
              options={[
                { label: "POST", value: "POST" },
                { label: "GET", value: "GET" }
              ]}
              onChange={setVerb}
              value={verb}
            />
            <input
              type="text"
              className="bg-white  px-4 block w-full appearance-none leading-normal p-1"
              value={template.url}
              placeholder="100"
            />
          </Row>
          <div className="text-sm text-blue-500 cursor-pointer">
            Switch to advanced
          </div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded my-4 flex-shrink-0">
          🔪 Send one
        </button>
      </Row>
    </div>
  );
}
