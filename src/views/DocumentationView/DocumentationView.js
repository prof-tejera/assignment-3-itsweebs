import React from "react";
import styled from "styled-components";

import DocumentComponent from "../../components/documentation/DocumentComponent";

import Panel from "../../components/generic/Panel/Panel";
import Button from "../../components/generic/Button/Button";
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import DisplayTime from "../../components/generic/DisplayTime/DisplayTime";
import DisplayText from "../../components/generic/DisplayText/DisplayText";
import Input from "../../components/generic/Input/Input";



const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

/**
 * You can document your components by using the DocumentComponent component
 */
const Documentation = () => {
  return (
    <Container>
      <div>
        <h2>Documentation</h2>
        <DocumentComponent
          title="Panel"
          component={<Panel className="control-panel">Sample Content</Panel>}
          propDocs={[
            {
              prop: "children",
              description: "Contents contained inside the panel",
              type: "node",
              defaultValue: "n/a",
            },
            {
              prop: "className",
              description: "Assigns a class name for additional styling purposes",
              type: "string",
              defaultValue: "none",
            },
          ]}
        />
        <DocumentComponent
          title="Button"
          component={<Button label="Sample Button" icon={faPlay} onClick={() => console.log('Button clicked!')} />}
          propDocs={[
            {
              prop: "label",
              description: "Label for the button if no icon is provided",
              type: "string",
              defaultValue: "none",
            },
            {
              prop: "icon",
              description: "Icon to be displayed on the button",
              type: "object",
              defaultValue: "none",
            },
            {
              prop: "className",
              description: "Assigns a class name for additional styling purposes",
              type: "string",
              defaultValue: "none",
            },
          ]}
        />
        <DocumentComponent
          title="Display Time"
          component={<DisplayTime>01:30</DisplayTime>}
          propDocs={[
            {
              prop: "children",
              description: "Contents contained inside Display Time",
              type: "node",
              defaultValue: "n/a",
            },
          ]}
        />
        <DocumentComponent
          title="Display Text"
          component={<DisplayText text="Round 1 of 2" />}
          propDocs={[
            {
              prop: "text",
              description: "Displays the tracked rounds, when Tabata is in rest mode or when timer has ended ",
              type: "string",
              defaultValue: "none",
            },
          ]}
        />
        <DocumentComponent
          title="Input"
          component={<Input label="Sample Label" />}
          propDocs={[
            {
              prop: "label",
              description: "Label text for the input field",
              type: "string",
              defaultValue: "n/a",
            },
            {
              prop: "pattern",
              description: "Pattern to validate the input",
              type: "string",
              defaultValue: "MM:SS",
            },
            {
              prop: "maxLength",
              description: "Maximum allowed length for the input",
              type: "number",
              defaultValue: "5",
            },
          ]}
        />
      </div>
    </Container>


  );
};

export default Documentation;
