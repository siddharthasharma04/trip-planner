import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import OverRideTheme from '../util/theme';
import isNode from 'detect-node'
import '../styles/globals.scss';
import { useState } from 'react';
import { getCurrentLocation } from '../util/geo-location';


function MyApp({ Component, pageProps }) {
  const { geolocation: location } = getCurrentLocation()
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"} />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&display=swap" rel="stylesheet" />
      </Head>

      <ChakraProvider theme={OverRideTheme}>
        <Component location={location} {...pageProps} />
        
      </ChakraProvider>
    </>
  )
}

export default MyApp
