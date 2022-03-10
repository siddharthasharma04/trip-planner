import Head from 'next/head'
import { ChakraProvider } from '@chakra-ui/react'
import OverRideTheme from '../util/theme';
import isNode from 'detect-node'
import '../styles/globals.scss';


function MyApp({ Component, pageProps }) {
  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"} />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&display=swap" rel="stylesheet" />
      </Head>

      <ChakraProvider theme={OverRideTheme}>
        <Component {...pageProps} />
        
      </ChakraProvider>
    </>
  )
}

export default MyApp
