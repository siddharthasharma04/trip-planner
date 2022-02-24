import { getUser } from "../util/user"
import { useEffect, useRef, useState } from "react";
import { connectToOther, getUsersLocation } from "../util/peer";
import { useRouter } from "next/router";
import MapWrapper from "./map-wrapper";

import {
    Flex, Center, FormControl, FormLabel, Input, FormHelperText, Button, useDisclosure, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Drawer,
    DrawerOverlay, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerFooter,
    List, ListIcon, ListItem, InputGroup, InputRightElement
} from "@chakra-ui/react";

import { CheckCircleIcon, AddIcon, ViewIcon } from "@chakra-ui/icons";
export default function MapPage({ location, peerId = "", otherUsers = {} }) {
    const [user, setUserName] = useState(getUser);
    const router = useRouter()

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
    useEffect(()=>{
        setUserName(getUser());
    },[user])
    console.log("Map page", otherUsers)
    const [otherUser, setOtherUser] = useState("");
    const btnRef = useRef()
    return <><Flex justify="space-between" align={`center`} bg="gray.200" p="4" boxShadow={`md`} pos="relative" zIndex={10}>
        <Flex flexDir="column">
            {`${user}`.toUpperCase()}
            {peerId && <InputGroup size='md'>
                <Input border="gray" bg={"gray.300"} userSelect="all" value={peerId} isReadOnly={true} />
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={() => { navigator.clipboard.writeText(peerId) }}>Copy</Button>
                </InputRightElement>
            </InputGroup>}
        </Flex>
        <Flex>
            {Object.keys(otherUsers).length > 0 && <Button variant="solid" ref={btnRef} colorScheme='teal' mr={2} onClick={onDrawerOpen}><ViewIcon /></Button>}
            <Button variant="solid" colorScheme='teal' onClick={onOpen}><AddIcon mr={2} /> Add</Button>
        </Flex>
    </Flex>
        <Flex h="100%" w="100%">
            <MapWrapper location={location} />
        </Flex>

        {/* {Drawer} */}
        <Drawer
            isOpen={isDrawerOpen}
            placement='right'
            onClose={onDrawerClose}
            finalFocusRef={btnRef}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Connected User List</DrawerHeader>

                <DrawerBody>
                    <List spacing={3}>
                        {getUsersLocation().map((v) => (<ListItem key={v[0]}>
                            <ListIcon as={CheckCircleIcon} color='green.500' />
                            {v[0]}
                        </ListItem>))}
                    </List>
                </DrawerBody>

                <DrawerFooter>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>

        {/* Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Center flexDir="column" gap="8">
                        <FormControl>
                            <FormLabel htmlFor='other_user_name'>Connect to</FormLabel>
                            <Input id='other_user_name' type='text' value={otherUser} onChange={(e) => { setOtherUser(e.target.value) }} placeholder={`Enter other user id`} />
                        </FormControl>

                    </Center>
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="solid" colorScheme='teal' onClick={btnClick}>Submit</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    </>

    function btnClick() {
        if (otherUser) {
            const conn = connectToOther(otherUser);
            setOtherUser('');
        }
        onClose();
    }
}

