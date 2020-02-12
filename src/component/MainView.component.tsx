import React, { useState } from "react";

import {
  getSelectedTemplate,
  getSelectedTemplateResponses,
  RequestType,
  HttpVerb
} from "../reducer/request.reducer";
import { Row, Dropdown, ResponseDialogs } from ".";
import {
  sendRequest,
  updateTemplate,
  deleteTemplate
} from "../action/request.action";
import { ResponseTimeChart } from "./ResponseTimeChart.component";
import { Controlled as CodeMirror } from "react-codemirror2";
import { connect } from "react-redux";
require("codemirror/mode/javascript/javascript");
require("codemirror/lib/codemirror.css");

enum Tab {
  RESULTS = "RESULTS",
  RESPONSES = "RESPONSES"
}

let templateTextPrefix = `import chance from 'chance'; // use chance to generate random values, ex: chance.string()

// This function will be executed to generate the request
// resp. chain contains the response from previous responses in the workflow
function getRequest(
  responseChain: {status: number, body: string, headers: any}[]
): Promise<any> {
  `;
let templateSuffix = "\n}";

function wrapRequestTextInCallback(text: string) {
  return `${templateTextPrefix}${text}${templateSuffix}`;
}

interface IProps {
  template: any;
  responses: any;
}

export function _MainView(props: IProps) {
  // Initial component state
  let { template, responses } = props;

  let [tab, setTab] = useState<Tab>(Tab.RESULTS);

  if (!template) {
    return <div>No template selected</div>;
  }

  function sendOneRequest() {
    sendRequest(template, []);
  }

  function updateTemplateName(event: React.ChangeEvent<HTMLInputElement>) {
    updateTemplate(template.id, {
      name: event.target.value
    });
  }

  function updateTemplateUrl(event: React.ChangeEvent<HTMLInputElement>) {
    updateTemplate(template.id, {
      url: event.target.value
    });
  }

  function updateTemplateCount(event: React.ChangeEvent<HTMLInputElement>) {
    updateTemplate(template.id, {
      count: Number.parseInt(event.target.value)
    });
  }

  function updateTemplateConcurrency(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    updateTemplate(template.id, {
      concurrency: Number.parseInt(event.target.value)
    });
  }

  function removeTemplate() {
    deleteTemplate(template.id);
  }

  function switchType() {
    updateTemplate(template.id, {
      type:
        template.type === RequestType.BASIC
          ? RequestType.ADVANCED
          : RequestType.BASIC,
      text:
        template.text ||
        `return fetch('${template.url}', {method: '${template.verb}'});`
    });
  }

  // function resetTemplate() {}

  function updateTemplateText(text: string) {
    updateTemplate(template.id, { text });
  }

  function updateTemplateVerb(verb: HttpVerb) {
    updateTemplate(template.id, { verb });
  }

  return (
    <div className="w-full max-h-screen flex flex-col pt-64 relative">
      <div className="p-4 absolute bg-white top-0 right-0 left-0 border-b">
        <Row wrap>
          <div className="flex-shrink-0">
            <div className="text-sm text-gray-700">Name</div>
            <input
              type="text"
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg px-4 block w-full appearance-none leading-normal py-2"
              value={template.name}
              placeholder="Request name"
              onChange={updateTemplateName}
            />
            <div className="text-sm text-gray-700 mt-2">Size/Concurrency</div>
            <div className="flex flex-row items-center">
              <input
                type="number"
                className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg px-2 mr-1 block w-24 appearance-none leading-normal"
                value={template.count}
                placeholder="100"
                onChange={updateTemplateCount}
              />
              <div className="text-sm text-gray-700 mr-3"> requests </div>
              <input
                type="number"
                className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg mr-1 block w-12 appearance-none leading-normal"
                value={template.concurrency}
                placeholder="100"
                onChange={updateTemplateConcurrency}
              />
              <div className="text-sm text-gray-700">concurrently</div>
            </div>
          </div>
          <div className="flex-1 mx-4" style={{ minWidth: 200 }}>
            <div className="text-sm text-gray-700">Request</div>
            {template.type === RequestType.BASIC ? (
              <Row className="focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg overflow-hidden">
                <Dropdown
                  options={[
                    { label: "POST", value: HttpVerb.POST },
                    { label: "GET", value: HttpVerb.GET }
                  ]}
                  onChange={updateTemplateVerb}
                  value={template.verb}
                />
                <input
                  type="text"
                  className="bg-white px-4 block w-full appearance-none leading-normal p-2"
                  value={template.url}
                  placeholder="https://google.com"
                  onChange={updateTemplateUrl}
                />
              </Row>
            ) : (
              <div className="focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg overflow-hidden flex-1">
                <CodeMirror
                  value={wrapRequestTextInCallback(template.text)}
                  // editorDidMount={editorDidMount}
                  options={{
                    mode: "text/typescript"
                  }}
                  onBeforeChange={(editor, data, value) => {
                    updateTemplateText(
                      value.slice(
                        templateTextPrefix.length,
                        value.length - templateSuffix.length
                      )
                    );
                  }}
                />
              </div>
            )}
            {!!template.error && (
              <div className="text-red-500 text-sm">
                Error: {template.error}
              </div>
            )}
            <Row>
              <div
                className="text-sm text-blue-500 cursor-pointer"
                onClick={switchType}
              >
                {template.type === RequestType.BASIC
                  ? "Switch to advanced request"
                  : "Switch to basic request"}
              </div>
              {template.type === RequestType.ADVANCED && (
                <div
                  className="text-sm text-blue-500 cursor-pointer ml-3"
                  // onClick={resetTemplate}
                >
                  Reset
                </div>
              )}
            </Row>
          </div>
          <button
            className="bg-white hover:bg-blue-400 text-gray-700 font-bold py-2 px-4 border-b-4 border border-gray-500 hover:border-gray-500 rounded my-4 mr-2"
            onClick={removeTemplate}
          >
            Delete
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

      <div className="flex-1 overflow-y-scroll">
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
          <div className="p-4 flex-1">
            <ResponseDialogs templateId={template.id} />
            <ResponseTimeChart responses={responses} />
          </div>
        )}

        {tab === Tab.RESPONSES && (
          <div className=" w-full p-2">
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
                {responses.map((response: any, idx: number) => {
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
                          {JSON.stringify(response.headers)}
                        </div>
                        {JSON.stringify(response.headers).substring(0, 30)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!responses.length && (
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

function mstp(state: any) {
  return {
    template: getSelectedTemplate(state),
    responses: getSelectedTemplateResponses(state)
  };
}

export let MainView = connect(mstp)(_MainView);
