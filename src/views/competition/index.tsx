import React from "react";
import CompetitionNft from "@/components/CompetitionNft";
import CompetitionToken from "@/contracts/CompetitionToken";
import Competition from "@/contracts/Competition";
import { SMART_ADDRESS } from "@/contracts/utils/getAddress";
import { useAppSelector } from "@/reduxs/hooks";
import { INftItem, ActionType, IParticipant } from "@/_types_";
import {
  Flex,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { NotificationModal, ProcessingModal } from "@/components";
import FillDataModal from "./components/FillDataModal";
import FillResultModal from "./components/FillResultModal";
import ParticipantList from "./components/ParticipantList";
import { getUsers, addParticipant, test } from "@/utils/api";


export default function CompetitionView() {
  const { web3Provider, wallet } = useAppSelector((state) => state.account);
  const [participants, setParticipants] = React.useState<IParticipant[]>([]);
  const [nftsInJoin, setNftsInJoin] = React.useState<INftItem[]>([]);
  const [nftsInProgress, setNftsInProgress] = React.useState<INftItem[]>([]);
  const [nftsRequestResult, setNftsRequestResult] = React.useState<INftItem[]>([]);
  const [nftsInFinish, setNftsInFinish] = React.useState<INftItem[]>([]);
  const {
    isOpen: isNotification,
    onClose: onCloseNotification,
    onOpen: onOpenNotification,
  } = useDisclosure();

  const [isProcessing, setIsProcessing] = useBoolean();
  const [isProcessingModal, setIsProcessingModal] = useBoolean();
  const [isOpenFillDataModal, setIsOpenFillDataModal] = useBoolean();
  const [isOpenFillResultModal, setIsOpenFillResultModal] = useBoolean();
  const [nft, setNft] = React.useState<INftItem>();
  const [txHash, setTxHash] = React.useState<string>();
  const [notifcation, setNotification] = React.useState<{ title: string, content: string }>();

  const [action, setAction] = React.useState<ActionType>();

  const getListNft = React.useCallback(async () => {
    console.log(await test());
    if (!web3Provider || !wallet) return;
    let _nftsInJoin: INftItem[] = [];
    let _nftsInProgress: INftItem[] = [];
    let __nftsRequestResult: INftItem[] = [];
    let _nftsInFinish: INftItem[] = [];

    const nftContract = new CompetitionToken(web3Provider);
    const competitionV2Contract = new Competition(web3Provider);
    const comeptitionNfts = await nftContract.getListNFT(SMART_ADDRESS['competitionV2']);
    let _participants: IParticipant[] = [];
    for (const nft of comeptitionNfts) {
      const competition = await competitionV2Contract.getCompetition(nft.id);
      const participantAddressess = await competitionV2Contract.getParticipants(nft.id);

      if (participantAddressess.length == 0) {
        _nftsInJoin.push(nft);
      }
      else if (competition['result'].length == 0) {
        for (const participantAddr of participantAddressess) {
          if (participantAddr != '0x0000000000000000000000000000000000000000') {
            _participants.push({address: participantAddr, competitionId: nft.id})
          }
          if (participantAddr == wallet.address) {
            _nftsInProgress.push(nft);
          }
        }
        __nftsRequestResult.push(nft);
      }
      else {
        _nftsInFinish.push(nft);

      }
    }
    setParticipants(_participants);
    setNftsInJoin(_nftsInJoin);
    setNftsInProgress(_nftsInProgress);
    setNftsRequestResult(__nftsRequestResult);
    setNftsInFinish(_nftsInFinish);

  }, [web3Provider, wallet]);

  React.useEffect(() => {
    getListNft();
  }, [getListNft]);

  const selectAction = async (ac: ActionType, item: INftItem) => {
    if (!web3Provider || !wallet) return;
    setNft(item);
    setAction(ac);
    setIsProcessingModal.off();
    if (ac == "FILLDATA") {
      setIsOpenFillDataModal.on();
    }
    else if (ac == "GETPROOF" || ac == "FILLRESULT") {
      setIsOpenFillResultModal.on();
    }
    else {
      try {
        setIsProcessing.on();
        const competitionV2Contract = new Competition(web3Provider);

        if (ac == "JOIN") {

        }
        else if (ac == "REQUEST") {
          const tx = await competitionV2Contract.requestResult(item.id);
          setTxHash(tx);
        }
        else if (ac == "FINISH") {
          const tx = await competitionV2Contract.finish(item.id);
          setTxHash(tx);
        }
        setAction(undefined);
        setNft(undefined);
        setIsProcessing.off();
        setNotification({
          title: "SUCCESS",
          content: ""
        });
        onOpenNotification();
        await getListNft();

      } catch (error) {
        setNotification({
          title: "FAILURE",
          content: ""
        });
        onOpenNotification();
        setIsProcessing.off();

      }
    }
  }

  const handleJoinAction = async (id: number) => {
    if (!wallet) return;
    for (const addr1 of await getUsers()) {

      if (addr1.address == wallet.address) {
        setTxHash('participant');
        addParticipant(id, wallet.address);
        setNotification({
          title: "SUCCESS",
          content: "Add Participant"
        });
        onOpenNotification();
        return;
      }
    }
    setTxHash('register');
    setNotification({
      title: "REGISTER USER",
      content: ""
    });
    onOpenNotification();
    return;
  }

  const handleFillData = async (id: number, data: number) => {
    setIsProcessingModal.on();
    try {
      if (!web3Provider || !nft || !wallet) return;
      const competitionV2Contract = new Competition(web3Provider);
      const tx = await competitionV2Contract.fillData(id, data);
      setTxHash(tx);
      setAction(undefined);
      setNft(undefined);
      setIsOpenFillDataModal.off();

      setNotification({
        title: "SUCESS",
        content: `Filled proof: ${data}`
      })
      onOpenNotification();
      await getListNft();
    } catch (error) {

      setNotification({
        title: "FAILURE",
        content: `Fill proof`
      })
      onOpenNotification();
      setIsProcessingModal.off();
    }
  };

  const handleFillResult = async (id: number, result: string) => {
    setIsProcessingModal.on();
    try {
      if (!web3Provider || !nft || !wallet) return;
      const competitionV2Contract = new Competition(web3Provider);
      if (action == "GETPROOF") {
        const proof = await competitionV2Contract.getProof(id, result);
        setNotification({
          title: "SUCCESS",
          content: `Your proof: ${proof}`
        })
      }
      setAction(undefined);
      setNft(undefined);
      setIsOpenFillResultModal.off();
      onOpenNotification();
      await getListNft();
    } catch (error) {

      setNotification({
        title: "FAILURE",
        content: `Work with result`
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
            <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">JOIN</Text>
          </Tab>
          <Tab>
            <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">IN PROGRESS</Text>
          </Tab>
          <Tab>
            <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">REQUEST RESULT</Text>
          </Tab>
          <Tab>
            <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">FINISH</Text>
          </Tab>
          <Tab>
            <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">PARTICIPANTS</Text>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {nftsInJoin
                .sort((a, b) => a.id - b.id)
                .map((nft, index) => (
                  <CompetitionNft
                    item={nft}
                    key={index}
                    index={index}
                    isJoin
                    onAction={(a) => handleJoinAction(nft.id)}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {nftsInProgress
                .sort((a, b) => a.id - b.id)
                .map((nft, index) => (
                  <CompetitionNft
                    item={nft}
                    key={index}
                    index={index}
                    isFillData
                    isGetProof
                    onAction={(a) => selectAction(a, nft)}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {nftsRequestResult
                .sort((a, b) => a.id - b.id)
                .map((nft, index) => (
                  <CompetitionNft
                    item={nft}
                    key={index}
                    index={index}
                    isRequestResult
                    onAction={(a) => selectAction(a, nft)}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {nftsInFinish
                .sort((a, b) => a.id - b.id)
                .map((nft, index) => (
                  <CompetitionNft
                    item={nft}
                    key={index}
                    index={index}
                    isFinish
                    onAction={(a) => selectAction(a, nft)}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <ParticipantList
              participants={participants.sort((a, b) => a.competitionId - b.competitionId)}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <FillDataModal
        isOpen={isOpenFillDataModal}
        nft={nft}
        isFilling={isProcessingModal}
        onClose={() => setIsOpenFillDataModal.off()}
        onFillData={(id, data) => handleFillData(id, data)}
      />
      <FillResultModal
        isOpen={isOpenFillResultModal}
        nft={nft}
        isFilling={isProcessingModal}
        onClose={() => setIsOpenFillResultModal.off()}
        onFillResult={(id, result) => handleFillResult(id, result)}
      />
      <ProcessingModal
        isOpen={isProcessing}
        onClose={() => { }}
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