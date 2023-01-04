import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useRadioGroup, Flex, Text, Button } from "@chakra-ui/react";

import TestProgress from "./test-progress";
import TestAnswerOption from "./test-answer-option";

import { personalityTest } from "../../data/personality-test";
import {
  TestAnswerOption as TestAnswer,
  getQuestionAnswerScore,
  saveTestResult,
} from "../../lib/personality-test";
import useUserTestAnswersStore from "../../store/use-user-test-answers";

export default function TestQuestion() {
  const router = useRouter();

  const { userTestAnswers, setUserTestAnswers } = useUserTestAnswersStore();

  const [currentPersonalityTestIndex, setCurrentPersonalityTestIndex] =
    useState(0);

  const isUserAlreadyPickAnswer =
    userTestAnswers[currentPersonalityTestIndex] !== undefined;

  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name: "answer",
    defaultValue: userTestAnswers[currentPersonalityTestIndex],
    onChange: (value) => {
      const newUserTestAnswers = [...userTestAnswers];

      newUserTestAnswers[currentPersonalityTestIndex] =
        value as TestAnswer["type"];

      setUserTestAnswers(newUserTestAnswers);

      handleNextButtonClick();
    },
  });

  const group = getRootProps();

  useEffect(() => {
    if (userTestAnswers[currentPersonalityTestIndex] === undefined) {
      setValue("");
      return;
    }

    setValue(userTestAnswers[currentPersonalityTestIndex]);
  }, [currentPersonalityTestIndex, userTestAnswers, setValue]);

  function handleNextButtonClick() {
    setCurrentPersonalityTestIndex((currentPersonalityTestIndex) => {
      if (currentPersonalityTestIndex + 1 > personalityTest.length - 1) {
        return currentPersonalityTestIndex;
      }

      return currentPersonalityTestIndex + 1;
    });
  }

  function handlePreviousButtonClick() {
    setCurrentPersonalityTestIndex((currentPersonalityTestIndex) => {
      if (currentPersonalityTestIndex - 1 < 0) {
        return currentPersonalityTestIndex;
      }

      return currentPersonalityTestIndex - 1;
    });
  }

  function handleSeeResultButtonClick() {
    const timestamp = Date.now();
    const testScores = userTestAnswers.map((answer, index) =>
      getQuestionAnswerScore(index + 1, answer)
    );

    saveTestResult({
      testAnswers: userTestAnswers,
      testScores,
      timestamp,
    })
      .tap(() => {
        setUserTestAnswers([]);
      })
      .tapOk((id) => {
        router.replace(`/test/result/${id}`);
      })
      .tapError((error) => {
        console.error(error);
      });
  }

  return (
    <Flex
      py={4}
      w="full"
      h="full"
      gap={8}
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <TestProgress />
      <Flex direction="column">
        <Text
          fontWeight="bold"
          align="center"
        >
          #{currentPersonalityTestIndex + 1}
        </Text>
        <Text
          fontSize="lg"
          align="center"
        >
          {personalityTest[currentPersonalityTestIndex].question}
        </Text>
      </Flex>
      <Flex
        w="full"
        gap={4}
        direction="column"
        {...group}
      >
        {personalityTest[currentPersonalityTestIndex].answerOptions.map(
          (answerOption) => {
            const radio = getRadioProps({ value: answerOption.type });

            return (
              <TestAnswerOption
                key={answerOption.type}
                {...radio}
              >
                {answerOption.answer}
              </TestAnswerOption>
            );
          }
        )}
      </Flex>
      <Flex
        direction="row"
        w="full"
        gap={4}
      >
        <Button
          w="full"
          variant="outline"
          {...(currentPersonalityTestIndex === 0 && {
            disabled: true,
          })}
          onClick={handlePreviousButtonClick}
        >
          Previous
        </Button>
        {isUserAlreadyPickAnswer &&
        currentPersonalityTestIndex === personalityTest.length - 1 ? (
          <Button
            w="full"
            colorScheme="primary"
            onClick={handleSeeResultButtonClick}
          >
            See Result
          </Button>
        ) : (
          <Button
            w="full"
            colorScheme="primary"
            variant="outline"
            {...(!isUserAlreadyPickAnswer && {
              disabled: true,
            })}
            onClick={handleNextButtonClick}
          >
            Next
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
