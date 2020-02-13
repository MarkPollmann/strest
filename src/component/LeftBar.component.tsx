import React from "react";
import { connect } from "react-redux";
import { Row } from ".";
import { addNewTemplate, selectTemplate, startTheTrain, updateTemplate, changeTemplateOrder } from "../action/request.action";
import { getCurrentTemplateConsumed, getSelectedTemplate, getTemplateProcessedData, getTemplates } from "../reducer/request.reducer";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

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

  return (
    <div className="w-1/4 border-r h-screen flex-shrink-0 bg-gray-200">
      <div className="uppercase tracking-wide text-sm text-blue-600 font-bold p-2 ">
        Request Workflow
      </div>
      <DragDropContext onDragEnd={dragEnd}>
        <Droppable droppableId="request-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {

                props.templates.map((template: any) => {
                  console.warn('ROPO TEMPLATE', template)
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
                              ? "border-r-2 border-l-2 border-blue-700"
                              : "border-r-2 border-l-2 border-white"
                            } rounded overflow-hidden shadow-lg m-2 mb-4`}
                          onClick={() => selectTemplate(template.id)}
                        >
                          <Row className="pt-1 px-1 flex-1" vertical="center">

                            <div className="text-lg text-blue-500 flex-1">
                              {template.name} <span className="text-xs text-gray-500">({template.url.substring(0, 25) || "No url"})</span>
                            </div>

                            {props.currentTemplateConsumed === template.id && (
                              <div className="text-sm text-gray-500">Executing...</div>
                            )}
                          </Row>

                          <div className="p-2">

                            <div>
                              <div className="py-1">
                                <Row horizontal="space-around">
                                  <div>
                                    <div className="text-sm text-gray-700 mr-3"> Requests </div>
                                    <input
                                      type="number"
                                      className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg px-2 block w-20 mr-1 appearance-none leading-normal"
                                      value={template.count}
                                      placeholder="100"
                                      onChange={updateTemplateCount}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm text-gray-700">Concurrency</div>
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
                                  <Row vertical="center">
                                    <div className="text-2xl font-bold mr-1">
                                      {processedData.average}
                                    </div>
                                    <div className="text-gray-700 text-sm">
                                      ms avg.
                            </div>
                                  </Row>

                                  <Row vertical="center">
                                    <div className="text-2xl font-bold mr-1">
                                      {processedData.errorRate}%
                            </div>
                                    <div className="text-sm text-gray-700 text-sm">
                                      error rate
                            </div>
                                  </Row>
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

      <Row horizontal="space-around">
        <button
          className="bg-white hover:bg-blue-400 text-gray-700 font-bold py-2 px-4 border-b-4 border border-gray-500 hover:border-gray-500 rounded my-4"
          onClick={() => addNewTemplate()}
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
