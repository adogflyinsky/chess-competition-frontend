import {
    Modal,
    ModalOverlay,
    ModalProps,
    ModalContent,
    ModalBody,
    Text,
    Button,
    Flex,
    Heading,
    ModalCloseButton,
    Image,
    Input,
    Spinner,
} from "@chakra-ui/react";
import { INftItem } from "@/_types_";
import React from "react";

interface IProps extends Omit<ModalProps, "children"> {
    nft?: INftItem;
    isCreating?: boolean;
    onCreate?: (id: number, prizeId: number) => void;
}

export default function CreateModal({
    nft,
    isCreating,
    // onCreate,
    ...props
}: IProps) {
    const [prizeId, setPrizeId] = React.useState<number>(0);
    const [time, setTime] = React.useState<number>(0);

    return (
        <Modal closeOnOverlayClick={false} {...props}>
            <ModalOverlay
                blur="2xl"
                bg="blackAlpha.300"
                backdropFilter="blur(10px)"
            />
            <ModalContent py="30px">
                <ModalCloseButton />
                <ModalBody>
                    <Flex alignItems="center" w="full" direction="column">
                        <Heading size="md" mb="10px">CREATE COMPETITION</Heading>
                        <Image
                            src={nft?.image}
                            alt={nft?.id.toString()}
                            borderRadius="20px"
                            w="80%"
                            mb="20px"
                        />
                        <Flex w="full" my="10px" direction="column">
                            <Text>Prize ID </Text>
                            <Input
                                w="full"
                                value={prizeId}
                                onChange={(e) => {
                                    setPrizeId(+e.target.value)
                                }}
                            />
                        </Flex>
                        <Flex w="full" my="10px" direction="column">
                            <Text>Time </Text>
                            <Input
                                w="full"
                                value={time}
                                onChange={(e) => {
                                    setTime(+e.target.value)
                                }}
                            />
                        </Flex>
                        <Button
                            variant="primary"
                            // onClick={() => onCreate && prizeId && onCreate(nft.id, prizeId)}
                            disabled={!prizeId || isCreating}
                        >
                            {isCreating ? <Spinner /> : 'Confirm'}
                        </Button>


                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
