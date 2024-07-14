import { Action } from "../types";

export enum TripCreationActionTypes {
  SET_IS_GUEST_INPUT_OPEN = "SET_IS_GUEST_INPUT_OPEN",
  SET_IS_INVITE_GUEST_MODAL_OPEN = "SET_IS_INVITE_GUEST_MODAL_OPEN",
  SET_IS_CONFIRM_MODAL_OPEN = "SET_IS_CONFIRM_MODAL_OPEN",
  SET_IS_DATE_PICKER_OPEN = "SET_IS_DATE_PICKER_OPEN",
  SET_CURRENT_PARTICIPANT = "SET_CURRENT_PARTICIPANT",
  SET_FORM_STEP = "SET_FORM_STEP",
}

export type TripCreationAction = Action<TripCreationActionTypes>;

export function setIsGuestInputOpenAction(isGuestInputOpen: boolean) {
  return {
    type: TripCreationActionTypes.SET_IS_GUEST_INPUT_OPEN,
    payload: isGuestInputOpen,
  };
}

export function setIsInviteGuestModalOpenAction(
  isInviteGuestModalOpen: boolean,
) {
  return {
    type: TripCreationActionTypes.SET_IS_INVITE_GUEST_MODAL_OPEN,
    payload: isInviteGuestModalOpen,
  };
}

export function setIsConfirmModalOpenAction(isConfirmModalOpen: boolean) {
  return {
    type: TripCreationActionTypes.SET_IS_CONFIRM_MODAL_OPEN,
    payload: isConfirmModalOpen,
  };
}
export function setIsDatePickerOpenAction(isDatePickerOpen: boolean) {
  return {
    type: TripCreationActionTypes.SET_IS_DATE_PICKER_OPEN,
    payload: isDatePickerOpen,
  };
}
export function setFormStepAction(
  currentFormStep: number,
  previousFormStep: number,
) {
  return {
    type: TripCreationActionTypes.SET_FORM_STEP,
    payload: { currentFormStep, previousFormStep },
  };
}
export function setCurrentParticipantAction(currentParticipant: {
  name: string;
  email: string;
}) {
  return {
    type: TripCreationActionTypes.SET_CURRENT_PARTICIPANT,
    payload: currentParticipant,
  };
}
