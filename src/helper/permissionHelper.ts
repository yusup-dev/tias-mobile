import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

const APP_PERMISSION = {
  ANDROID: [
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    // PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,

    PERMISSIONS.ANDROID.CALL_PHONE,
  ],
  IOS: [
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.IOS.PHOTO_LIBRARY,
    PERMISSIONS.ANDROID.CALL_PHONE,
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
        let req = await request(APP_PERMISSION.ANDROID[0]);
        results.push({
          name: APP_PERMISSION.ANDROID[0],
          result: req,
        });

        req = await request(APP_PERMISSION.ANDROID[1]);
        results.push({
          name: APP_PERMISSION.ANDROID[1],
          result: req,
        });

        req = await request(APP_PERMISSION.ANDROID[2]);
        results.push({
          name: APP_PERMISSION.ANDROID[2],
          result: req,
        });

        req = await request(APP_PERMISSION.ANDROID[3]);
        results.push({
          name: APP_PERMISSION.ANDROID[3],
          result: req,
        });
        req = await request(APP_PERMISSION.ANDROID[4]);
        results.push({
          name: APP_PERMISSION.ANDROID[4],
          result: req,
        });
      } else if (Platform.OS === 'ios') {
        let req = await request(APP_PERMISSION.IOS[0]);
        results.push({
          name: APP_PERMISSION.IOS[0],
          result: req,
        });

        req = await request(APP_PERMISSION.IOS[1]);
        results.push({
          name: APP_PERMISSION.IOS[1],
          result: req,
        });

        req = await request(APP_PERMISSION.IOS[2]);
        results.push({
          name: APP_PERMISSION.IOS[2],
          result: req,
        });
      }

      checks = await this.checkAll();
      isAllGranted = true;
      for (let e of checks) {
        isAllGranted = e.result === Permission.RESULTS_LIST.GRANTED;
        if (!isAllGranted) break;
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
