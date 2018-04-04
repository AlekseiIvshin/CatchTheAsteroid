import { handleActions } from "redux-actions";
import _ from "lodash";
import { BeaconActionTypes, ApiActionTypes } from "../actions/actionsTypes";
import { DEFAULT_UUID } from "../constants";

const initialState = {
    beacons: [],
    isSearching: true,
    stations: {},
    errors: {
        stationsRequest: false,
    },
};

const mapBeaconToSingleId = (uuid, major, minor) => `${uuid.toLowerCase()}(${major}/${minor})`;

/**
 * Beacon: {
 *  uuid: string,
 *  major: number,
 *  minor: number,
 *  distance: number
 * }
 */
function processBeacons(beacons) {
    return beacons
        .map(item => {
            return {
                id: mapBeaconToSingleId(beacon.uuid, beacon.major, beacon.minor),
                distance: item.distance || item.accuracy,
            };
        })
        .filter(beacon => beacon.uuid === DEFAULT_UUID);
}

function handleBeaconsChanged(state, action) {
    return {
        ...state,
        beacons: processBeacons(action.payload),
    };
}

function handleBeaconsSearching(state, action) {
    return {
        ...state,
        isSearching: action.payload && (!state.items || state.items.length == 0),
    };
}

function handleGetStationsRequest(state) {
    return {
        ...state,
        errors: {
            ...state.errors,
            stationsRequest: false,
        },
        stations: [],
    };
}

function handleGetStationsSuccess(state, action) {
    const stations = {};
    for (const station of action.payload) {
        stations[
            mapBeaconToSingleId(station.beacon.uid, station.beacon.major, station.beacon.minor)
        ] = station;
    }
    return {
        ...state,
        stations,
    };
}

function handleGetStationsFailure(state) {
    return {
        ...state,
        errors: {
            ...state.errors,
            stationsRequest: true,
        },
        stations: [],
    };
}

export default handleActions(
    {
        [BeaconActionTypes.ACTION_BEACON_DID_RANGE]: handleBeaconsChanged,
        [BeaconActionTypes.ACTION_BEACON_SEARCHING]: handleBeaconsSearching,
        [ApiActionTypes.GET_ALL_STATIONS_REQUEST]: handleGetStationsRequest,
        [ApiActionTypes.GET_ALL_STATIONS_SUCCESS]: handleGetStationsSuccess,
        [ApiActionTypes.GET_ALL_STATIONS_FAILURE]: handleGetStationsFailure,
    },
    initialState
);
