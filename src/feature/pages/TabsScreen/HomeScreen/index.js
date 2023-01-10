import * as React from "react";
import API from "./../../../../utils/api";
import HeaderHome from "./components/HeaderHome";
import OfficeHourHome from "./components/OfficeHourHome";

import { View, StyleSheet } from "react-native";
import { getValue } from "../../../../modules/localData";
import { getData } from "../../../../modules/services";
import { useDispatch, useSelector } from "react-redux";
import { addDataUserWasLogin } from "../../../../modules/redux/actions/inDataUserLogin";
import { encodeHashIds } from "../../../../utils/encode";
import {
  addDataOfficeHour,
  loadDataOfficeHour
} from "../../../../modules/redux/actions/inOfficeHour";

export default (Home = () => {
  const dispatch = useDispatch();
  const disDataLogin = useSelector(state => state.mDataUserLogin);
  const containData = disDataLogin.dataUserWasLogin;

  React.useEffect(() => {
    dispatch(loadDataOfficeHour(true));
    getValueUser();
  }, []);

  const getValueUser = async () => {
    try {
      let data = await getValue("DATA_LOGIN");
      // console.log("DATA_HEADER_SCREEN", data);
      dispatch(addDataUserWasLogin(data));
      getDataOfficeHour();
    } catch (e) {
      console.log(e);
    }
  };

  const getDataOfficeHour = async () => {
    let headers = {
      token: containData.token,
      userId: encodeHashIds(containData.user_id)
    };

    let data = await getData(
      API.PATH + encodeHashIds(containData.app_id) + "/get-office-hour",
      headers
    );
    if (data.success) {
      dispatch(addDataOfficeHour(data.data));
      dispatch(loadDataOfficeHour(false));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "#fff" }]}>
      <HeaderHome />
      <OfficeHourHome />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
