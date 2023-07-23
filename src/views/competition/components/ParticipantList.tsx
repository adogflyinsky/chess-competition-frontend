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

import { IParticipant } from "@/_types_";


export interface IProps { participants: IParticipant[] | undefined }
const ParticipantList = (
    { participants }: IProps
) => {
    return (
        <Flex flex={1}>
            <TableContainer w="full">
                <Table variant="striped">
                    <Thead>
                        <Tr>
                            <Th>ADDRESS</Th>
                            <Th>Competition ID</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {participants && participants.map((participant, index) => {
                            return (
                                <Tr key={index}>
                                    <Td> <Text>{participant.address}</Text> </Td>
                                    <Td> <Text>{participant.competitionId}</Text> </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>

        </Flex>
    );
};

export default ParticipantList;