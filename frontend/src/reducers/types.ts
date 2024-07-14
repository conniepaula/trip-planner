import { Dispatch as ReactDispatch } from "react";

export type Action<ActionType> = {
  type: ActionType;
  payload?: any;
};
export type Dispatch<ActionType> = ReactDispatch<Action<ActionType>>;

export type Reducer<ActionType> = (
  state: any,
  action: Action<ActionType>,
) => any;
