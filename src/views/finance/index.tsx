import {
    VStack,
    Text,
    Image,
    Box,
    Button,
    useToast,
    Spinner,
  } from "@chakra-ui/react";
  import React from "react";
//import InputGroup from "./components/InputGroup";
import SuccessModal from "../../components/SuccessModal";
  
  const MIN_AMOUNT = 2000;
  
  export default function FinanceView() {
   
    
    return (
      <>
        <VStack
          w={{base: 'full', lg:"35%"}}
          margin="0px auto"
          bg="rgba(255,255,255, 0.2)"
          py="50px"
          px="50px"
          borderRadius="20px"
          border="3px solid rgba(255,255,255, 0.2)"
        >
          <Text variant="notoSan" fontSize={{base: '24px', lg: "38px"}}>
            Exchange
          </Text>
          
          <Box
            bg="rgba(255,255,255, 0.3)"
            borderRadius="full"
            p="15px"
            cursor="pointer"
          >
            <Image src="/arrow.png" alt="revert" w="25px" 
            // onClick={revert}
            />
          </Box>
          
          <Button
            variant="primary"
            w="full"
            py="30px !important"
          >

          </Button>
        </VStack>
      </>
    );
  }