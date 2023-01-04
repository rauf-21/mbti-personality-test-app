import { useState, useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";
import { Option } from "@swan-io/boxed";
import dayjs from "dayjs";

const SECOND_IN_MILISECONDS = 1000;

export default function TestTimer() {
  const [elapsedTime, setElapsedTime] = useState<Option<dayjs.Dayjs>>(
    Option.None()
  );

  useEffect(() => {
    if (elapsedTime.isNone()) {
      setElapsedTime(Option.Some(dayjs().minute(0).second(0).millisecond(0)));
      return;
    }

    const intervalId = setTimeout(() => {
      setElapsedTime((elapsedTime) =>
        elapsedTime.map((elapsedTime) => elapsedTime.add(1000, "ms"))
      );
    }, SECOND_IN_MILISECONDS);

    return () => clearTimeout(intervalId);
  }, [elapsedTime]);

  return (
    <Flex
      width={100}
      px={2}
      columnGap={2}
      justifyContent="center"
      alignItems="center"
      borderColor="blackAlpha.300"
      rounded="md"
    >
      <FiClock size={20} />
      <Text fontWeight="bold">
        {elapsedTime.match({
          Some: (elapsedTime) => {
            const minute = elapsedTime.minute().toString().padStart(2, "0");
            const second = elapsedTime.second().toString().padStart(2, "0");

            return `${minute} : ${second}`;
          },
          None: () => "-- : --",
        })}
      </Text>
    </Flex>
  );
}
