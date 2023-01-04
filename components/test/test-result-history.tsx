import Link from "next/link";
import { Flex, Heading, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { FiChevronRight } from "react-icons/fi";

import { TestResult } from "../../lib/personality-test";

interface TestResultHistoryProps {
  testResults: TestResult[];
}

export default function TestResultHistory(props: TestResultHistoryProps) {
  return (
    <Flex
      my={4}
      w={{
        base: "full",
        lg: "50%",
      }}
      h="full"
      px={8}
      gap={8}
      alignSelf="flex-start"
      alignItems="center"
      direction="column"
    >
      <Heading
        as="h1"
        textAlign="center"
      >
        Test Result History
      </Heading>
      <Flex
        w="full"
        gap={4}
        direction="column"
      >
        {props.testResults.map((testResult) => (
          <Flex
            key={testResult.timestamp}
            as={Link}
            href={`/test/result/${testResult.timestamp}`}
            py={2}
            px={4}
            w="full"
            rounded="md"
            cursor="pointer"
            alignItems="center"
            justifyContent="space-between"
            borderWidth={1}
            borderColor="gray.100"
            _hover={{
              bg: "gray.100",
            }}
          >
            <Text>
              {dayjs(testResult.timestamp).format("D MMMM YYYY, HH:mm ")}
            </Text>
            <FiChevronRight />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
