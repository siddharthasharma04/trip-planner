
// import { Wrapper } from '@googlemaps/react-wrapper';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
// import isNode from 'detect-node'
import { Children, isValidElement, cloneElement } from 'react';
import { useDeepCompareEffectForMaps } from '../util/deep-compare';
import { mapStyle } from '../util/mapStyle';
import {paths} from "../util/path";
import response from "../util/google.map.data.json";


interface MapProps extends google.maps.MapOptions {
  style?: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}


const MapComponent: React.FC<MapProps> = ({ onClick, onIdle, children, style, ...options }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  const mapOptions = {
    ...options,
    fullscreenControl: false,
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: 'terrain',
    styles: mapStyle
  };

  const directionsRenderer = new google.maps.DirectionsRenderer();
  // const directionsService = new google.maps.DirectionsService();
  useEffect(() => {
    if (ref.current && !map) {
      const _innerMap = new window.google.maps.Map(ref.current, {});
      setMap(_innerMap);
      const megaPath = paths.reduce((acc,v) => ([...acc,...v.path]),[]);
      setTimeout(() => {
        // const flightPlanCoordinates = [
        //   { lat: 34.152011, lng: 77.578305 },
        //   // { lat: 27.5057637, lng: 77.6569003 },
        //   { ...(options.center as any) },
        // ];
        const flightPath = new google.maps.Polyline({
          // path: paths,

          path: megaPath,
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 4,
        });

        // console.log(flightPath.getPath(), "Poly Path")//.push("c`ojD_j_wMgE~@wAf@u@pAG\\CJCf@AfAL~@f@bAt@z@t@j@t@JfA?bBg@dA_ARo@r@cF")

        // flightPath.setMap(_innerMap);
      }, 500)




      directionsRenderer.setMap(_innerMap);

      // http://router.project-osrm.org/route/v1/driving/34.1663277,77.5317188;27.5019715,77.6650548?overview=false
      // directionsService
      //   .route({
      //     origin: options.center, // Haight.
      //     destination: { lat: 34.1663277, lng: 77.5317188 }, // Ocean Beach.
      //     // Note that Javascript allows us to access the constant
      //     // using square brackets and a string value as its
      //     // "property."
      //     travelMode: google.maps.TravelMode['DRIVING'],
      //   })
      //   .then((response) => {
      directionsRenderer.setDirections((response as any));
      //   })
      //   .catch((e) => window.alert("Directions request failed due to " + status));
    }
  }, [ref, map]);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(mapOptions);
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={{ ...style, flexGrow: "1", height: "100%", width: "100%" }} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // set the map prop on the child component
          return cloneElement(child, { map });
        }
      })}
    </>
  );
};

// const MapComponent = (props) => {

//     const mapContainer = useRef();
//     const [map, setMap] = useState(null);
//     useEffect(() => {
//         let isMounted = true;
//         if (!isNode) {
//             if (mapContainer.current && !map) {
//                 if (isMounted) setMap(new (window as any).google.maps.Map(mapContainer.current, {}));
//             }
//         }
//         return () => { isMounted = false };
//     }, [mapContainer, map]);
//     console.log(props)

//     return <Flex><div className="map" ref={mapContainer}></div></Flex>

// }

export default MapComponent




// Sundar Nagar
// Himachal Pradesh
// 31.528386, 76.894846


// Rupnagar/ Kullu


// Karnal 


// Gazhiabad
