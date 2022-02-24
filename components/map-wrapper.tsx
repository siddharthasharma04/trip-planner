import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { API_KEY } from '../util/enum';
import { Flex, Spacer } from '@chakra-ui/react'
import { useState } from 'react';
import  MapComponent  from "./map";
import  Marker  from "./map-marker";
import  Line  from "./map-line";
import { getUsersLocation } from '../util/peer';


const render = (status: Status) => {
    return <h1>{status}</h1>;
};


const MapWrapper = (props) => {
    const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
    const [zoom, setZoom] = useState(9); // initial zoom
    const [center, setCenter] = useState<google.maps.LatLngLiteral>(props.location || {lat: 0, lng: 0,});

    const onClick = (e: google.maps.MapMouseEvent) => {
        // avoid directly mutating state
        setClicks([...clicks, e.latLng!]);
    };

    const onIdle = (m: google.maps.Map) => {
        console.log("onIdle");
        // setZoom(m.getZoom()!);
        // setCenter(m.getCenter()!.toJSON());
    };
    const svgMarker = (color) => {
        return {
            path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
            fillColor: color || `#${Math.floor(Math.random()*16777215).toString(16)}`,
            fillOpacity: 1,
            strokeWeight: 2,
            rotation: 0,
            scale: 2,
          }
    };
    return (
        <Flex h="100%" w="100%" sx={{'& > div':{width:"100%", height:"100%", flexGrow: "1"}}}>
            <Wrapper apiKey={API_KEY} render={render} language="hi" region="IN">
                <MapComponent
                    center={center}
                    onClick={onClick}
                    onIdle={onIdle}
                    zoom={zoom}
                    style={{}}
                >
                    {/* {clicks.map((latLng, i) => (
                            <Marker key={i} position={latLng} />
                        ))} */}
                    <Marker position={center} />
                    {/* <Line path={[center, {lat:center.lat+1, lng:center.lng+1}]}  /> */}
                    {getUsersLocation().map((v)=>(<Marker key={v[0]} icon={svgMarker((v[1] as any).color)} label={v[0]} position={(v[1] as any).location} />))}
                    {getUsersLocation().map((v)=>(<Line key={v[0]} path={[center, (v[1] as any).location]} strokeColor={(v[1] as any).color} />))}
                </MapComponent>
            </Wrapper>
        </Flex>
    )
}


export default MapWrapper;