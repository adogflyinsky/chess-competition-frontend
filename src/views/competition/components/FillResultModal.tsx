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
    onFillResult?: (id: number, result: string) => void;
}

export default function FillResultModal({
    nft,
    isFilling, 
    onFillResult,
    ...props
}: IProps) {
    const [result, setResult] = React.useState<string>();

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
                        <Heading size="md" mb="10px"> FILL RESULT</Heading>
                        <Image
                            src={nft?.image}
                            alt={nft?.id.toString()}
                            borderRadius="20px"
                            w="80%"
                            mb="20px"
                        />
                        <Flex w="full" my="10px" direction="column">
                            <Text>Result </Text>
                            <Input
                                w="full"
                                value={result}
                                onChange={(e) => {
                                    setResult(e.target.value)
                                }}
                            />
                        </Flex>
                        <Button
                            variant="primary"
                            onClick={() => onFillResult && result && onFillResult(nft!.id, result)}
                            disabled={!result || isFilling}
                        >
                            {isFilling ? <Spinner /> : 'Confirm'}
                        </Button>


                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
