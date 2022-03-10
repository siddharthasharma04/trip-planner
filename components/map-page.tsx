import { getUser } from "../util/user"
import { useEffect, useRef, useState } from "react";
import { connectToOther, getUsersLocation, initOthersConnections } from "../util/peer";
import { useRouter } from "next/router";
import MapWrapper from "./map-wrapper";
import { useToast } from '@chakra-ui/react'

import {
    Flex, Center, FormControl, FormLabel, Input, FormHelperText, Button, useDisclosure, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Drawer,
    DrawerOverlay, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerFooter,
    List, ListIcon, ListItem, InputGroup, InputRightElement
} from "@chakra-ui/react";

import { CheckCircleIcon, ViewIcon, WarningTwoIcon } from "@chakra-ui/icons";
import ShareIcon from "./icons/sahre-icon";
import { deleteUser } from "../util/useLocalUser";
export default function MapPage({ location, peerId = "", otherUsers = {} }) {
    const [user, setUserName] = useState(getUser);
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
    useEffect(()=>{
        setUserName(getUser());
    },[user])

    useEffect(()=>{
        initOthersConnections();
      },[])
    console.log("Map page", otherUsers)
    const [otherUser, setOtherUser] = useState("");
    const btnRef = useRef()

    const showToast = () => {
        toast({
            title: 'My ID Copied!',
            status: 'success',
            duration: 2500,
            isClosable: true,
          })
    }

    const onUserNameClick = () => {
        let timer = null;
        let timeCount = 0;
        let clickCount = 0;

        const runTimer = () =>{
            timer = setInterval(()=>{
                if(timeCount===0){
                    clearInterval(timer);
                    timer = null;
                    clickCount = 0
                }
                timeCount -= 10;
            },10)
        }
        return () =>{
            !timer && runTimer();
            clickCount++;
            timeCount += 200;
            console.log(clickCount);
            if(clickCount===5){
                onConfirmOpen();
            }
        }
    }

    const onCopyIdClick = () =>{
        navigator.clipboard.writeText(peerId);

        if (navigator.share) {
            navigator.share({
              title: 'मैं आपके साथ जुड़ना चाहता हूं। मेरे साथ अपना पता साझा करने के लिए इस आईडी का उपयोग करें।',
              text:`${peerId}`,
            }).then(() => {
              console.log('Thanks for sharing!');
            })
            .catch(console.error);
          }
          else{
            showToast(); 
          }
    }

    return <><Flex position="fixed" top="0" w="100%" justify="space-between" align={`center`} bg="gray.200" p="2" boxShadow={`md`} zIndex={10}>
        <Flex gap={3} alignItems="center">
            <Button bg="transparent" p="1" onClick={onUserNameClick()}>{`${user}`.toUpperCase().substr(0,15) + `${user.length>15 ? " ...":""}`}</Button>
            {peerId && <Button h='1.75rem' colorScheme="teal" size='sm' onClick={onCopyIdClick}>Copy ID</Button>}
            {/* {peerId && <InputGroup size='md'>
                <Input border="gray" bg={"gray.300"} userSelect="all" value={peerId} isReadOnly={true} /> 
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={() => { navigator.clipboard.writeText(peerId);showToast(); }}>Copy ID</Button>
                </InputRightElement>
            </InputGroup>} */}
        </Flex>
        <Flex>
            {Object.keys(otherUsers).length > 0 && <Button variant="solid" size='sm' ref={btnRef} colorScheme='teal' mr={2} onClick={onDrawerOpen}><ViewIcon /></Button>}
            <Button variant="solid" colorScheme='teal' p="0.5" fontSize="24px" size='sm' onClick={onOpen} aria-label="Share"><ShareIcon /></Button>
        </Flex>
    </Flex>
    <Flex h="6" px="3" py="1" color="gray.600" gap="2" fontSize="xs" left="0" right="0" bottom="0" pos="fixed" backgroundColor="blackAlpha.200"zIndex="5">
        <strong>Lat: {location.lat}</strong>
        <strong>Long: {location.lng}</strong>
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
                <ModalHeader>Share Location with Other</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Center flexDir="column" gap="8">
                        <FormControl>
                            <FormLabel htmlFor='other_user_name'>Send to</FormLabel>
                            <Input id='other_user_name' type='text' value={otherUser} onChange={(e) => { setOtherUser(e.target.value) }} placeholder={`Enter other user id`} />
                        </FormControl>

                    </Center>
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="solid" colorScheme='teal' onClick={btnClick}>Share</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

        {/* Confirm Modal */}
        <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirm</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <h3><WarningTwoIcon fontSize="4xl" color="red.500" mr="3" /> Are you sure! you want to Logout</h3>
                </ModalBody>

                <ModalFooter>
                    <Button variant="solid" colorScheme='teal' onClick={logoutMe}>Logout</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    </>

    function logoutMe(){
        deleteUser();
    }

    function btnClick() {
        if (otherUser) {
            const conn = connectToOther(otherUser);
            setOtherUser('');
        }
        onClose();
    }
}

