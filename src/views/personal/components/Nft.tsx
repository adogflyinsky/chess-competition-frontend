import { INftItem, ActionType } from "@/_types_";
import {
  Flex,
  Image,
  Box,
  Text,
  HStack,
  SimpleGrid,
  Button,
  Spacer,
} from "@chakra-ui/react";
import React from "react";


interface IProps {
  item: INftItem;
  index: number;
  isCreate?: boolean;
  isStart?: boolean;
  isRemove?: boolean;
  isFillData?: boolean;
  isRequestResult?: boolean;
  isFinish?: boolean;
  onAction?: (action: ActionType) => void;
}

export default function Nft({
  item,
  index,
  isCreate,
  isStart,
  isRemove,
  isFillData,
  isRequestResult, 
  isFinish,
  onAction,
}: IProps) {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      bg="#151D14"
      px="10px"
      py="10px"
      borderRadius="10px"
    >
      <Box position="relative">
        <Image
          src={item.image}
          alt={item.id.toString()}
          objectFit="cover"
          borderRadius="10px"
        />
        <HStack bg="rgba(0,0,0,0.4)" position="absolute" top={5} px="10px">
          <Text>ID: {item.id.toString().padStart(5, "0")}</Text>
        </HStack>
      </Box>
      <Button
        variant="link"
        w="full"
        mt="10px"
        as="a"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"

      >
        Go to puzzle
      </Button>
      {isStart && isRemove && (
        <SimpleGrid w="full" columns={2} spacingX="10px">
          <Button
            variant="primary"
            onClick={() => onAction && onAction("START")}
          >
            START
          </Button>
          <Button
            variant="primary"
            onClick={() => onAction && onAction("REMOVE")}
          >
            REMOVE
          </Button>
        </SimpleGrid>
      )}
    
      {isCreate && (
        <Button
          variant="primary"
          w="full"
          mt="10px"
          onClick={() => onAction && onAction("CREATE")}
        >
          CREATE
        </Button>
      )}
    </Flex>
  );
}
