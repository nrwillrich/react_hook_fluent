import { initializeIcons, Pivot, PivotItem } from "office-ui-fabric-react";
import React from "react";
import { ReactHookFormValidation } from "./components/ReactHookFormValidation";
import { ReactHookFormYupValidation } from "./components/ReactHookFormYupValidation";
import "./styles.css";

initializeIcons();

export default function App() {
  return (
    <Pivot>
      <PivotItem headerText="react-hook-form rules">
        <ReactHookFormValidation />
      </PivotItem>
      <PivotItem headerText="react-hook-form with Yup validation">
        <ReactHookFormYupValidation />
      </PivotItem>
    </Pivot>
  );
}
