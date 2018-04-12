import _ from "lodash";
import { DeviceEventEmitter } from "react-native";
import Beacons from "react-native-beacons-manager";
import { DEFAULT_UUID, REGION } from "../constants";
import beaconActions from "../actions/BeaconActions";
import { BeaconActionTypes } from "../actions/actionsTypes";
import BluetoothManager from "./BluetoothManager";

const debouncedCleanFunction = _.debounce(dispatch => dispatch(beaconsChanged([])), 10000, {
    leading: false,
    trailing: true,
});

import _ from "lodash";
import Beacons from "react-native-beacons-manager";
import { BluetoothStatus } from "react-native-bluetooth-status";
import beaconActions from "../actions/BeaconActions";
import { BeaconActionTypes } from "../actions/actionsTypes";
import { REGION } from "../constants";

import { NativeModules, DeviceEventEmitter, NativeEventEmitter, Alert } from "react-native";

const { RNBluetoothManager } = NativeModules;

const debouncedCleanFunction = _.debounce(
    dispatch => dispatch(beaconActions.beaconsChanged([])),
    10000,
    {
        leading: false,
        trailing: true,
    }
);

export default class BeaconsManager {
    constructor(dispatch) {
        this.isRanging = false;
        this.dispatch = dispatch;

        this.beaconsChangesSubscription = null;
    }

    startRanging() {
        if (!this.isRanging) {
            console.log("BeaconsManager(iOS): start ranging");
            DeviceEventEmitter.addListener("authorizationStatusDidChange", info =>
                console.log("BeaconsManager(iOS):  authorization status did change: ", info)
            );

            Beacons.requestWhenInUseAuthorization();

            const region = { identifier: REGION, uuid: action.payload || DEFAULT_UUID };
            Beacons.startRangingBeaconsInRegion(region);
            console.log("BeaconsManager(iOS): ranging started");
        }
    }

    stopRanging() {
        console.log("BeaconsManager(iOS): stop ranging");
        this.isRanging = false;
        const region = { identifier: REGION, uuid: DEFAULT_UUID };
        if (action.payload) {
            region.uuid = action.payload;
        }
        Beacons.stopRangingBeaconsInRegion(region);
        console.log("BeaconsManager(iOS): ranging stopped");

        this._unSubscribeFromBeaconsChanges();
    }

    _subscribeOnBeaconsChanges = () => {
        if (!this.beaconsChangesSubscription) {
            console.log("BeaconsManager(iOS): subscribe on beacons changes");
            this.beaconsChangesSubscription = DeviceEventEmitter.addListener(
                "beaconsDidRange",
                data => {
                    if (data.beacons && data.beacons.length != 0) {
                        this.dispatch(beaconActions.beaconsChanged(data.beacons));
                        debouncedCleanFunction(store.dispatch);
                    }
                    store.dispatch(
                        beaconActions.searching(!data.beacons || data.beacons.length == 0)
                    );
                }
            );
        }
    };

    _unSubscribeFromBeaconsChanges = () => {
        if (this.beaconsChangesSubscription) {
            console.log("BeaconsManager(iOS): un subscribe from beacons changes");
            this.beaconsChangesSubscription.remove();
            this.beaconsChangesSubscription = null;
        }
    };
}
