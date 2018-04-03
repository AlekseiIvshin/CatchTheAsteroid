/**
 * Created by Aleksei_Ivshin on 4/18/17.
 */
import _ from 'lodash';
import * as BeaconActionTypes from '../actions/BeaconActionTypes';
import { DEFAULT_UUID } from '../constants';

const initialState = {
  items: [],
  isSearching: true,
  aliases: {},
  counter: 0,
};

function processBeacons(beacons) {
  return beacons.map(item => {
    return  { uuid: item.uuid.toLowerCase(), major: item.major, minor: item.minor, distance: item.distance || item.accuracy}
  })
  .filter(beacon => beacon.uuid === DEFAULT_UUID);
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case BeaconActionTypes.ACTION_BEACON_DID_RANGE:
      const aliases = _.cloneDeep(state.aliases);
      _.forEach(action.payload, (beacon) => {
        let key = [`${beacon.uuid}|${beacon.major}|${beacon.minor}`];
        if(!aliases[key]) {
          aliases[key] = Object.keys(aliases).length + 1;
        }
      });
      return {
        ...state,
        items: processBeacons(action.payload),
        aliases,
        counter: state.counter + 1
      };
    case BeaconActionTypes.ACTION_BEACON_SEARCHING:
      return {
        ...state,
        isSearching: action.payload && (!state.items || state.items.length == 0),
        counter: state.counter + 1
      };
    default:
      return state;
  }
}