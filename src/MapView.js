import React, {Component, Fragment, useEffect, useRef, useState} from 'react';
// import L from 'leaflet';
import * as L from "leaflet";
import { Map, TileLayer, Marker } from 'react-leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css';
import  secureLocalStorage  from  "react-secure-storage";
import Popup from 'reactjs-popup';
import {StyleSheet, Text} from "@react-pdf/renderer";
import styled from "@material-ui/core/styles/styled";
import TextField from "@material-ui/core/TextField";

import ic_map_pin from './ic_map_pin.png';
import axios from "axios";

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

    const [open, setOpen] = useState(false);
    const [requestNo, setRequestNo] = React.useState('');
    const [vehicleName, setVehicleName] = React.useState('');

    const [position1, setPosition1] = useState({
        lat: "",
        lng: "",
    });
    const [position2, setPosition2] = useState({
        lat: "",
        lng: "",
    });

    let marker1;
    let marker2;

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

    let [token, setToken] = React.useState('');


    useEffect(() => {
        const { current = {} } = mapRef;
        const { leafletElement: map } = current;

        map.on("click", function (e) {
            // if (marker2) map.removeLayer(marker2);
            const { lat, lng } = e.latlng;
            // position2 = [lat, lng]

            if (!marker1) {
                setPosition1({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng
                })
                setTimeout(
                    function() {
                        // window.location.reload();
                        marker1 = L.marker([e.latlng.lat,e.latlng.lng], { icon: blueIcon });
                        marker1.addTo(map);
                    }
                        .bind(this),
                    50
                );
            } else if (!marker2){
                setPosition2({
                    lat: lat,
                    lng: lng
                })

                setTimeout(
                    function() {
                        marker2 = L.marker(e.latlng, { icon: greenIcon })
                        marker2.addTo(map)

                        //
                        setOpen(true)
                    }
                        .bind(this),
                    50
                );
            } else {
                map.removeLayer(marker1);
                map.removeLayer(marker2);
                marker1 = null
                marker2 = null
            }
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

        circle.addTo(map);

        // setTimeout(
        //     function() {
        //         marker1 = L.marker([latlng.lat,latlng.lng], { icon: blueIcon });
        //         marker1.addTo(map);
        //     }
        //         .bind(this),
        //     250
        // );
    }

    /**
     * handleOnLocationError
     * @param {object} error Leaflet ErrorEvent object
     */

    function handleOnLocationError(error) {
        alert(`Unable to determine location: ${error.message}`);
    }

    const handleRequest = (e) => {
        e.preventDefault();

        axios.get('https://exam.pishgamanasia.com/webapi/Request/GetVehicleUsers?SearchTerm='
            +'%D8%B3%D9%88%D8%A7%D8%B1&User'+'Token='+secureLocalStorage.getItem('tokenKey'))

            .then(response => {

                const userData = {
                    userToken: secureLocalStorage.getItem('tokenKey'),
                    vehicleUserTypeId: response.data.data.id,
                    source: position1.toString(),
                    destination: position2.toString()
                };
                axios.post("https://exam.pishgamanasia.com/webapi/Request/SendRequest", userData).then((response) => {
                    console.log(response.status, response.data);

                    setRequestNo(response.data.data.requestNo)
                    setOpen(false)
                    alert('RequestNo:    '+response.data.data.requestNo)
                });

            })
            .catch(error => {
                console.error(error);
            });

    };

    return (
        <div className="App" >
            <Map ref={mapRef} center={defaultCenter} zoom={defaultZoom}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />

                <Popup
                    open={open}
                    modal
                    closeOnDocumentClick>

                    <div className="Column-container">
                        <div className="Map-popup" style={{borderRadius: 20}}>
                            <Fragment>
                                {/*<h1>The About us page.</h1>*/}
                                <div className="row-container">
                                    <Fragment>
                                        <div className="row">
                                            <img className="myImage" src={ic_map_pin} alt="ic_map_pin" style={{height: 50, width: 30}}/>
                                            <p style={styles.p2}>مبدا: </p>
                                            <p style={styles.p}>{position1.lat}</p>
                                            <p style={styles.p}>,{position1.lng}</p>
                                        </div>
                                    </Fragment>
                                    <Fragment>
                                        <div className="row">
                                            <img className="myImage" src={ic_map_pin} alt="ic_map_pin" style={{height: 50, width: 30}}/>
                                            <p style={styles.p2}>مقصد: </p>
                                            <p style={styles.p}>{position2.lat}</p>
                                            <p style={styles.p}>,{position2.lng}</p>
                                        </div>
                                    </Fragment>
                                </div>

                            </Fragment>

                            <StyledTextField
                                fontSize={"50rem"}
                                variant="filled"
                                style={styles.textField}
                                alignSelf={'center'}
                                textAlign={'center'}
                                // justifySelf={'flex-end'}
                                height={100}
                                marginBottom={10}
                                onChange={setVehicleName}
                                label="نوع ماشین آلات"
                                type={'search'}/>

                            <form onSubmit={handleRequest}/>
                            <button onClick={handleRequest}  type="button"  style={styles.button}>
                                <Text >
                                    {'ثبت درخواست'}
                                </Text>
                            </button>
                        </div>
                    </div>
                </Popup>
                )}
            </Map>
        </div>
    );
}

export default MapView;


const styles = StyleSheet.create({
    textField: {
        width: '95%',
        borderRadius: 100,
        paddingRight: 0,
        marginBottom: 10,
        background: '#BBDEFB',
        fontFamily: "IRANSansWeb",
        fontSize: 50,
    },
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 10
    },
    label: {
        marginTop: 30,
        marginBottom: 10,
        color: 'black'
    },
    p: {
        width: 200,
        fontSize: 20,
        color: '#CCCCCC'
    },
    p2: {
        width: 50,
        fontSize: 20,
        color: '#CCCCCC'
    },
    button: {
        width: '95%',
        height: 50,
        marginTop: 0,
        marginBottom: 30,
        borderRadius: 30,
        fontSize: 18,
        background: '#FBC02D',
    },
});
