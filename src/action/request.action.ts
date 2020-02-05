import { Dispatch } from "react";
import { ActionType } from "./ActionType.enum";

export async function sendRequest(dispatch: Dispatch<any>, url: string) {
  dispatch({ type: ActionType.SEND_REQUEST, payload: { url } });

  try {
    const res = await fetch(`https://${url}`);

    dispatch({
      type: ActionType.REQUEST_RETURNED,
      payload: { status: res.status, url: res.url }
    });
  } catch (e) {
    console.log("request failed", e);
    dispatch({ type: ActionType.REQUEST_FAILED, payload: e });
  }
}
