import {
  FormControl,
  FormLabel,
  FormHelperText,
  Flex,
  Input,
  Center,
  Button
} from '@chakra-ui/react'
import Router from 'next/router';
import { useEffect, useState } from 'react';
import MapPage from '../components/map-page';
import { getCurrentLocation } from '../util/geo-location';
import { setPeer } from '../util/peer';
import useLocalUser from '../util/useLocalUser';
import { setUser } from '../util/user';


export default function Home() {
  const [username, setUsername] = useState("");
  const [isHomePage, setIsHomePage] = useState(true);
  const [peerId, setPeerId] = useState("");
  const [otherUsers, setOtherUsers] = useState({});
  const {localUserId, setLocalUserId} = useLocalUser();

  const { geolocation: location } = getCurrentLocation()

  const {usr, id} = JSON.parse(localUserId || "{}");
  useEffect(()=>{
    if(localUserId){
        (async ()=>{
          setUsername(usr);
          setUser(usr);
          await btnClick();
          setIsHomePage(false);
        })()
    }
  },[localUserId])

  return (
    <>
      {isHomePage ? <Flex w="100%" h="100%" justify="center">
        <Center flexDir="column" gap="8">
          <FormControl>
            <FormLabel htmlFor='user_name'>Enter username</FormLabel>
            <Input id='user_name' type='text' value={username} onChange={(e) => { setUsername(e.target.value) }} />
            <FormHelperText>Please use a unique name.</FormHelperText>
          </FormControl>
          <Button colorScheme='blue' onClick={btnClick}>Submit</Button>
        </Center>
      </Flex> : <MapPage location={location} peerId={peerId} otherUsers={otherUsers} />}
    </>
  );

  async function btnClick() {
    if (usr || username) {
      setUser(usr || username);
      // Router.push('./map-page');
      const { id } = await setPeer(setOtherUsers,{id:localUserId,setId:setLocalUserId});
      setPeerId(id);
      setIsHomePage(false);
    }
  }
}
