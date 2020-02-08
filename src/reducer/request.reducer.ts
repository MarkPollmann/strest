import produce from "immer";
import { ActionType } from "../action/ActionType.enum";
import uuid = require("uuid");

const requestInitialState = {
  responses: {
    "123": []
  },
  templates: [
    {
      id: "123",
      name: "login",
      url: "https://google.com",
      count: 1,
      order: 0,
      concurrency: 1
    }
  ],
  selectedTemplateId: "123"
};

function insertOrPlus1(obj: any, k: string) {
  if (obj[k]) {
    obj[k]++;
  } else {
    obj[k] = 1;
  }
}

// Selectors
export function getSelectedTemplate(state: any) {
  return state.request.templates.find(
    (template: any) => template.id === state.request.selectedTemplateId
  );
}

export function getSelectedTemplateResponses(state: any) {
  return state.request.responses[state.request.selectedTemplateId];
}

export function getTemplateProcessedData(state: any, templateId: string) {
  let responses = state.request.responses[templateId];
  let res = {
    sum: 0,
    min: Number.MAX_SAFE_INTEGER,
    max: 0,
    errorCount: 0,
    codeCount: {},
    average: 0,
    errorRate: 0
  };

  if (responses.length === 0) {
    return res;
  }

  res = responses.reduce((acc: any, r: any) => {
    acc.sum += r.time;
    acc.max = Math.max(acc.max, r.time);
    acc.min = Math.min(acc.min, r.time);

    if (r.status >= 300) {
      acc.errorCount++;
    }

    insertOrPlus1(acc.codeCount, r.status);

    return acc;
  }, res);

  res.average = Math.round(res.sum / responses.length);
  res.errorRate = res.errorCount / responses.length;

  return res;
}

export function requestReducer(
  state: any = requestInitialState,
  action: { type: ActionType; payload: any }
) {
  return produce(state, (draft: any) => {
    switch (action.type) {
      case ActionType.REQUEST_RETURNED: {
        draft.responses[action.payload.templateId].push(action.payload);
        break;
      }

      case ActionType.SELECT_TEMPLATE: {
        draft.selectedTemplateId = action.payload;
        break;
      }

      case ActionType.ADD_NEW_TEMPLATE: {
        let id = uuid();
        draft.templates.push({
          id,
          name: "",
          url: null,
          count: 1,
          concurrency: 1
        });

        draft.responses[id] = [];
        break;
      }

      case ActionType.UPDATE_TEMPLATE: {
        let index = draft.templates.findIndex(
          (t: any) => t.id === action.payload.id
        );

        if (index >= 0) {
          let template = {
            ...draft.templates[index],
            ...action.payload.fields
          };

          draft.templates[index] = template;
        }
        break;
      }

      case ActionType.DELETE_TEMPLATE: {
        let index = draft.templates.findIndex(
          (t: any) => t.id === action.payload
        );
        draft.templates.splice(index, 1);
        delete draft.responses[action.payload];
        break;
      }

      case ActionType.START_THE_TRAIN: {
        let responses: any = {};
        Object.keys(draft.responses).forEach(k => (responses[k] = []));
        draft.responses = responses;
        break;
      }

      default:
        break;
    }
  });
}
