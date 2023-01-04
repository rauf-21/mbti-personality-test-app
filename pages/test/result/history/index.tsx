import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Option, AsyncData, Result } from "@swan-io/boxed";
import { Flex, Text } from "@chakra-ui/react";

import MainLayout from "../../../../components/layouts/main-layout";
import TestResultHistory from "../../../../components/test/test-result-history";
import {
  TestResult,
  getAllSavedTestResult,
} from "../../../../lib/personality-test";

export default function TestResultHistoryPage() {
  const router = useRouter();

  const [testResults, setTestResults] = useState<
    AsyncData<Result<Option<TestResult[]>, Error>>
  >(AsyncData.NotAsked());

  useEffect(() => {
    if (router.isReady) {
      setTestResults(AsyncData.Loading());

      getAllSavedTestResult().tap((result) =>
        setTestResults(AsyncData.Done(result))
      );
    }
  }, [router.isReady]);

  return (
    <MainLayout>
      {testResults.match({
        NotAsked: () => <Text>Loading</Text>,
        Loading: () => <Text>Loading</Text>,
        Done: (result) =>
          result.match({
            Error: () => <Text>Something went wrong! Please refresh!</Text>,
            Ok: (value) =>
              value.match({
                Some: (data) => <TestResultHistory testResults={data} />,
                None: () => <Text>No Data</Text>,
              }),
          }),
      })}
    </MainLayout>
  );
}
