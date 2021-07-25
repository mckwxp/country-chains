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
import PropTypes from "prop-types";

function Map(props) {
    const latlongData = require("../countries_latlong.json");

    function findLatLong(x) {
        // get lat/long data from country name
        const countryArr = latlongData.filter(
            (c) => c.country.toLowerCase() === x.toLowerCase()
        );

        return countryArr.length !== 0 ? countryArr[0] : null;
    }

    function LocationMarker() {
        const colors = ["green", "red", "blue", "orange"];

        // add circle markers for each country
        return props.countries.map((x, i) => {
            const country = findLatLong(x);

            return country ? (
                <CircleMarker
                    center={[country.latitude, country.longitude]}
                    pathOptions={{
                        color: colors[i % props.playersInRoom.length],
                        fillOpacity: 1,
                    }}
                    radius={5}
                    key={"circleMarker" + i}
                >
                    <Tooltip>{country.country}</Tooltip>
                </CircleMarker>
            ) : null;
        });
    }

    function Lines() {
        // add lines to connect the circle markers
        const pos = props.countries
            .map((x) => {
                const country = findLatLong(x);
                return country ? [country.latitude, country.longitude] : null;
            })
            .filter((c) => c !== null);

        return pos.length !== 0 ? <Polyline positions={pos} /> : null;
    }

    function CurrentLocation() {
        if (props.countries.length > 0) {
            const country = findLatLong(
                props.countries[props.countries.length - 1]
            );
            if (country) {
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
                return null; // needed to render a null element instead of nothing
            }
        } else {
            return null; // needed to render a null element instead of nothing
        }
    }

    return (
        <MapContainer center={[25, 0]} zoom={2} id="Map">
            <LayersControl position="topright" collapsed={false}>
                <LayersControl.BaseLayer checked name="Map without labels">
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://c.tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Map with labels">
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            <LocationMarker />
            <Lines />
            <CurrentLocation />
        </MapContainer>
    );
}

Map.propTypes = {
    countries: PropTypes.array,
    playersInRoom: PropTypes.array,
};

export default Map;
