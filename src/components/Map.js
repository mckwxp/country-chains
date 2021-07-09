import { React, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet";

function Map(props) {
    function LocationMarker() {
        const [position, setPosition] = useState(null);
        const map = useMapEvents({
            click(e) {
                setPosition(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
            },
        });

        return position === null ? null : (
            <Marker position={position}>
                <Popup>{props.country}</Popup>
            </Marker>
        );
    }
    console.log("render");

    return (
        <MapContainer center={[34.3, 75.5]} zoom={2} className="Map">
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://c.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png"
            />
            {/* <Marker position={[51.505, -0.09]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker> */}
            <LocationMarker />
        </MapContainer>
    );
}

export default Map;
