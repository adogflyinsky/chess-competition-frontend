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
import { deleteParticipants, getParticipants } from "@/utils/api";
import { useAppSelector } from "@/reduxs/hooks";

interface IProps extends Omit<ModalProps, "children"> {
    nft?: INftItem;
    isStarting?: boolean;
    onStart?: (id: number, prizeRatio: number[], participants: string[]) => void;
}

export default function StartModal({
    nft,
    isStarting,
    onStart,
    ...props
}: IProps) {
    const [participants, setParticipants] = React.useState<string[]>([]);
    const [prizeRatio, setPrizeRatio] = React.useState<number[]>([]);

    const { web3Provider, wallet } = useAppSelector((state) => state.account);

    const initialize = React.useCallback(async () => {
        if (web3Provider && nft) {
            setParticipants(await getParticipants(nft.id));
        }
    }, [nft, web3Provider]);

    React.useEffect(() => {
        initialize();
    }, [initialize]);
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
                        <Heading size="md" mb="10px">START COMPETITION</Heading>
                        <Image
                            src={nft?.image}
                            alt={nft?.id.toString()}
                            borderRadius="20px"
                            w="80%"
                            mb="20px"
                        />
                        <Flex w="full" my="10px" direction="column">
                            <Text>Prize Ratio </Text>
                            <Input
                                w="full"
                                value={prizeRatio.join(',')}
                                onChange={(e) => {
                                    setPrizeRatio(e.target.value.split(",").map(Number))
                                }}
                            />
                            <Text>Participants </Text>
                            <Input
                                w="full"
                                value={participants}
                                onChange={(e) => {
                                    setParticipants(e.target.value.split(","))
                                }}
                            />
                        </Flex>

                        <Button
                            variant="primary"
                            onClick={() => {
                                if (!nft || !onStart) return;
                                onStart(nft.id, prizeRatio, participants);
                                deleteParticipants(nft.id);
                            }}
                            disabled={!participants || isStarting}
                        >
                            {isStarting ? <Spinner /> : 'Confirm'}
                        </Button>


                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal >
    );
}
