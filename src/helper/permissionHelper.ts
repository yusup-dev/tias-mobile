import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

const APP_PERMISSION = {
  ANDROID: [
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  ],
  IOS: [
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.IOS.PHOTO_LIBRARY,
  ],
};
export default class Permission {
  static PERMISSIONS_LIST = PERMISSIONS;
  static RESULTS_LIST = RESULTS;

  static requestAll = async () => {
    let results = [];
    let checks = await this.checkAll();
    let isAllGranted = true;
    for (let e of checks) {
      isAllGranted = e.result === Permission.RESULTS_LIST.GRANTED;
      if (!isAllGranted) break;
    }

    if (!isAllGranted) {
      if (Platform.OS === 'android') {
        for (const permission of APP_PERMISSION.ANDROID) {
          const req = await request(permission);
          results.push({
            name: permission,
            result: req,
          });
        }
      } else if (Platform.OS === 'ios') {
        for (const permission of APP_PERMISSION.IOS) {
          const req = await request(permission);
          results.push({
            name: permission,
            result: req,
          });
        }
      }
    }

    checks = await this.checkAll();
    isAllGranted = true;
    for (let e of checks) {
      isAllGranted = e.result === Permission.RESULTS_LIST.GRANTED;
      if (!isAllGranted) {
        break;
      }
    }

    return {
      isAllGranted: isAllGranted,
      results: results,
    };
  };

  static checkAll = async (isWithUnresolve = false) => {
    let checker: any = [];
    let results: any = [];
    if (Platform.OS === 'android') {
      APP_PERMISSION.ANDROID.forEach(e => {
        checker.push(check(e));
      });
      let checkResult = await Promise.all(checker);
      let i = 0;
      checkResult.forEach(e => {
        results.push({
          name: APP_PERMISSION.ANDROID[i],
          result: e,
        });
        i++;
      });
      checkResult = [];
    } else if (Platform.OS === 'ios') {
      if (!isWithUnresolve) {
        APP_PERMISSION.IOS.forEach(e => {
          if (e != APP_PERMISSION.IOS[2]) checker.push(check(e));
        });
      } else {
        APP_PERMISSION.IOS.forEach(e => {
          checker.push(check(e));
        });
      }

      let checkResult = await Promise.all(checker);
      let i = 0;
      checkResult.forEach(e => {
        results.push({
          name: APP_PERMISSION.IOS[i],
          result: e,
        });
        i++;
      });
      checkResult = [];
    }

    return results;
  };
}
