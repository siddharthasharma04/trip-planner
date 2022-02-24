import { useEffect, useState } from "react";


const Line: React.FC<google.maps.PolylineOptions> = (options) => {
    const [line, setMarker] = useState<google.maps.Polyline>();
  
    useEffect(() => {
      if (!line) {
        setMarker(new google.maps.Polyline());
      }
  
      // remove marker from map on unmount
      return () => {
        if (line) {
          line.setMap(null);
        }
      };
    }, [line]);
  
    useEffect(() => {
      const lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      };
      if (line) {
        line.setOptions({
          ...options,
          icons: [
            {
              icon: lineSymbol,
              offset: "100%",
            },
          ],
        });
      }
    }, [line, options]);
  
    return null;
  };


  export default Line;