import create from "zustand";

import { TestAnswerOption } from "../lib/personality-test";

interface UserTestAnswersState {
  userTestAnswers: TestAnswerOption["type"][];
  setUserTestAnswers: (newUserTestAnswers: TestAnswerOption["type"][]) => void;
}

const useUserTestAnswersStore = create<UserTestAnswersState>((set) => ({
  userTestAnswers: [],
  setUserTestAnswers: (newUserTestAnswers) =>
    set(() => ({
      userTestAnswers: newUserTestAnswers,
    })),
}));

export default useUserTestAnswersStore;
