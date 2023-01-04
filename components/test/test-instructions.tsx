import {
  Flex,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  Button,
} from "@chakra-ui/react";

interface TestInstructionsProps {
  onCloseTestInstructions: () => void;
}

export default function TestInstructions(props: TestInstructionsProps) {
  return (
    <Flex
      h="full"
      px={4}
      direction="column"
      gap={8}
    >
      <Heading>Instructions</Heading>
      <Flex
        direction="column"
        gap={2}
      >
        <Text>
          Completing the test should only take 15 minutes or so. Here is several
          hints about how to complete this test:
        </Text>
        <UnorderedList spacing={2}>
          <ListItem>
            There are no right answers to any of these questions.
          </ListItem>
          <ListItem>
            Answer the questions quickly, do not over-analyze them. Some seem
            worded poorly. Go with what feels best.
          </ListItem>
          <ListItem>
            Answer the questions as “the way you are”, not “the way you’d like
            to be seen by others”.
          </ListItem>
        </UnorderedList>
      </Flex>
      <Button
        w="min-content"
        colorScheme="primary"
        alignSelf="flex-end"
        onClick={props.onCloseTestInstructions}
      >
        Okay, I got it!
      </Button>
    </Flex>
  );
}
