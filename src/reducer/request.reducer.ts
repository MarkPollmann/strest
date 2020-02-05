import produce from "immer";
import { ActionType } from "../action/ActionType.enum";

const requestInitialState = {
  responses: []
};

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

      default:
        break;
    }
  });
}
