import { ActionType } from "./ActionType.enum";
import Queue, { ProcessFunctionCb } from "better-queue";
import MemoryStore from "better-queue-memory";
import { RequestType } from "../reducer/request.reducer";
import { dispatch, store } from "../Store";
// it might be used by the user inputed text for generating the request
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import chance from "chance";
let dialog = require('electron').remote.dialog;
import fs from 'fs';

function getRandomElement(xs: any[]) {
  let i = Math.floor(Math.random() * xs.length);
  return xs[i];
}

function consumeTemplate(template: any, previousResponses: any[][]) {
  dispatch({ type: ActionType.CONSUMING_TEMPLATE_START, payload: template.id });
  async function boundedSend({ template }: any, cb: ProcessFunctionCb<null>) {
    await sendRequest(template, previousResponses);
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
      dispatch({
        type: ActionType.CONSUMING_TEMPLATE_END,
        payload: template.id
      });
      resolve();
    });
  });
}

export async function startTheTrain() {
  let state = store.getState();
  let templates = state.request.templates;
  let responses = state.request.responses;
  dispatch({ type: ActionType.START_THE_TRAIN });

  for (let i = 0; i < templates.length; i++) {
    let template = templates[i];

    // build previous responses to be passed to the template
    let previousResponses = [];
    for (let j = 0; j < i; j++) {
      previousResponses.push(responses[templates[j].id]);
    }

    await consumeTemplate(template, previousResponses);
  }
}

function getAdvancedRequest(template: any) {
  return eval(`(responseChain) => {\n${template.text}\n}`);
}

function roughSizeOfObject(object: any) {
  let objectList = [];
  let stack = [object];
  let bytes = 0;

  while (stack.length) {
    let value = stack.pop();

    if (typeof value === "boolean") {
      bytes += 4;
    } else if (typeof value === "string") {
      bytes += value.length * 2;
    } else if (typeof value === "number") {
      bytes += 8;
    } else if (typeof value === "object" && objectList.indexOf(value) === -1) {
      objectList.push(value);

      for (let i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
}

export async function sendRequest(template: any, previousResponses: any[][]) {
  dispatch({ type: ActionType.SEND_REQUEST, payload: { url: template.url } });

  try {
    let initialTime = Date.now();
    let res;
    if (template.type === RequestType.ADVANCED) {
      let callback = getAdvancedRequest(template);

      let previousResponsesChain = previousResponses.map(responses => {
        let elem = { ...getRandomElement(responses) };
        if (elem && elem.headers) {
          try {

            elem.headers = JSON.parse(elem.headers);
          } catch (e) {
            console.log('Could not parse headers');
          }
        }
        return elem;
      });

      let callbackRes = callback(previousResponsesChain);
      // check if returned value is a promise
      if (typeof callbackRes.then !== "function") {
        throw new Error("NO_PROMISE");
      }
      res = await callbackRes;
    } else {
      res = await fetch(template.url);
    }

    let finalTime = Date.now();

    let body = await res.text();

    let byteSizeReceived =
      roughSizeOfObject(res.headers) + roughSizeOfObject(body);

    dispatch({
      type: ActionType.REQUEST_RETURNED,
      payload: {
        status: res.status,
        url: res.url,
        templateId: template.id,
        body,
        headers: res.headers,
        time: finalTime - initialTime,
        startedAt: initialTime,
        endedAt: finalTime,
        byteSizeReceived
      }
    });
  } catch (e) {
    console.warn("ROPO ERROR", e);
    switch (e.message) {
      case "NO_PROMISE":
        dispatch({
          type: ActionType.TEMPLATE_ERROR,
          payload: {
            templateId: template.id,
            errorMsg: "You need to return a promise"
          }
        });
        break;

      default:
        dispatch({
          type: ActionType.TEMPLATE_ERROR,
          payload: {
            templateId: template.id,
            errorMsg: e.toString()
          }
        });
        break;
    }

    dispatch({ type: ActionType.REQUEST_FAILED, payload: e });
  }
}

export async function selectTemplate(id: string) {
  dispatch({ type: ActionType.SELECT_TEMPLATE, payload: id });
}

export async function addNewTemplate() {
  dispatch({ type: ActionType.ADD_NEW_TEMPLATE });
}

export function updateTemplate(templateId: string, fields: any) {
  dispatch({
    type: ActionType.UPDATE_TEMPLATE,
    payload: {
      id: templateId,
      fields
    }
  });
}

export function deleteTemplate(templateId: string) {
  dispatch({ type: ActionType.DELETE_TEMPLATE, payload: templateId });
}

export function changeTemplateOrder(templateId: string, order: number) {
  dispatch({ type: ActionType.CHANGE_TEMPLATE_ORDER, payload: { templateId, order } });
}

export function saveWorkflow() {
  let path = dialog.showSaveDialogSync({
    defaultPath: 'myStrestWorkflow.json'
  })

  if (path) {
    dispatch({ type: ActionType.SAVE_WORKFLOW })
    try {

      const state = store.getState();
      fs.writeFileSync(path, JSON.stringify(state));
    } catch (e) {
      // @TODO: Add proper user warning
      console.warn('Workflow could not be saved')
    }
  }
}

export function loadWorkflow() {
  let path = dialog.showOpenDialogSync({});

  if (path) {
    let state = JSON.parse(fs.readFileSync(path[0], 'utf-8'));

    dispatch({ type: ActionType.LOAD_WORKFLOW, payload: state });
  }
}

export function clearWorkflow() {

}

export function newWorkflow() {
  dispatch({ type: ActionType.NEW_WORKFLOW })
}