import React from "react";
import Nft from "./components/Nft";
import ChessPuzzleContract from "@/contracts/ChessPuzzleContract";
import { useAppSelector } from "@/reduxs/hooks";
import { INftItem, ActionType } from "@/_types_";
import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { SuccessModal } from "@/components";
import ProcessingModal from "@/components/ProcessingModal";
import CreateModal from "./components/CreateModal";

export default function PersonalView() {
  const { web3Provider, wallet } = useAppSelector((state) => state.account);
  const [nfts, setNfts] = React.useState<INftItem[]>([]);

  const getListNft = React.useCallback(async () => {
    if (!web3Provider || !wallet) return;
    const nftContract = new ChessPuzzleContract(web3Provider);
    const nfts = await nftContract.getListNFT(wallet.address);
    setNfts(nfts);

  }, [web3Provider, wallet]);

  const [isProcessing, setIsProcessing] = useBoolean();

  const [isRemove, setIsRemove] = useBoolean();
  const [isOpenCreateModal, setIsOpenCreateModal] = useBoolean();
  const [modalType, setModalType] = React.useState<"CREATE" | "REMOVE" | "START">("CREATE");
  const [txHash, setTxHash] = React.useState<string>();
  const [nft, setNft] = React.useState<INftItem>();
  const [action, setAction] = React.useState<ActionType>();

  const selectAction = async (ac: ActionType, item: INftItem) => {
    if (!web3Provider) return;
    setNft(item);
    setAction(ac);
    setIsProcessing.off();
    switch (ac) {
      case "CREATE": {
        setIsOpenCreateModal.on();
        break;
      }
      case "REMOVE": {
        
        break;
      }
      case "START": {
        
        break;
      }      
      default:
        break;
    }
  };
  const handleCreateCompetition = async (prizeId: number) => {
    if (!web3Provider || !wallet || !nft) return;
    setIsProcessing.on();
    try {

      onOpenSuccess();
      setAction(undefined);
      setNft(undefined);

      await getListNft();
    } catch (er: any) {
      console.log(er);
      setIsProcessing.off();
    }
  };
  const handleStartCompetition = async (participants: string[], endTime: number) => {
    if (!web3Provider || !wallet || !nft) return;
    setIsProcessing.on();
    try {

      onOpenSuccess();
      setAction(undefined);
      setNft(undefined);

      await getListNft();
    } catch (er: any) {
      console.log(er);
      setIsProcessing.off();
    }
  };

  const {
    isOpen: isSuccess,
    onClose: onCloseSuccess,
    onOpen: onOpenSuccess,
  } = useDisclosure();

  React.useEffect(() => {
    getListNft();
  }, [getListNft]);

  return (
    <Flex w="full">
      <Tabs>
        <TabList borderBottomColor="#5A5A5A" borderBottomRadius={2} mx="15px">
          <Tab
            textTransform="uppercase"
            color="#5A5A5A"
            _selected={{ borderBottomColor: "white", color: "white" }}
          >
            PUZZLES
          </Tab>
          <Tab
            textTransform="uppercase"
            color="#5A5A5A"
            _selected={{ borderBottomColor: "white", color: "white" }}
          >
            IN COMPETITION
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {nfts.map((nft, index) => (
                <Nft
                  item={nft}
                  key={index}
                  index={index}
                  isCreate
                  onAction={(a) => selectAction(a, nft)}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <ProcessingModal isOpen={isRemove} onClose={() => {}} />

      <CreateModal isOpen={isOpenCreateModal}
        nft={nft}
        isCreating={isProcessing}
        onClose={() => setIsOpenCreateModal.off()}
        // onList={() => }
        />

      <SuccessModal
        hash={txHash}
        title="SUCCESS"
        isOpen={isSuccess}
        onClose={onCloseSuccess}
      />
    </Flex>
  );
}

