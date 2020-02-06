import { Dispatch } from "react";
import { ActionType } from "./ActionType.enum";
import Queue, { ProcessFunctionCb } from "better-queue";
import MemoryStore from "better-queue-memory";

function consumeTemplate(dispatch: Dispatch<any>, template: any) {
  async function boundedSend({ template }: any, cb: ProcessFunctionCb<null>) {
    await sendRequest(dispatch, template.url, template.id);
    cb(null, null);
  }

  return new Promise(resolve => {
    let queue = new Queue(boundedSend, {
      maxRetries: 0,
      concurrent: template.concurrency,
      store: new MemoryStore()
    });

    for (let i = 0; i < template.count; i++) {
      // concanate request number plus template id to avoid merging
      // tasks from different tasks
      queue.push({ id: `${i}-${template.id}`, template });
    }

    queue.on("drain", () => {
      resolve();
    });
  });
}

export async function startTheTrain(dispatch: Dispatch<any>, templates: any[]) {
  dispatch({ type: ActionType.START_THE_TRAIN });
  templates.forEach(template => consumeTemplate(dispatch, template));
}

export async function sendRequest(
  dispatch: Dispatch<any>,
  url: string,
  templateId: string
) {
  dispatch({ type: ActionType.SEND_REQUEST, payload: { url } });

  try {
    let initialTime = Date.now();
    let res = await fetch(url);

    let finalTime = Date.now();

    let body = await res.text();

    dispatch({
      type: ActionType.REQUEST_RETURNED,
      payload: {
        status: res.status,
        url: res.url,
        templateId,
        body,
        headers: JSON.stringify(res.headers),
        time: finalTime - initialTime,
        startedAt: initialTime,
        endedAt: finalTime
      }
    });
  } catch (e) {
    console.log("request failed", e);
    dispatch({ type: ActionType.REQUEST_FAILED, payload: e });
  }
}

export async function selectTemplate(dispatch: Dispatch<any>, id: string) {
  dispatch({ type: ActionType.SELECT_TEMPLATE, payload: id });
}

export async function addNewTemplate(dispatch: Dispatch<any>) {
  dispatch({ type: ActionType.ADD_NEW_TEMPLATE });
}

export function updateTemplate(
  dispatch: Dispatch<any>,
  templateId: string,
  fields: any
) {
  dispatch({
    type: ActionType.UPDATE_TEMPLATE,
    payload: {
      id: templateId,
      fields
    }
  });
}
