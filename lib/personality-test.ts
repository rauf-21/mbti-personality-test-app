import { openDB } from "idb";
import { Option, Future, Result } from "@swan-io/boxed";
import { personalityTest } from "../data/personality-test";
import { personalityClassGroup } from "../data/personality-class-groups";

export interface TestQuestion {
  no: number;
  question: string;
  answerOptions: TestAnswerOption[];
}

export interface TestAnswerOption {
  type: "A" | "B";
  answer: string;
  score: PersonalityClass["type"];
}

export interface PersonalityClass {
  type:
    | Extroverted
    | Introverted
    | Sensing
    | Intuitive
    | Thinking
    | Feeling
    | Perceiving
    | Judging;
  description: string;
}

export interface PersonalityClassGroup {
  type: `${Extroverted | Introverted}${Sensing | Intuitive}${
    | Thinking
    | Feeling}${Perceiving | Judging}`;
  name: string;
  nameDescription: string;
  epithet: string;
  description: string;
  jungianFunctionalPreference: {
    dominant: string;
    auxiliary: string;
    tertiary: string;
    inferior: string;
  };
  generalTraits: string[];
  relationshipStrengths: string[];
  relationshipWeaknesses: string[];
  successDefinition: string;
  strengths: string[];
  gifts: string[];
  potentialProblemAreas: string[];
  explanationOfProblems: string;
  solutions: string;
  livingHappilyTips: string;
  suggestions?: string[];
  tenRulesToLive: string[];
}

export interface TestResult {
  timestamp: number;
  testAnswers: TestAnswerOption["type"][];
  testScores: PersonalityClass["type"][];
}

type Extroverted = "E";

type Introverted = "I";

type Sensing = "S";

type Intuitive = "N";

type Thinking = "T";

type Feeling = "F";

type Perceiving = "P";

type Judging = "J";

const DB_NAME = "MBTI_PERSONALITY_TEST_APP_IDB";

const DB_VERSION = 1;

const TEST_RESULT_STORE = "TEST_RESULT_STORE";

async function getDb() {
  const db = await openDB<{
    [TEST_RESULT_STORE]: {
      key: number;
      value: TestResult;
    };
  }>(DB_NAME, DB_VERSION, {
    upgrade(idb) {
      idb.createObjectStore(TEST_RESULT_STORE, {
        keyPath: "timestamp",
      });
    },
  });

  return db;
}

export function getQuestionAnswerScore(
  questionNumber: number,
  answerOption: TestAnswerOption["type"]
) {
  const question = personalityTest.find(
    (question) => question.no === questionNumber
  )!;

  return question.answerOptions.find((option) => option.type === answerOption)!
    .score;
}

export function getPersonalityClassGroupByTestScores(
  testScores: PersonalityClass["type"][]
) {
  const scoreCount = testScores.reduce(
    (acc, score) => {
      return {
        ...acc,
        [score]: acc[score] + 1,
      };
    },
    {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    }
  );

  const personalityClassGroupType = `${
    scoreCount.E >= scoreCount.I ? "E" : "I"
  }${scoreCount.S >= scoreCount.N ? "S" : "N"}${
    scoreCount.T >= scoreCount.F ? "T" : "F"
  }${scoreCount.J >= scoreCount.P ? "J" : "P"}`;

  return personalityClassGroup.find(
    ({ type }) => personalityClassGroupType === type
  )!;
}

export function getSavedTestResult(id: number) {
  return Future.make<Result<Option<TestResult>, Error>>((resolve) => {
    getDb()
      .then((db) => db.get(TEST_RESULT_STORE, id))
      .then(Option.fromNullable)
      .then((testResult) => resolve(Result.Ok(testResult)))
      .catch((error) => resolve(Result.Error(error)));
  });
}

export function getAllSavedTestResult() {
  return Future.make<Result<Option<TestResult[]>, Error>>((resolve) => {
    getDb()
      .then((db) => db.getAll(TEST_RESULT_STORE))
      .then(Option.fromNullable)
      .then((testResult) => resolve(Result.Ok(testResult)))
      .catch((error) => resolve(Result.Error(error)));
  });
}

export function saveTestResult(testResult: {
  timestamp: number;
  testAnswers: TestAnswerOption["type"][];
  testScores: PersonalityClass["type"][];
}) {
  return Future.make<Result<number, Error>>((resolve) => {
    getDb()
      .then((db) => db.put(TEST_RESULT_STORE, testResult))
      .then((id) => resolve(Result.Ok(id)))
      .catch((error) => resolve(Result.Error(error)));
  });
}
