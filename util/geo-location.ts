import isNode from 'detect-node'
import { useEffect, useState } from 'react';

let location = null;

const options = {
    enableHighAccuracy: true,
    timeout: 50000,
    maximumAge: 0,
};

const errors = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

const useGeoLocation = (cb) => {
    
    const success = (pos) => {
        var crd = pos.coords;
        console.log(`More or less ${crd.accuracy} meters.`);
        // setLocalLocation()
        location = { lat: crd.latitude, lng: crd.longitude };
        cb(location)
    }

    if (!isNode) {
        console.log("Come Here")
        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                    if (result.state === "granted") {
                        navigator.geolocation.getCurrentPosition(success);
                        //If granted then you can directly call your function here
                    } else if (result.state === "prompt") {
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                    } else if (result.state === "denied") {
                        //If denied then you have to show instructions to enable location
                    }
                    result.onchange = function () {
                        console.log(result.state);
                    };
                });
        } else {
            alert("Sorry Not available!");
        }
    }

    // const setLocation = useCallback(({ lat, long }) => setLocalLocation({ lat, long }), [location]);

    return location;
}

export const getCurrentLocation = () => {
    const [geolocation, setGeoLocation] = useState(null);
    if (location) {
        if(location.lat !== geolocation?.lat && location.lng !== geolocation?.lng){
            const success = (pos) => {
                var crd = pos.coords;
                console.log("success",location)
                location = { lat: crd.latitude, lng: crd.longitude };
                setGeoLocation(location);
            }
            navigator.geolocation.watchPosition(success, ()=>{console.log("ERROR from here")}, options)
        }
    } else {
        useGeoLocation(setGeoLocation)
    }
    return { geolocation };
}

export const getLocationOnly = () => (location);



export default useGeoLocation;