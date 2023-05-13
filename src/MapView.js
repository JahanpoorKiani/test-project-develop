import React, {Component, Fragment, useEffect, useRef, useState} from 'react';
// import L from 'leaflet';
import * as L from "leaflet";
import { Map, TileLayer, Marker } from 'react-leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css';
import  secureLocalStorage  from  "react-secure-storage";

import Popup from 'reactjs-popup';
import ReactModal from 'react-modal';

import {StyleSheet, Text} from "@react-pdf/renderer";
import styled from "@material-ui/core/styles/styled";
import TextField from "@material-ui/core/TextField";
import ic_map_marker from './ic_map_marker.png';

const StyledTextField = styled(TextField)({
    "& label": {
        left: "unset",
        right: "1.75rem",
        transformOrigin: "right",
        fontSize: "0.8rem",
    },
    "& legend": {
        textAlign: "right",
        fontSize: "0.6rem",
    },
});


const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

const defaultCenter = [35.689197, 51.388974]; //tehran center utm
const defaultZoom = 4;


function MapView() {
    const mapRef = useRef();
    // const lat = 35.689197;
    // const lng = 51.388974;

    let [text, setText] = React.useState('');
    let [password, setPassword] = React.useState('');

    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(true);


    const LeafIcon = L.Icon.extend({
        options: {}
    });

    const blueIcon = new LeafIcon({
            iconSize: [25, 41],
            iconAnchor: [10, 41],
            popupAnchor: [2, -40],
            iconUrl:
                "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|abcdef&chf=a,s,ee00FFFF"
        }),
        greenIcon = new LeafIcon({
            iconSize: [25, 41],
            iconAnchor: [10, 41],
            popupAnchor: [2, -40],
            iconUrl:
                "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|2ecc71&chf=a,s,ee00FFFF"
        });

    let position1 = [35.699197, 51.398974];
    let position2 = [35.699197, 51.398974];

    let marker1;
    let marker2;

    useEffect(() => {
        const { current = {} } = mapRef;
        const { leafletElement: map } = current;

        map.on("click", function (e) {
            if (marker2) map.removeLayer(marker2);

            const { lat, lng } = e.latlng;
            position2 = [lat, lng]

            marker2 = L.marker(position2, { icon: greenIcon })
            marker2.addTo(map)

            //
            setOpen(true)

        });

        map.on('zoomend', function (e) {
        })

        map.locate({
            setView: true,
        });

        map.on('locationfound', handleOnLocationFound);

        // Additional event handler for listening for
        // errors in finding someone's location

        map.on('locationerror', handleOnLocationError);

        return () => {
            map.off('locationfound', handleOnLocationFound);
            map.off('locationerror', handleOnLocationError);
        }
    }, []);

    /**
     * handleOnLocationFound
     * @param {object} event Leaflet LocationEvent object
     */

    function handleOnLocationFound(event) {
        const { current = {} } = mapRef;
        const { leafletElement: map } = current;

        const latlng = event.latlng;
        const radius = event.accuracy;
        const circle = L.circle(latlng, radius);

        position1 = latlng

        circle.addTo(map);

        setTimeout(
            function() {
                // window.location.reload();
                marker1 = L.marker([latlng.lat,latlng.lng], { icon: blueIcon });
                marker1.addTo(map);
            }
                .bind(this),
            250
        );
    }

    /**
     * handleOnLocationError
     * @param {object} error Leaflet ErrorEvent object
     */

    function handleOnLocationError(error) {
        alert(`Unable to determine location: ${error.message}`);
    }

    return (
        <div className="App">
            <Map ref={mapRef} center={defaultCenter} zoom={defaultZoom}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />
                <Marker icon={icon} className="App-Marker1" position={position1} >

                </Marker>

                <Popup
                    open={open}
                    // onClose={setOpen(false)}
                    modal
                    closeOnDocumentClick
                    // trigger={<button>Trigger</button>} position="right center"
                >
                    <div className="Map-header" >
                        <Fragment>
                            {/*<h1>The About us page.</h1>*/}
                            <Fragment>
                                <div className="row-container">
                                    <img className="myImage" src={ic_map_marker} alt="ic_map_pin"/>
                                    <p>35.689197</p>
                                    <p>,51.388974</p>
                                </div>
                            </Fragment>
                            <Fragment>
                                <div className="row-container">
                                    <img className="myImage" src={ic_map_marker} alt="ic_map_pin"/>
                                    <p>35.689197</p>
                                    <p>,51.388974</p>
                                </div>
                            </Fragment>
                        </Fragment>

                        <StyledTextField
                            fontSize={"50rem"}
                            variant="filled"
                            style={styles.textField}
                            alignSelf={'center'}
                            textAlign={'center'}
                            justifySelf={'flex-end'}
                            height={100}
                            marginBottom={10}
                            onChange={setText}
                            label="نوع ماشین آلات"
                            type={'text'}/>

                        <button onClick={() => {
                            setOpen(false)
                        }}  type="button"  style={styles.button}>
                            <Text >
                                {'ثبت درخواست'}
                            </Text>
                        </button>
                    </div>
                </Popup>

                {/*{markers.map((position, idx) =>*/}
                {/*    <Marker icon={icon} key={`marker-${idx}`} position={position}>*/}
                        {/*<Popup>*/}
                        {/*    <span>A pretty CSS3 popup. <br/> Easily customizable.</span>*/}
                        {/*</Popup>*/}
                    {/*</Marker>*/}
                )}
            </Map>
        </div>
    );
}

export default MapView;


const styles = StyleSheet.create({
    label: {
        marginBottom: 30
    },
    textField: {
        width: 360,
        borderRadius: 30,
        paddingRight: 0,
        marginBottom: 30,
        background: 'lightblue',
        fontFamily: "IRANSansWeb",
        fontSize: 50
    },
    button: {
        width: 280,
        height: 50,
        fontSize: 18,
        background: 'yellow',
    },
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 10
    }
});
