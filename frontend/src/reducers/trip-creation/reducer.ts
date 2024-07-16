import { TripCreationAction, TripCreationActionTypes } from "./actions";

export interface TripCreationState {
  isGuestInputOpen: boolean;
  isInviteGuestModalOpen: boolean;
  isConfirmModalOpen: boolean;
  isDatePickerOpen: boolean;
  currentFormStep: number;
  previousFormStep: number;
  currentParticipant: { name: string; email: string };
}
export const INITIAL_STATE: TripCreationState = {
  isGuestInputOpen: false,
  isInviteGuestModalOpen: false,
  isConfirmModalOpen: false,
  isDatePickerOpen: false,
  currentFormStep: 0,
  previousFormStep: 0,
  currentParticipant: {
    name: "",
    email: "",
  },
};

export function tripCreationReducer(
  state: TripCreationState,
  action: TripCreationAction,
) {
  switch (action.type) {
    case TripCreationActionTypes.SET_IS_GUEST_INPUT_OPEN:
      return { ...state, isGuestInputOpen: action.payload };
    case TripCreationActionTypes.SET_IS_INVITE_GUEST_MODAL_OPEN:
      return { ...state, isInviteGuestModalOpen: action.payload };
    case TripCreationActionTypes.SET_IS_CONFIRM_MODAL_OPEN:
      return { ...state, isConfirmModalOpen: action.payload };
    case TripCreationActionTypes.SET_IS_DATE_PICKER_OPEN:
      return { ...state, isDatePickerOpen: action.payload };
    case TripCreationActionTypes.SET_CURRENT_PARTICIPANT:
      return { ...state, currentParticipant: action.payload };
    case TripCreationActionTypes.SET_FORM_STEP:
      return {
        ...state,
        ...action.payload,
      };

    default:
      throw new Error();
  }
}
