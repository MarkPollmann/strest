import React from "react";
import { connect } from "react-redux";
import { Row, Dropdown } from ".";
import { addNewTemplate, selectTemplate, startTheTrain, updateTemplate, changeTemplateOrder, saveWorkflow, loadWorkflow, newWorkflow, clearWorkflow } from "../action/request.action";
import { getCurrentTemplateConsumed, getSelectedTemplate, getTemplateProcessedData, getTemplates, HttpVerb } from "../reducer/request.reducer";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
// @ts-ignore
import { Spinner } from 'react-activity';


enum WorkflowAction {
  RUN,
  SAVE,
  LOAD,
  NEW,
  CLEAR
}

interface IProps {
  selectedTemplate: any;
  currentTemplateConsumed: any;
  templates: any;
  state: any;
}

function _LeftBar(props: IProps) {
  function updateTemplateCount(event: React.ChangeEvent<HTMLInputElement>) {
    updateTemplate(props.selectedTemplate.id, {
      count: Number.parseInt(event.target.value)
    });
  }

  function updateTemplateConcurrency(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    updateTemplate(props.selectedTemplate.id, {
      concurrency: Number.parseInt(event.target.value)
    });
  }

  function startRequestSequence() {
    startTheTrain();
  }

  function dragEnd(result: DropResult) {
    // Draggable id contains the template id
    changeTemplateOrder(result.draggableId, result.destination?.index || 0);
  }

  function runAction(action: WorkflowAction) {
    switch (action) {
      case WorkflowAction.RUN:
        startTheTrain();
        break;

      case WorkflowAction.SAVE:
        saveWorkflow();
        break;

      case WorkflowAction.LOAD:
        loadWorkflow();
        break;

      case WorkflowAction.NEW:
        newWorkflow();
        break;

      case WorkflowAction.CLEAR:
        clearWorkflow();
        break;

      default:
        break;
    }
  }

  return (
    <div className="w-1/5 border-r h-screen max-h-screen flex-shrink-0 bg-gray-200 flex flex-col">
      <Row horizontal="space-around" className="my-2">
        <div className="uppercase tracking-wide text-sm text-blue-600 font-bold p-2 ">
          Workflow
        </div>
        <Dropdown
          options={[
            { label: "Run", value: WorkflowAction.RUN },
            { label: "New", value: WorkflowAction.NEW },
            { label: "Save", value: WorkflowAction.SAVE },
            { label: "Load", value: WorkflowAction.LOAD },
            // { label: "Clear", value: WorkflowAction.CLEAR },

          ]}
          onChange={runAction}
          mainCallback={startTheTrain}
          value={WorkflowAction.RUN}
          tooltip="Cmd + R"
        />
      </Row>
      <div className="flex-1 overflow-y-auto disable-scrollbars">
        <DragDropContext onDragEnd={dragEnd}>
          <Droppable droppableId="request-list">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="max-h-full"
              >
                {props.templates.map((template: any, idx: number) => {
                  let processedData = getTemplateProcessedData(props.state, template.id);

                  return (
                    <Draggable
                      draggableId={`${template.id}`}
                      index={template.order}
                      key={template.id}
                    >
                      {(provided, snapshot) => (

                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`cursor-pointer bg-white ${
                            template.id === props.selectedTemplate?.id
                              ? "bg-blue-200"
                              : "bg-white"
                            } rounded overflow-hidden shadow-lg m-2 mb-3 p-1`}
                          onClick={() => selectTemplate(template.id)}
                        >
                          <Row className="pt-1 px-1 flex-1" vertical="center">

                            <div className="text-blue-500 flex-1">
                              <span className="font-lg font-bold text-gray-700">{idx + 1}</span> {template.name} <span className="text-xs text-gray-500">({template.url.substring(0, 25) || "No url"})</span>
                            </div>

                            {props.currentTemplateConsumed === template.id && (
                              <Spinner color={"#28d76e"} />
                            )}
                          </Row>

                          <div className="p-2">

                            <div>
                              <div className="py-1">
                                <Row horizontal="space-around">
                                  <div>
                                    <div className="text-xs text-gray-700 mr-3">Requests</div>
                                    <input
                                      type="number"
                                      className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg px-2 block w-20 mr-1 appearance-none leading-normal"
                                      value={template.count}
                                      placeholder="100"
                                      onChange={updateTemplateCount}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-xs text-gray-700">Concurrency</div>
                                    <input
                                      type="number"
                                      className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg px-2 block w-12 mr-1 appearance-none leading-normal"
                                      value={template.concurrency}
                                      placeholder="100"
                                      onChange={updateTemplateConcurrency}
                                    />
                                  </div>
                                </Row>

                                <Row
                                  vertical="center"
                                  horizontal="space-around"
                                  className="p-2"
                                >

                                  <div className="flex flex-col items-center">

                                    <div className="text-2xl font-bold mr-1">
                                      {processedData.average}
                                    </div>
                                    <div className="text-gray-700 text-sm">
                                      ms avg.
                              </div>
                                  </div>


                                  <div className="flex flex-col items-center">
                                    <div className="text-2xl font-bold mr-1">
                                      {processedData.errorRate}%
                              </div>
                                    <div className="text-sm text-gray-700 text-sm">
                                      errors
                              </div>
                                  </div>
                                </Row>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </Draggable>
                  );
                })
                }
              </div>
            )}


          </Droppable>
        </DragDropContext>

      </div>
      <div className="p-2">
        <button
          className="bg-white hover:bg-gray-400 text-gray-700 font-bold border-b-4 border border-gray-500 hover:border-gray-500 rounded p-2 w-full tooltip"
          onClick={addNewTemplate}
        >
          <div className="tooltip-text border bg-white rounded p-3 -mt-6 -mr-6 rounded text-gray-500 text-xs">
            Cmd + N
                  </div>
          New Request
                </button>
      </div>
    </div>
  );
}

function mstp(state: any) {
  let selectedTemplate = getSelectedTemplate(state);
  return {
    selectedTemplate,
    currentTemplateConsumed: getCurrentTemplateConsumed(state),
    templates: getTemplates(state),
    state
  };
}

export const LeftBar = connect(mstp)(_LeftBar);
