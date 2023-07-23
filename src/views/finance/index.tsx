import {
  VStack,
  Text,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Flex,
} from "@chakra-ui/react";
import { InputGroup } from "@/components";
import React from "react";
import { useAppSelector } from "@/reduxs/hooks";
import VToken from "@/contracts/VToken";
import { IUser } from "@/_types_";
import UserList from "./components/UserList";
import { getUsers } from "@/utils/api"
import { SMART_ADDRESS } from "@/contracts/utils/getAddress";

export default function FinanceView() {
  const { wallet, web3Provider } = useAppSelector((state) => state.account);
  const [balance, setBalance] = React.useState<number>();
  const [currentAllowance, setCurrentAllowance] = React.useState<number>();
  const [allowance, setAllowance] = React.useState<number>();
  const [users, setUsers] = React.useState<IUser[]>();

  const getTokenInfo = React.useCallback(async () => {
    if (!web3Provider || !wallet) return;
    const VTokenContract = new VToken(web3Provider);
    const balanceOfWallet = await VTokenContract.balanceOf(wallet.address);
    const _currentAllowance = await VTokenContract.allowance(wallet.address, SMART_ADDRESS['competitionV2']);
    setBalance(balanceOfWallet);
    setCurrentAllowance(_currentAllowance);
    let _users: IUser[] = [];
    const _usersInApi = await getUsers();
    for (const user of _usersInApi) {
      const address = user.address;
      const balance = await VTokenContract.balanceOf(address);
      _users.push({
        address: address,
        balance: balance
      })
    }
    setUsers(_users.sort((a, b) => b.balance - a.balance));
  }, [wallet, web3Provider]);

  React.useEffect(() => {
    getTokenInfo();
  }, [getTokenInfo]);

  const handleAllowance = async () => {
    if (!web3Provider || !wallet) return;
    const VTokenContract = new VToken(web3Provider);
    await VTokenContract.approve(SMART_ADDRESS['competitionV2'], allowance!);
    return;
  }
  return (
    <Flex
      flexDirection="column"
    >
      <Tabs align="start" isFitted>
        <TabList>
          <Tab>
            <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">YOUR INFO</Text>
          </Tab>
          <Tab>
            <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">APPROVE</Text>
          </Tab>
          <Tab>
            <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">PARTICIPANT INFO</Text>
          </Tab>
        </TabList>
        <TabPanels>
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
              <InputGroup
                name={"Balance"}
                value={balance == undefined ? "0" : `${balance}`}
                isReadOnly
              />
              <InputGroup
                name={"Allowance"}
                value={currentAllowance == undefined ? "0" : `${currentAllowance}`}
                isReadOnly

              />
            </VStack>
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
              <InputGroup
                name={"Amount"}
                value={allowance == undefined ? "0" : allowance.toString()}
                onChange={(e) => setAllowance(+e.target.value)}
              />
              <Button
                variant="primary"
                w="full"
                py="30px !important"
                onClick={handleAllowance}
            >
              {"Confirm"}
            </Button>
          </VStack>
        </TabPanel>
        <TabPanel>
          <UserList
            users={users}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
    </Flex >

  );
}