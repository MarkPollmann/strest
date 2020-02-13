import React from "react";
import { Row, Card } from ".";

import { getTemplateProcessedData } from "../reducer/request.reducer";
import { connect } from "react-redux";

interface IProps {
  templateId: string;
  processedData: any;
}

function _ResponseDialogs(props: IProps) {
  let { processedData } = props;

  return (
    <Row horizontal="space-around">
      <Card>
        <div>Response Times</div>
        <Row horizontal="space-between">
          <div className="text-sm">Average</div>
          <div>
            <span className="font-bold">{processedData.average}</span>ms
          </div>
        </Row>
        <Row horizontal="space-between">
          <div className="text-sm">Min value</div>
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
          <div className="text-sm">Max value</div>
          <div>
            <span className="font-bold">{processedData.max}</span>ms
          </div>
        </Row>
      </Card>

      <Card>
        <div>Response Counts</div>
        {Object.entries(processedData.codeCount).map(([k, v]: any) => {
          return (
            <Row key={`code-count-${k}`}>
              <div className="flex-1 text-sm">{k}</div>
              <div className="font-bold">{v}</div>
            </Row>
          );
        })}
      </Card>

      <Card>
        <div>Bandwidth</div>
        {/* <Row horizontal="space-between">
          <div>Sent</div>
          <div>
            <span className="font-bold">{processedData.max}</span>kb
          </div>
        </Row> */}
        <Row horizontal="space-between">
          <div className="text-sm">Received (bytes)</div>
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

function mstp(state: any, ownProps: any) {
  return {
    processedData: getTemplateProcessedData(state, ownProps.templateId)
  };
}

export let ResponseDialogs = connect(mstp)(_ResponseDialogs);
