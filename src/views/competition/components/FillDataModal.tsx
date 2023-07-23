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
    isFilling?: boolean;
    onFillData?: (id: number, proof: number) => void;
}

export default function FillDataModal({
    nft,
    isFilling, 
    onFillData,
    ...props
}: IProps) {
    const [proof, setProof] = React.useState<number>(0);

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
                        <Heading size="md" mb="10px">FILL PROOF</Heading>
                        <Image
                            src={nft?.image}
                            alt={nft?.id.toString()}
                            borderRadius="20px"
                            w="80%"
                            mb="20px"
                        />
                        <Flex w="full" my="10px" direction="column">
                            <Text>Your Proof </Text>
                            <Input
                                w="full"
                                value={proof}
                                onChange={(e) => {
                                    setProof(+e.target.value)
                                }}
                            />
                        </Flex>
                        <Button
                            variant="primary"
                            onClick={() => onFillData && proof && onFillData(nft!.id, proof)}
                            disabled={!proof || isFilling}
                        >
                            {isFilling ? <Spinner /> : 'Confirm'}
                        </Button>


                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
