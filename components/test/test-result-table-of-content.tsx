import Link from "next/link";
import { MouseEvent, useState, useEffect } from "react";
import { Flex, Text, UnorderedList, ListItem } from "@chakra-ui/react";

import useHeadingsObserver from "../../hooks/use-headings-observer";

export default function TestResultTableOfContent() {
  const { activeId, setActiveId } = useHeadingsObserver();

  const [headings, setHeadings] = useState<
    {
      id: string;
      text: string;
    }[]
  >([]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2")).map(
      (element) => ({
        id: element.id,
        text: element.textContent!,
      })
    );

    setHeadings(elements);
  }, []);

  function handleTableOfContentLinkClick(
    event: MouseEvent<HTMLLIElement, globalThis.MouseEvent>,
    id: string
  ) {
    event.preventDefault();
    setActiveId(id);
  }

  return (
    <Flex
      mx={4}
      my={4}
      w={{
        base: "25%",
      }}
      h="min-content"
      p={2}
      gap={4}
      top={5}
      direction="column"
      pos="sticky"
      alignSelf="flex-start"
    >
      <Text fontWeight="bold">Table Of Content</Text>
      <UnorderedList
        spacing={2}
        listStyleType="none"
      >
        {headings.map((heading, index) => (
          <ListItem
            key={index}
            fontSize="sm"
            cursor="pointer"
            _hover={{
              borderLeft: "4px solid black",
              pl: 2,
            }}
            {...(heading.id === activeId && {
              color: "primary.500",
              fontWeight: "bold",
            })}
            onClick={(event) =>
              handleTableOfContentLinkClick(event, heading.id)
            }
          >
            <Link href={`#${heading.id}`}>{heading.text}</Link>
          </ListItem>
        ))}
      </UnorderedList>
    </Flex>
  );
}
