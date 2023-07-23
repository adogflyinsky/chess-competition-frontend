import {
  Modal,
  ModalOverlay,
  ModalProps,
  ModalContent,
  ModalBody,
  Text,
  Button,
  Flex,
  ModalCloseButton,
} from "@chakra-ui/react";
import { showTransactionHash } from "../utils";

interface IProps extends Omit<ModalProps, "children"> {
  hash?: string;
  title?: string;
  content?: string;
}

export default function NotificationModal({ hash, title, content, ...props }: IProps) {
  const onNavigation = () => {
    if (window) {
      if (hash == "register") {
        window.open(`http://localhost:8000/api/users/`, '_blank');

      } 
      else if(hash == "participant") {
        window.open(`http://localhost:8000/api/participants/`, '_blank');

      }
      else {
        window.open(`https://baobab.scope.klaytn.com/tx/${hash}`, '_blank');
      }
    }
  };

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
          <Flex
            alignItems="center"
            justifyContent="center"
            w="full"
            direction="column"
          >
            <Text variant="notoSan" fontSize="20px">
              {title}
            </Text>
            <Text fontStyle="italic" fontSize="12px" mt="10px">
              {content}
            </Text>

            <Button w="full" variant="primary" mt="20px" onClick={onNavigation}>
              {"****"}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
