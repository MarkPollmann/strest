import React from "react";
import { Row, Card } from ".";

interface IProps {
  responses: any[];
}

function insertOrPlus1(obj: any, k: string) {
  if (obj[k]) {
    obj[k]++;
  } else {
    obj[k] = 1;
  }
}

export function ResponseDialogs(props: IProps) {
  let results = props.responses.reduce(
    (acc, r) => {
      acc.sum += r.time;
      acc.max = Math.max(acc.max, r.time);
      acc.min = Math.min(acc.min, r.time);

      insertOrPlus1(acc.codeCount, r.status);

      return acc;
    },
    {
      sum: 0,
      min: Number.MAX_SAFE_INTEGER,
      max: 0,
      codeCount: {}
    }
  );

  results.average = results.sum / props.responses.length;

  return (
    <Row horizontal="space-between">
      <Card>
        <div className="text-lg">Response times</div>
        <Row>
          <div>Average</div>
          <div>{results.average}ms</div>
        </Row>
        <Row>
          <div>min</div>
          <div>{results.min}ms</div>
        </Row>
        <Row>
          <div>max</div>
          <div>{results.max}ms</div>
        </Row>
      </Card>

      <Card>
        <div className="text-lg">Response Counts</div>
        {Object.entries(results.codeCount).map(([k, v]: any) => {
          return (
            <Row key={`code-count-${k}`}>
              <div className="flex-1">{k}</div>
              <div>{v}</div>
            </Row>
          );
        })}
      </Card>

      <Card>
        <div className="text-lg">Bandwidth</div>
        <Row>
          <div>Sent</div>
          <div>300kb</div>
        </Row>
        <Row>
          <div>Received</div>
          <div>400kb</div>
        </Row>
      </Card>
    </Row>
  );
}
