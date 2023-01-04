import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Option, AsyncData, Result } from "@swan-io/boxed";
import { Flex, Show, Text } from "@chakra-ui/react";

import MainLayout from "../../../components/layouts/main-layout";
import TestResult from "../../../components/test/test-result";
import TestResultTableOfContent from "../../../components/test/test-result-table-of-content";
import TestResultStats from "../../../components/test/test-result-stats";
import {
  TestResult as ITestResult,
  getSavedTestResult,
} from "../../../lib/personality-test";

export default function TestResultPage() {
  const router = useRouter();

  const [testResult, setTestResult] = useState<
    AsyncData<Result<Option<ITestResult>, Error>>
  >(AsyncData.NotAsked());

  useEffect(() => {
    if (router.isReady) {
      setTestResult(AsyncData.Loading());

      const id = parseInt(router.query.testResultId as string);

      getSavedTestResult(id).tap((result) =>
        setTestResult(AsyncData.Done(result))
      );
    }
  }, [router.isReady, router.query.testResultId]);

  return (
    <MainLayout>
      {testResult.match({
        NotAsked: () => <Text>Loading</Text>,
        Loading: () => <Text>Loading</Text>,
        Done: (result) =>
          result.match({
            Error: () => <Text>Something went wrong! Please refresh!</Text>,
            Ok: (value) =>
              value.match({
                Some: (data) => (
                  <Flex
                    h="full"
                    direction={{
                      base: "column",
                      lg: "row",
                    }}
                  >
                    <TestResultStats testResult={data} />
                    <TestResult testResult={data} />
                    <Show above="lg">
                      <TestResultTableOfContent />
                    </Show>
                  </Flex>
                ),
                None: () => <Text>No Data</Text>,
              }),
          }),
      })}
    </MainLayout>
  );
}
