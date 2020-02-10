import React, { useContext } from "react";
import { Row, Card } from ".";
import { Store } from "../Store";
import { getTemplateProcessedData } from "../reducer/request.reducer";

interface IProps {
  templateId: string;
}

export function ResponseDialogs(props: IProps) {
  let { state } = useContext(Store);
  let processedData = getTemplateProcessedData(state, props.templateId);

  return (
    <Row horizontal="space-around">
      <Card>
        <div className="text-lg">Response Times</div>
        <Row horizontal="space-between">
          <div>Average</div>
          <div>
            <span className="font-bold">{processedData.average}</span>ms
          </div>
        </Row>
        <Row horizontal="space-between">
          <div>Min value</div>
          <div>
            <span className="font-bold">
              {processedData.min === Number.MAX_SAFE_INTEGER
                ? 0
                : processedData.min}
            </span>
            ms
          </div>
        </Row>
        <Row horizontal="space-between">
          <div>Max value</div>
          <div>
            <span className="font-bold">{processedData.max}</span>ms
          </div>
        </Row>
      </Card>

      <Card>
        <div className="text-lg">Response Counts</div>
        {Object.entries(processedData.codeCount).map(([k, v]: any) => {
          return (
            <Row key={`code-count-${k}`}>
              <div className="flex-1">{k}</div>
              <div className="font-bold">{v}</div>
            </Row>
          );
        })}
      </Card>

      <Card>
        <div className="text-lg">Bandwidth</div>
        {/* <Row horizontal="space-between">
          <div>Sent</div>
          <div>
            <span className="font-bold">{processedData.max}</span>kb
          </div>
        </Row> */}
        <Row horizontal="space-between">
          <div>ReceivedBytes</div>
          <div>
            <span className="font-bold">
              {processedData.receivedBytes || 0}
            </span>
            kb
          </div>
        </Row>
      </Card>
    </Row>
  );
}
