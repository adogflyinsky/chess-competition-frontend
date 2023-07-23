import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBoolean,
} from "@chakra-ui/react";
import React from "react";

import { IUser } from "@/_types_";


export interface IProps { users: IUser[] | undefined }
const UserList = (
  { users }: IProps
) => {
  return (
    <Flex flex={1}>
      <TableContainer w="full">
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>ADDRESS</Th>
              <Th>BALANCE</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users && users.map((user, index) => {
              return (
                <Tr key={index}>
                  <Td> <Text>{user.address}</Text> </Td>
                  <Td> <Text>{user.balance} VT</Text> </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

    </Flex>
  );
};

export default UserList;