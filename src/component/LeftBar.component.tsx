import React, { useContext } from "react";
import { Store } from "../Store";
import { Row } from ".";
import {
  selectTemplate,
  addNewTemplate,
  updateTemplate,
  startTheTrain
} from "../action/request.action";

export function LeftBar() {
  let { state, dispatch } = useContext(Store);
  let selectedTemplateId = state.request.selectedTemplateId;

  function updateTemplateCount(event: React.ChangeEvent<HTMLInputElement>) {
    updateTemplate(dispatch, selectedTemplateId, {
      count: Number.parseInt(event.target.value)
    });
  }

  function updateTemplateConcurrency(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    updateTemplate(dispatch, selectedTemplateId, {
      concurrency: Number.parseInt(event.target.value)
    });
  }

  function startRequestSequence() {
    startTheTrain(dispatch, state.request.templates);
  }

  return (
    <div className="w-1/4 border-r h-screen flex-shrink-0">
      <div className="uppercase tracking-wide text-sm text-blue-600 font-bold p-2 border-b">
        Request Sequence
      </div>
      {state.request.templates.map((template: any) => {
        return (
          <div
            key={template.id}
            className={`border-b cursor-pointer ${
              template.id === selectedTemplateId ? "bg-blue-100" : "bg-white"
            }`}
            onClick={() => selectTemplate(dispatch, template.id)}
          >
            <div className="pt-2 px-2 flex-1">
              {!!template.name && (
                <div className="text-lg text-blue-500">{template.name}</div>
              )}
              {!template.name && (
                <div className="text-lg text-gray-500">No name</div>
              )}
            </div>

            <div className="p-2">
              <div className="text-sm text-gray-800">{template.url}</div>
              {!template.url && (
                <div className="text-sm text-gray-500">No url</div>
              )}

              <div>
                <div className="py-1">
                  <div className="flex flex-row items-center">
                    <div className="text-sm text-gray-700 pr-1">Send </div>
                    <input
                      type="number"
                      className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg px-2 block w-full appearance-none leading-normal"
                      value={template.count}
                      placeholder="100"
                      onChange={updateTemplateCount}
                    />
                    <div className="text-sm text-gray-700 pr-1"> requests </div>
                    <input
                      type="number"
                      className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg px-2 block w-full appearance-none leading-normal"
                      value={template.concurrency}
                      placeholder="100"
                      onChange={updateTemplateConcurrency}
                    />
                    <div className="text-sm text-gray-700 px-2">
                      concurrently
                    </div>
                  </div>

                  <Row vertical="center">
                    <Row vertical="center" className="flex-1">
                      <div className="text-3xl text-bold">200</div>
                      <div className="text-gray-800">ms avg. res. time</div>
                    </Row>

                    <Row className="flex-1" vertical="center">
                      <div className="text-3xl text-bold">10%</div>
                      <div className="text-sm text-gray-800">error rate</div>
                    </Row>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <Row horizontal="space-around">
        <button
          className="bg-white hover:bg-blue-400 text-gray-700 font-bold py-2 px-4 border-b-4 border border-gray-500 hover:border-gray-500 rounded my-4"
          onClick={() => addNewTemplate(dispatch)}
        >
          ➕ Add request
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded my-4"
          onClick={startRequestSequence}
        >
          🚄 Send All
        </button>
      </Row>
    </div>
  );
}
