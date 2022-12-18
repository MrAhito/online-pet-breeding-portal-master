import firebase from "../config/firebase";
import { SphericalUtil } from 'node-geometry-library';
import { useState, useEffect } from 'react';


function MetersLoc(props) {
    const [meters, setmeters] = useState('0 meters');

    function getDistance(x1, y1, x2, y2) {
        return SphericalUtil.computeDistanceBetween(
            { lat: x1, lng: y1 }, //from object {lat, lng}
            { lat: x2, lng: y2 } // to object {lat, lng}
        )
    }
    async function getDistanceUser(a, b) {
        const user = await firebase.doc(`users/${a}`).get();
        const user2 = await firebase.doc(`users/${b}`).get();
        if (user.data().location && user2.data().location) {
            var distance = getDistance(user.data().location.lat, user.data().location.lng, user2.data().location.lat, user2.data().location.lng);
            setmeters(distance = Math.round(distance));
        } else {
            setmeters('N/A');
        }

    }
    useEffect(() => {
        getDistanceUser(props.uid, props.oid);
    })
    return (meters);
}

export default MetersLoc
