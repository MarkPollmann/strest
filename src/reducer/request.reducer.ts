import produce from "immer";
import { ActionType } from "../action/ActionType.enum";
import uuid = require("uuid");
import { AnyAction } from "redux";

export enum RequestType {
  BASIC = "BASIC",
  ADVANCED = "ADVANCED"
}

export enum HttpVerb {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
  PATCH = "PATCH"
}

export const requestInitialState = {
  responses: {
  },
  templates: [
  ],
  selectedTemplateId: "123",
  currentTemplateConsumed: null
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
  let t = state.request.templates.find(
    (template: any) => template.id === state.request.selectedTemplateId
  );

  return t;
}

export function getSelectedTemplateResponses(state: any) {
  return state.request.responses[state.request.selectedTemplateId];
}

export function getCurrentTemplateConsumed(state: any) {
  return state.request.currentTemplateConsumed;
}

export function getTemplates(state: any) {
  return state.request.templates;
}

// Reducer
export function getTemplateProcessedData(state: any, templateId: string) {
  let responses = state.request.responses[templateId];
  let res = {
    sum: 0,
    min: Number.MAX_SAFE_INTEGER,
    max: 0,
    errorCount: 0,
    codeCount: {},
    average: 0,
    errorRate: 0,
    receivedBytes: 0
  };

  if (responses.length === 0) {
    return res;
  }

  res = responses.reduce((acc: any, r: any) => {
    acc.sum += r.time;
    acc.max = Math.max(acc.max, r.time);
    acc.min = Math.min(acc.min, r.time);
    acc.receivedBytes += r.byteSizeReceived;

    if (r.status >= 300) {
      acc.errorCount++;
    }

    insertOrPlus1(acc.codeCount, r.status);

    return acc;
  }, res);

  res.average = Math.round(res.sum / responses.length);
  res.errorRate = res.errorCount / responses.length * 100;

  return res;
}

export function requestReducer(
  state: any = requestInitialState,
  action: AnyAction
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
          url: "",
          count: 1,
          concurrency: 1,
          type: RequestType.BASIC,
          verb: HttpVerb.GET,
          order: Object.keys(draft.templates).length
        });

        draft.selectedTemplateId = id;

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

      case ActionType.CONSUMING_TEMPLATE_START:
        draft.currentTemplateConsumed = action.payload;
        draft.templates.find((t: any) => t.id === action.payload).error = null;

        break;

      case ActionType.CONSUMING_TEMPLATE_END:
        draft.currentTemplateConsumed = null;
        break;

      case ActionType.TEMPLATE_ERROR: {
        let template = draft.templates.find(
          (t: any) => t.id === action.payload.templateId
        );

        template.error = action.payload.errorMsg;
        break;
      }

      case ActionType.CHANGE_TEMPLATE_ORDER: {

        let t = draft.templates.find((t: any) => t.id === action.payload.templateId);
        let i = t.order;
        let j = action.payload.order;

        if (i > j) {
          while (j <= i) {
            draft.templates[j].order++;
            j++;
          }
        } else {
          while (i <= j) {
            draft.templates[i].order--;
            i++;
          }
        }

        t.order = action.payload.order;

        draft.templates.sort((t1: any, t2: any) => t1.order - t2.order);

        break;
      }

      default:
        break;
    }
  });
}
