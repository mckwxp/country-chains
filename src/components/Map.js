import React from "react";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Tooltip,
    Polyline,
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
        // add circle markers for each country
        return props.countries.map((x, i) => {
            let country = findLatLong(x);

            return country ? (
                <CircleMarker
                    center={[country.latitude, country.longitude]}
                    pathOptions={{
                        color:
                            i === props.countries.length - 1 ? "blue" : "green",
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

    return (
        <MapContainer center={[25, 0]} zoom={2} className="Map">
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://c.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            <Lines />
        </MapContainer>
    );
}

export default Map;
