import React, { useContext, useState } from "react";
import { Store } from "../Store";
import { getSelectedTemplate } from "../reducer/request.reducer";
import { Row, Dropdown } from ".";
import { Card } from "./Card.component";
import {
  sendRequest,
  updateTemplate,
  deleteTemplate
} from "../action/request.action";

enum Tab {
  RESULTS = "RESULTS",
  RESPONSES = "RESPONSES"
}

export function MainView() {
  let { state, dispatch } = useContext(Store);
  let [verb, setVerb] = useState("GET");
  let [tab, setTab] = useState<Tab>(Tab.RESPONSES);

  let template = getSelectedTemplate(state);

  if (!template) {
    return <div>No template selected</div>;
  }

  function sendOneRequest() {
    sendRequest(dispatch, template.url, template.id);
  }

  function updateTemplateName(event: React.ChangeEvent<HTMLInputElement>) {
    updateTemplate(dispatch, template.id, {
      name: event.target.value
    });
  }

  function updateTemplateUrl(event: React.ChangeEvent<HTMLInputElement>) {
    updateTemplate(dispatch, template.id, {
      url: event.target.value
    });
  }

  function removeTemplate() {
    deleteTemplate(dispatch, template.id);
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4">
        <Row>
          <div className="flex-shrink-0">
            <div className="text-sm text-gray-700 px-2">Name</div>
            <input
              type="text"
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg px-4 block w-128 appearance-none leading-normal py-2"
              value={template.name}
              placeholder="Request name"
              onChange={updateTemplateName}
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
                className="bg-white  px-4 block w-full appearance-none leading-normal p-2"
                value={template.url}
                placeholder="https://google.com"
                onChange={updateTemplateUrl}
              />
            </Row>
            <div className="text-sm text-blue-500 cursor-pointer">
              Switch to advanced request
            </div>
          </div>
          <button
            className="bg-white hover:bg-blue-400 text-gray-700 font-bold py-2 px-4 border-b-4 border border-gray-500 hover:border-gray-500 rounded my-4"
            onClick={removeTemplate}
          >
            ➖ Remove
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded my-4 flex-shrink-0"
            onClick={sendOneRequest}
          >
            🔫 Send one
          </button>
        </Row>
      </div>
      {/* Main Content */}

      <div className="h-full">
        <ul className="flex border-b">
          <li
            className={`border-t border-r border-l ${tab === Tab.RESULTS &&
              "bg-blue-100"} rounded-t p-2 ml-6`}
            onClick={() => setTab(Tab.RESULTS)}
          >
            <a className="text-blue-700 hover:text-blue-800" href="#">
              Results
            </a>
          </li>
          <li
            className={`border-t border-r border-l ${tab === Tab.RESPONSES &&
              "bg-blue-100"} rounded-t p-2 ml-2`}
            onClick={() => setTab(Tab.RESPONSES)}
          >
            <a className="text-blue-700 hover:text-blue-800" href="#">
              Responses
            </a>
          </li>
        </ul>

        {/* Analysis */}
        {tab === Tab.RESULTS && (
          <div className="p-4">
            <Row horizontal="space-between">
              <Card>
                <div className="text-lg">Response times</div>
                <Row>
                  <div>Average</div>
                  <div>200ms</div>
                </Row>
                <Row>
                  <div>min</div>
                  <div>150ms</div>
                </Row>
                <Row>
                  <div>max</div>
                  <div>300ms</div>
                </Row>
              </Card>

              <Card>
                <div className="text-lg">Response Counts</div>
                <Row>
                  <div>2XX</div>
                  <div>1350</div>
                </Row>
                <Row>
                  <div>4XX</div>
                  <div>300</div>
                </Row>
                <Row>
                  <div>5XX</div>
                  <div>10</div>
                </Row>
              </Card>

              <Card>
                <div className="text-lg">Bandwidth</div>
                <Row>
                  <div>Sent</div>
                  <div>300kb</div>
                </Row>
                <Row>
                  <div>Received</div>
                  <div>400kb</div>
                </Row>
              </Card>
            </Row>
          </div>
        )}

        {tab === Tab.RESPONSES && (
          <div className="overflow-y-auto max-h-full w-full p-2">
            <table className="table-fixed w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">N.</th>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Time (ms)</th>
                  <th className="px-4 py-2 w-1/3">Body</th>
                  <th className="px-4 py-2 w-1/3">Headers</th>
                </tr>
              </thead>
              <tbody>
                {state.request.responses[template.id].map(
                  (response: any, idx: number) => {
                    return (
                      <tr key={`response-row-${idx}`}>
                        <td className="border px-4 py-2">{idx}</td>
                        <td className="border px-4 py-2">{response.status}</td>
                        <td className="border px-4 py-2 tooltip">
                          <div className="tooltip-text border bg-white rounded p-3 -mt-6 -mr-6 rounded">
                            <span className="text-gray-500">
                              timestamps: {response.startedAt.toString()} -{" "}
                              {response.endedAt.toString()}
                            </span>
                          </div>
                          {response.time}
                        </td>
                        <td className="border px-4 py-2 tooltip">
                          <div className="tooltip-text border bg-white rounded p-3 -mt-6 -mr-6 rounded">
                            <span className="text-gray-500">
                              (Just click to copy!)
                            </span>
                            {/* {response.body} */}
                          </div>

                          {response.body?.substring(0, 30)}
                        </td>
                        <td className="border px-4 py-2 tooltip">
                          <div className="tooltip-text border bg-white rounded p-3 -mt-6 -mr-6 rounded">
                            <span className="text-gray-500">
                              (Just click to copy!)
                            </span>
                            {response.headers}
                          </div>
                          {response.headers?.substring(0, 30)}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
            {!state.request.responses[template.id].length && (
              <div className="w-full flex justify-center items-center h-32 text-gray-500 ">
                No responses
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
