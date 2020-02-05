import produce from "immer";
import { ActionType } from "../action/ActionType.enum";
import uuid = require("uuid");

const requestInitialState = {
  responses: [],
  templates: [
    { id: "123", name: "login", url: "https://api.foo.com/v1/login", count: 1 }
  ],
  selectedTemplateId: "123"
};

// Selectors
export function getSelectedTemplate(state: any) {
  console.warn("get selected Template", state);

  return state.request.templates.find(
    (template: any) => template.id === state.request.selectedTemplateId
  );
}

export function requestReducer(
  state: any = requestInitialState,
  action: { type: ActionType; payload: any }
) {
  return produce(state, (draft: any) => {
    switch (action.type) {
      case ActionType.REQUEST_RETURNED: {
        draft.responses.push(action.payload);
        break;
      }

      case ActionType.SELECT_TEMPLATE: {
        draft.selectedTemplateId = action.payload;
        break;
      }

      case ActionType.ADD_NEW_TEMPLATE: {
        draft.templates.push({
          id: uuid(),
          name: "",
          url: null
        });
        break;
      }

      default:
        break;
    }
  });
}
