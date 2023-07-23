import React from "react";
import VToken from "@/contracts/VToken";
import CompetitionNft from "@/components/CompetitionNft";
import CompetitionToken from "@/contracts/CompetitionToken";
import Competition from "@/contracts/Competition";
import { SMART_ADDRESS } from "@/contracts/utils/getAddress";
import { useAppSelector } from "@/reduxs/hooks";
import { INftItem, ActionType } from "@/_types_";
import {
  Flex,
  Text,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  VStack,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { NotificationModal, ProcessingModal } from "@/components";
import CreateModal from "./components/CreateModal";
import StartModal from "./components/StartModal";
import { deleteParticipants } from "@/utils/api";

export default function PersonalView() {
  const { web3Provider, wallet } = useAppSelector((state) => state.account);
  const [nfts, setNfts] = React.useState<INftItem[]>([]);
  const [competitionNfts, setCompetitionNfts] = React.useState<INftItem[]>([]);
  const [isOwner, setIsOwner] = React.useState<Boolean>();
  const [nextNftId, setNextNftId] = React.useState<number>();
  const [isProcessing, setIsProcessing] = useBoolean();
  const [isProcessingModal, setIsProcessingModal] = useBoolean();
  const [isOpenCreateModal, setIsOpenCreateModal] = useBoolean();
  const [isOpenStartModal, setIsOpenStartModal] = useBoolean();
  const [nft, setNft] = React.useState<INftItem>();
  const [txHash, setTxHash] = React.useState<string>();
  const [action, setAction] = React.useState<ActionType>();
  const [notifcation, setNotifcation] = React.useState<{ title: string, content: string }>();
  const {
    isOpen: isNotification,
    onClose: onCloseNotification,
    onOpen: onOpenNotification,
  } = useDisclosure();

  const initialize = React.useCallback(async () => {
    if (!web3Provider || !wallet) return;
    let _competitionNfts: INftItem[] = [];
    const CompetitionTokenContract = new CompetitionToken(web3Provider);
    setIsOwner(wallet.address == (await CompetitionTokenContract.owner()));
    const nfts = await CompetitionTokenContract.getListNFT(wallet.address);
    setNfts(nfts);
    const competitionContract = new Competition(web3Provider);
    const comeptitionNfts = await CompetitionTokenContract.getListNFT(SMART_ADDRESS['competitionV2']);
    const total = await CompetitionTokenContract.totalSupply();
    setNextNftId(total+1);
    for (const nft of comeptitionNfts) {
      const competition = await competitionContract.getCompetition(nft.id);
      const participants = await competitionContract.getParticipants(nft.id);
      if (competition['owner'] == wallet.address && participants.length == 0) {
        _competitionNfts.push(nft);
      }
    }
      setCompetitionNfts(_competitionNfts);

  }, [web3Provider, wallet]);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  const handleMint = async () => {
    try {
      if (!web3Provider || !wallet) return;
      setIsProcessing.on();
      const nftContract = new CompetitionToken(web3Provider);
      await nftContract.mintTo(wallet.address);
      setIsProcessing.off();
      setNotifcation({
        title:"SUCCESS",
        content: "Mint competition token"
      })
      onOpenNotification();
      await initialize();
    } catch (error) {
      setNotifcation({
        title:"FAILURE",
        content: "Mint competition token"
      })
      onOpenNotification();
      setIsProcessing.off();
    }
  }

  const selectAction = async (ac: ActionType, item: INftItem) => {
    if (!web3Provider) return;
    setNft(item);
    setAction(ac);
    setIsProcessingModal.off();

    if (ac == "CREATE") {
      setIsOpenCreateModal.on();
    }
    else if (ac == "START") {
      setIsOpenStartModal.on();
    }

    else if (ac == "REMOVE") {
      try {
        setIsProcessing.on();
        const CompetitionV1Contract = new Competition(web3Provider);
        const tx = await CompetitionV1Contract.remove(item.id);
        setTxHash(tx);
        setAction(undefined);
        setNft(undefined);
        setIsProcessing.off();

        setNotifcation({
          title: "SUCCESS",
          content: "Remove"
        })
        onOpenNotification();
        await initialize();
      } catch (error) {
        setNotifcation({
          title: "FAILURE",
          content: "Remove"
        })
        onOpenNotification();
        setIsProcessing.off();
      }
    }

  }

  const handleCreateCompetition = async (id: number, prizeAmount: number, endTime: number) => {
    setIsProcessingModal.on();
    try {
      if (!web3Provider || !nft || !wallet) return;
      const CompetitionContract = new Competition(web3Provider);
      const nftContract = new CompetitionToken(web3Provider);      
      await nftContract.approve(SMART_ADDRESS["competitionV2"], id);
      
      const tx = await CompetitionContract.create(id, prizeAmount, endTime);
      setTxHash(tx);
      setAction(undefined);
      setNft(undefined);
      setIsOpenCreateModal.off();
      setNotifcation({
        title: "SUCCESS",
        content: "Create"
      })
      onOpenNotification();
      await initialize();
    } catch (error) {
      console.log("ERROR: ", error)
      setNotifcation({
        title: "FAILURE",
        content: "Create"
      })
      onOpenNotification();
      setIsProcessingModal.off();
    }
  };

  const handeStartCompetition = async (id: number, prizeRatio: number[], participants: string[]) => {
    setIsProcessingModal.on();
    try {
      if (!web3Provider || !nft || !wallet) return;
      const CompetitionContract = new Competition(web3Provider);
      const tx = await CompetitionContract.start(id, prizeRatio, participants);
      setTxHash(tx);
      setAction(undefined);
      setNft(undefined);
      setIsOpenStartModal.off();
      setNotifcation({
        title: "SUCCESS",
        content: "Start"
      })
      onOpenNotification();
      await initialize();
      deleteParticipants(id);
    } catch (error) {
      setNotifcation({
        title: "FAILURE",
        content: "Start"
      })
      onOpenNotification();
      setIsProcessingModal.off();
    }
  };
  return (
    <Flex
      flexDirection="column"
    >
      <Tabs align="start" isFitted>
        <TabList>     
          <Tab>
            <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">PUZZLES</Text>
          </Tab>
          <Tab>
            <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">IN COMPETITION</Text>
          </Tab>
          {(isOwner) && <Tab>
            <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">MINT</Text>
          </Tab>}
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {nfts
                .sort((a, b) => a.id - b.id)
                .map((nft, index) => (
                  <CompetitionNft
                    item={nft}
                    key={index}
                    index={index}
                    isApprove
                    isCreate
                    onAction={(a) => selectAction(a, nft)}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {competitionNfts
                .sort((a, b) => a.id - b.id)
                .map((nft, index) => (
                  <CompetitionNft
                    item={nft}
                    key={index}
                    index={index}
                    isStart
                    isRemove
                    onAction={(a) => selectAction(a, nft)}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
          <VStack
              w={{ base: 'full', lg: "35%" }}
              margin="0px auto"
              bg="rgba(255,255,255, 0.2)"
              py="50px"
              px="50px"
              borderRadius="20px"
              border="3px solid rgba(255,255,255, 0.2)"
            >
            <Text color="rgba(255,255,255, 0.5)" fontWeight="bold" fontSize="20px">Next puzzle id: {nextNftId}</Text>

            <Button
              variant="primary"
              w="full"
              py="30px !important"
              onClick={handleMint}
            >
              {"Confirm"}
            </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <ProcessingModal
        isOpen={isProcessing}
        onClose={() => { }}
      />
      <CreateModal
        isOpen={isOpenCreateModal}
        nft={nft}
        isCreating={isProcessingModal}
        onClose={() => setIsOpenCreateModal.off()}
        onCreate={(id, prizeAmount, endTime) => handleCreateCompetition(id, prizeAmount, endTime)}
      />
      <StartModal
        isOpen={isOpenStartModal}
        nft={nft}
        isStarting={isProcessingModal}
        onClose={() => setIsOpenStartModal.off()}
        onStart={(id, participants, startTime) => handeStartCompetition(id, participants, startTime)}
      />

      <NotificationModal
        hash={txHash}
        title={notifcation?.title}
        content={notifcation?.content}
        isOpen={isNotification}
        onClose={onCloseNotification}
      />
    </Flex>
  );
}
