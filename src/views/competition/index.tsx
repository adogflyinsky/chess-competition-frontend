import {
    Flex,
    SimpleGrid,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useDisclosure,
    VStack,
  } from "@chakra-ui/react";
  import React, { useCallback, useState } from "react";
  
  export default function CompetitionView() {
 
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
               <Text variant="notoSan" fontSize="16px" color="rgba(255,255,255, 0.5)">FINISH</Text>
            </Tab>
          </TabList>
  
          <TabPanels>
            <TabPanel>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="100px">

              </SimpleGrid>
            </TabPanel>
            <TabPanel>
            </TabPanel>
          </TabPanels>
        </Tabs>

      </Flex>
    );
  }