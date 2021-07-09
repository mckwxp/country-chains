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
    let latlongData = require("../countries_latlong.json");

    function LocationMarker() {
        return props.countries.map((x, i) => {
            let country = latlongData.filter(
                (c) => c.country.toLowerCase() === x
            )[0];

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
        return (
            <Polyline
                positions={props.countries.map((x, i) => {
                    let country = latlongData.filter(
                        (c) => c.country.toLowerCase() === x
                    )[0];

                    return country
                        ? [country.latitude, country.longitude]
                        : null;
                })}
            />
        );
    }

    return (
        <MapContainer center={[34.3, 75.5]} zoom={2} className="Map">
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
