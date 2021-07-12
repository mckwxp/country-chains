import React from "react";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Tooltip,
    Polyline,
    Marker,
    LayersControl,
} from "react-leaflet";
import { nanoid } from "nanoid";

function Map(props) {
    const latlongData = require("../countries_latlong.json");

    function findLatLong(x) {
        // get lat/long data from country name
        let countryArr = latlongData.filter(
            (c) => c.country.toLowerCase() === x.toLowerCase()
        );

        return countryArr.length !== 0 ? countryArr[0] : null;
    }

    function LocationMarker() {
        let colors = ["green", "red", "blue", "orange"];

        // add circle markers for each country
        return props.countries.map((x, i) => {
            let country = findLatLong(x);

            return country ? (
                <CircleMarker
                    center={[country.latitude, country.longitude]}
                    pathOptions={{
                        color: colors[i % props.players],
                        fillOpacity: 1,
                    }}
                    radius={5}
                    key={"id-" + nanoid()}
                >
                    <Tooltip>{country.country}</Tooltip>
                </CircleMarker>
            ) : null;
        });
    }

    function Lines() {
        // add lines to connect the circle markers
        let pos = props.countries
            .map((x, i) => {
                let country = findLatLong(x);

                return country ? [country.latitude, country.longitude] : null;
            })
            .filter((c) => c !== null);

        return pos.length !== 0 ? <Polyline positions={pos} /> : null;
    }

    function CurrentLocation() {
        if (props.countries.length > 0) {
            let country = findLatLong(
                props.countries[props.countries.length - 1]
            );
            return (
                <LayersControl position="topright" collapsed={false}>
                    <LayersControl.Overlay
                        name="Current Location"
                        checked={true}
                    >
                        <Marker
                            position={[country.latitude, country.longitude]}
                        ></Marker>
                    </LayersControl.Overlay>
                </LayersControl>
            );
        } else {
            return null;
        }
    }

    return (
        <MapContainer center={[25, 0]} zoom={2} id="Map">
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://c.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            <Lines />
            <CurrentLocation />
        </MapContainer>
    );
}

export default Map;
