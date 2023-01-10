import * as React from "react";

import {
  Text,
  View,
  Modal,
  Image,
  Platform,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";

// Internal Import
import API from "./../../../../utils/api";
import { encodeHashIds } from "../../../../utils/encode";
import { getDataWithParams } from "../../../../modules/services";
import LoadingBig from "./../../../../assets/anime/loading_big.gif";
import { moderateScale, verticalScale } from "../../../other/Scaling";

// Image Import
import { imageIconOverallMessages } from "../../../../assets/icons";

// External Import
import moment from "moment";
import { useSelector } from "react-redux";
import { LineChart } from "react-native-chart-kit";
import DateRangePicker from "react-native-daterange-picker";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const dataBase = [
  "#0087d3",
  "#1d95d8",
  "#3aa2dd",
  "#56b0e2",
  "#73bde7",
  "#90cbec",
  "#add8f1",
  "#7285A5",
  "#008081",
  "1D2951",
  "#4C516D"
];

const chartConfig = {
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  backgroundGradientTo: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientFromOpacity: 0,
  useShadowColorFromDataset: false,
  backgroundGradientToOpacity: 0.1,
  color: (opacity = 1) => `rgba(0, 135, 211, ${opacity})`
};

const ChatAnaly = ({ navigation }) => {
  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  const [isLoading, setIsLoading] = React.useState(false);

  const [totalHsm, setTotalHsm] = React.useState(0);
  const [averageMessage, setAverageMessage] = React.useState(0);
  const [averageConversation, setAverageConversation] = React.useState(0);

  const [dailyMessage, setDailyMessage] = React.useState(null);
  const [dailyServerConver, setDailyServerConver] = React.useState(null);
  const [dailyResolvedConver, setDailyResolvedConver] = React.useState(null);

  const dateNow = new Date();
  const dateCustom = new Date(dateNow.getTime() - 6 * 24 * 60 * 60 * 1000);

  const [endDate, setEndDate] = React.useState(null);
  const [startDate, setStartDate] = React.useState(null);
  const [displayedDate, setDisplayedDate] = React.useState(moment());
  const [maxDate, setMaxDate] = React.useState(moment().set(dateNow));

  const [isClickFilter, setIsClickFilter] = React.useState(false);
  const [heightDaterange, setHeightDaterange] = React.useState(0);

  const [timeShow, setTimeShow] = React.useState(true);

  React.useEffect(() => {
    setStartDate(moment().set("date", dateCustom.getDate()));
    setEndDate(moment().set("date", dateNow.getDate()));
    loadAllData(true);
  }, []);

  const loadAllData = async isFirst => {
    setIsLoading(true);

    const dataFormat = "YYYY-MM-DD";

    let dateNowFormat = null;
    let dateSevenDayAgoFormat = null;

    if (isFirst) {
      let dateSevenDayAgo = new Date(dateNow - 6 * 24 * 60 * 60 * 1000);

      dateNowFormat = moment(dateNow).format(dataFormat);
      dateSevenDayAgoFormat = moment(dateSevenDayAgo).format(dataFormat);
    } else {
      dateNowFormat = moment(endDate).format(dataFormat);
      dateSevenDayAgoFormat = moment(startDate).format(dataFormat);
    }
    let isDailyMsg = await getDataDaily(
      dateSevenDayAgoFormat,
      dateNowFormat,
      "daily-message"
    );

    let isDailyServerConver = await getDataDaily(
      dateSevenDayAgoFormat,
      dateNowFormat,
      "daily-ongoing-room-conversation"
    );

    let isDailyResolvedConver = await getDataDaily(
      dateSevenDayAgoFormat,
      dateNowFormat,
      "daily-resolved-room-conversation"
    );

    let isDailyAverConver = await getDataDailyMsg(
      dateSevenDayAgoFormat,
      dateNowFormat,
      "average-conversation-duration"
    );
    let isDailyAverMsg = await getDataDailyMsg(
      dateSevenDayAgoFormat,
      dateNowFormat,
      "average-message-per-conversation"
    );
    let isDailyTotalHsm = await getDataDailyMsg(
      dateSevenDayAgoFormat,
      dateNowFormat,
      "total-hsm"
    );

    if (
      isDailyMsg == false &&
      isDailyServerConver == false &&
      isDailyResolvedConver == false &&
      isDailyAverConver == false &&
      isDailyAverMsg == false &&
      isDailyTotalHsm == false
    ) {
      setIsLoading(false);
    }
  };

  const getDataDailyMsg = async (startFilter, endFilter, type) => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };

    let params = {
      start: startFilter,
      end: endFilter
    };

    try {
      let res = await getDataWithParams(
        API.PATH + encodeHashIds(dataUser.app_id) + "/dashboard/" + type,
        params,
        headers
      );

      if (res.success) {
        if (res.data != null) {
          if (type == "average-conversation-duration") {
            setAverageConversation(res.data);
          } else if (type == "average-message-per-conversation") {
            setAverageMessage(res.data);
          } else if (type == "total-hsm") {
            setTotalHsm(res.data);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  };

  const isObject = a => {
    return !!a && a.constructor === Object;
  };

  const getDataDaily = async (startFilter, endFilter, type) => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };

    let params = {
      start: startFilter,
      end: endFilter
    };

    try {
      let res = await getDataWithParams(
        API.PATH + encodeHashIds(dataUser.app_id) + "/dashboard/" + type,
        params,
        headers
      );

      if (res.success) {
        if (isObject(res.data)) {
          if (type != "daily-message") {
            console.log("daily-message", res);
            console.log("daily-message_params", params);
          }

          let arrDailyKey = [];
          let arrDataDaily = [];

          Object.entries(res.data).forEach(value => {
            let dateDaily = new Date(value[0]);

            let monthShortNames = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
            ];

            let monthAndDay =
              dateDaily.getDate() + " " + monthShortNames[dateDaily.getMonth()];

            arrDailyKey.push(monthAndDay);
            arrDataDaily.push(value[1]);
          });

          let objDataSet = [
            {
              data: arrDataDaily
            }
          ];

          let allDailyMsg = {
            labels: arrDailyKey,
            datasets: objDataSet
          };

          if (type == "daily-message") {
            setDailyMessage(allDailyMsg);
          } else if (type == "daily-ongoing-room-conversation") {
            setDailyServerConver(allDailyMsg);
          } else if (type == "daily-resolved-room-conversation") {
            setDailyResolvedConver(allDailyMsg);
          }
        } else {
          funSetDaily(type);
        }
      } else {
        funSetDaily(type);
      }
    } catch (e) {
      funSetDaily(type);
    }
    return false;
  };

  const funSetDaily = type => {
    if (type == "daily-message") {
      setDailyMessage(null);
    } else if (type == "daily-ongoing-room-conversation") {
      setDailyServerConver(null);
    } else if (type == "daily-resolved-room-conversation") {
      setDailyResolvedConver(null);
    }
  };

  React.useEffect(
    () => {
      if (heightDaterange > 0) {
        setTimeShow(true);
      }
    },
    [heightDaterange]
  );

  const setDates = dates => {
    console.log("datess", dates);
    if (dates.startDate != null && dates.endDate != null) {
      setStartDate(dates.startDate);
      setEndDate(dates.endDate);
    } else {
      if (dates.startDate != null) {
        setStartDate(dates.startDate);
      }
      setEndDate(dates.endDate);
    }

    if (dates.displayedDate != null) {
      setTimeShow(false);
      setDisplayedDate(dates.displayedDate);
    }
  };

  const ItemContainChat = ({
    title,
    subTitle,
    imageTitle,
    isActive,
    userActive
  }) => {
    let dataUser = "";
    let isUserActive = false;

    if (isActive != null) {
      isUserActive = isActive;
      dataUser = userActive;
    }

    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: moderateScale(8)
        }}
      >
        <View
          style={{
            height: 154,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 8,
            backgroundColor: "#fff",
            justifyContent: "center",
            height: verticalScale(76),
            width: (dimenWidth - moderateScale(48)) / 2 - moderateScale(3),

            //Shadow
            shadowOffset: {
              width: 0,
              height: 1
            },
            elevation: 5,
            shadowRadius: 1,
            shadowOpacity: 0.1,
            shadowColor: "#000",
            borderRadius: moderateScale(10)
          }}
        >
          <View />
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: moderateScale(14),
                  fontWeight: "bold"
                }}
              >
                {title}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: moderateScale(11)
                }}
              >
                {subTitle}
              </Text>
            </View>
            {imageTitle}
          </View>

          {isUserActive
            ? <View>
                <Text
                  style={{
                    color: "#003473",

                    fontSize: moderateScale(11)
                  }}
                >
                  Active Users {dataUser}
                </Text>
              </View>
            : null}
        </View>
      </View>
    );
  };

  const ContainChat = () => {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: verticalScale(6),
            justifyContent: "space-between"
          }}
        >
          <Text
            style={{
              color: "#000000",

              alignSelf: "flex-start",
              textTransform: "capitalize",
              fontSize: moderateScale(24),
              marginBottom: moderateScale(4)
            }}
          >
            chat
          </Text>
          <TouchableOpacity
            onPress={() => setIsClickFilter(true)}
            style={{
              borderWidth: 1,
              borderColor: "#5588C3",
              paddingTop: moderateScale(4),
              borderRadius: moderateScale(6),
              paddingBottom: moderateScale(7),
              paddingHorizontal: moderateScale(8)
            }}
          >
            <Text
              style={{
                color: "#5588C3",

                fontSize: moderateScale(14)
              }}
            >
              Custom Range
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row" }}>
          <ItemContainChat
            title={averageConversation.toString()}
            subTitle={"Average Conversation Duration"}
            imageTitle={imageIconOverallMessages(
              moderateScale(38),
              moderateScale(38)
            )}
          />
          <View style={{ width: moderateScale(6) }} />
          <ItemContainChat
            title={averageMessage.toString()}
            subTitle={"Average Messages per Conversation"}
            imageTitle={imageIconOverallMessages(
              moderateScale(38),
              moderateScale(38)
            )}
          />
        </View>
        <View
          style={{ flexDirection: "row", flex: 1, justifyContent: "center" }}
        >
          <ItemContainChat
            title={totalHsm.toString()}
            subTitle={"Total Message"}
            imageTitle={imageIconOverallMessages(
              moderateScale(38),
              moderateScale(38)
            )}
          />
        </View>
      </View>
    );
  };

  const positionTop = x => {
    console.log("xxxten", x);
    if (x != heightDaterange) {
      setHeightDaterange(x);
    }
  };

  const onFilterDate = () => {
    setIsClickFilter(false);
    setHeightDaterange(0);

    loadAllData(false);
  };

  const onCancelDate = () => {
    setIsClickFilter(false);
    setHeightDaterange(0);

    setStartDate(moment().set("date", dateCustom.getDate()));
    setEndDate(moment().set("date", dateNow.getDate()));
    loadAllData(true);
  };

  const onCloseDate = () => {
    setIsClickFilter(false);
    setHeightDaterange(0);
  };

  const containHeader = () => {
    if (timeShow) {
      return (
        <View
          style={{
            alignSelf: "center",
            zIndex: 2147483650,
            position: "absolute",
            flexDirection: "row",
            width: dimenWidth * 0.85,
            justifyContent: "space-between",
            top: heightDaterange - verticalScale(38)
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              marginRight: moderateScale(8),
              borderRadius: moderateScale(24),
              paddingVertical: moderateScale(4),
              paddingHorizontal: moderateScale(4)
            }}
            onPress={() => onCloseDate()}
          >
            <Image
              resizeMode="contain"
              style={{ width: moderateScale(24), height: moderateScale(24) }}
              source={require("./../../../../assets/image/ic_close_round.png")}
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-end"
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#ED5653",
                marginRight: moderateScale(8),
                borderRadius: moderateScale(12),
                paddingVertical: moderateScale(4),
                paddingHorizontal: moderateScale(12)
              }}
              onPress={() => onCancelDate()}
            >
              <Text
                style={{
                  color: "#ffffff",

                  alignSelf: "flex-start",
                  textTransform: "capitalize",
                  fontSize: moderateScale(16),
                  marginBottom: moderateScale(3)
                }}
              >
                reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#5588C3",
                borderRadius: moderateScale(12),
                paddingVertical: moderateScale(4),
                paddingHorizontal: moderateScale(12)
              }}
              onPress={() => onFilterDate()}
            >
              <Text
                style={{
                  color: "#ffffff",

                  alignSelf: "flex-start",
                  textTransform: "capitalize",
                  fontSize: moderateScale(16),
                  marginBottom: moderateScale(3)
                }}
              >
                apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  const ContainDailyServedConver = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: moderateScale(28)
        }}
      >
        <View
          style={{
            width: "100%",
            shadowColor: "#000",
            backgroundColor: "#fff",
            marginTop: moderateScale(5),
            borderRadius: moderateScale(10),
            paddingTop: moderateScale(16),
            paddingBottom: moderateScale(20),
            paddingHorizontal: moderateScale(18),
            //shadow
            shadowOffset: {
              width: 0,
              height: 2
            },
            elevation: 5,
            shadowRadius: 3.84,
            shadowOpacity: 0.25
          }}
        >
          <Text
            style={{
              color: "#000000",
              fontWeight: "700",

              alignSelf: "flex-start",
              textTransform: "capitalize",
              fontSize: moderateScale(14)
            }}
          >
            Daily Served Conversation
          </Text>

          {dailyServerConver != null
            ? <ScrollView
                style={{ flex: 1 }}
                horizontal={true}
                showsVerticalScrollIndicator={false}
              >
                <LineChart
                  withDots={false}
                  withShadow={false}
                  data={dailyServerConver}
                  height={moderateScale(300)}
                  chartConfig={chartConfig}
                  verticalLabelRotation={90}
                  style={{
                    marginTop: moderateScale(16),
                    marginBottom: moderateScale(8)
                  }}
                  width={
                    dailyServerConver.labels.length > 12
                      ? dailyServerConver.labels.length /
                          12 *
                          (dimenWidth - moderateScale(48)) +
                        moderateScale(5)
                      : dimenWidth - moderateScale(48) + moderateScale(5)
                  }
                />
              </ScrollView>
            : <View>
                <Text
                  style={{
                    color: "#000000",

                    alignSelf: "flex-start",
                    textTransform: "capitalize",
                    fontSize: moderateScale(14),
                    marginTop: verticalScale(8)
                  }}
                >
                  Data not found
                </Text>
              </View>}
        </View>
      </View>
    );
  };

  const ContainDailyResolvedConver = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: moderateScale(28)
        }}
      >
        <View
          style={{
            width: "100%",
            shadowColor: "#000",
            backgroundColor: "#fff",
            marginTop: moderateScale(5),
            borderRadius: moderateScale(10),
            paddingTop: moderateScale(16),
            paddingBottom: moderateScale(20),
            paddingHorizontal: moderateScale(18),
            //shadow
            shadowOffset: {
              width: 0,
              height: 2
            },
            elevation: 5,
            shadowRadius: 3.84,
            shadowOpacity: 0.25
          }}
        >
          <Text
            style={{
              color: "#000000",
              fontWeight: "700",

              alignSelf: "flex-start",
              textTransform: "capitalize",
              fontSize: moderateScale(14)
            }}
          >
            Daily Resolved Conversation
          </Text>

          {dailyResolvedConver != null
            ? <ScrollView
                style={{ flex: 1 }}
                horizontal={true}
                showsVerticalScrollIndicator={false}
              >
                <LineChart
                  withDots={false}
                  withShadow={false}
                  data={dailyResolvedConver}
                  height={moderateScale(300)}
                  chartConfig={chartConfig}
                  verticalLabelRotation={90}
                  style={{
                    marginTop: moderateScale(16),
                    marginBottom: moderateScale(8)
                  }}
                  width={
                    dailyResolvedConver.labels.length > 12
                      ? dailyResolvedConver.labels.length /
                          12 *
                          (dimenWidth - moderateScale(48)) +
                        moderateScale(5)
                      : dimenWidth - moderateScale(48) + moderateScale(5)
                  }
                />
              </ScrollView>
            : <View>
                <Text
                  style={{
                    color: "#000000",

                    alignSelf: "flex-start",
                    textTransform: "capitalize",
                    fontSize: moderateScale(14),
                    marginTop: verticalScale(8)
                  }}
                >
                  Data not found
                </Text>
              </View>}
        </View>
      </View>
    );
  };

  const ContainDailyMessage = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: moderateScale(28)
        }}
      >
        <View
          style={{
            width: "100%",
            shadowColor: "#000",
            backgroundColor: "#fff",
            marginTop: moderateScale(5),
            borderRadius: moderateScale(10),
            paddingTop: moderateScale(16),
            paddingBottom: moderateScale(20),
            paddingHorizontal: moderateScale(18),
            //shadow
            shadowOffset: {
              width: 0,
              height: 2
            },
            elevation: 5,
            shadowRadius: 3.84,
            shadowOpacity: 0.25
          }}
        >
          <Text
            style={{
              color: "#000000",
              fontWeight: "700",

              alignSelf: "flex-start",
              textTransform: "capitalize",
              fontSize: moderateScale(14)
            }}
          >
            Daily Message
          </Text>

          {dailyMessage != null
            ? <ScrollView
                horizontal={true}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, paddingTop: moderateScale(12) }}
              >
                <LineChart
                  bezier
                  withDots={false}
                  data={dailyMessage}
                  height={moderateScale(300)}
                  chartConfig={chartConfig}
                  verticalLabelRotation={90}
                  width={
                    dailyMessage.labels.length > 12
                      ? dailyMessage.labels.length /
                        12 *
                        (dimenWidth - moderateScale(48))
                      : dimenWidth - moderateScale(48)
                  }
                  style={{
                    marginTop: moderateScale(16),
                    marginBottom: moderateScale(8)
                  }}
                />
              </ScrollView>
            : <View>
                <Text
                  style={{
                    color: "#000000",

                    alignSelf: "flex-start",
                    textTransform: "capitalize",
                    fontSize: moderateScale(14),
                    marginTop: verticalScale(8)
                  }}
                >
                  Data not found
                </Text>
              </View>}
        </View>
      </View>
    );
  };

  const ContainChartDailyHsm = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: moderateScale(28)
        }}
      >
        <View
          style={{
            width: "100%",
            shadowColor: "#000",
            alignItems: "center",
            backgroundColor: "#fff",
            marginTop: moderateScale(5),
            borderRadius: moderateScale(10),
            paddingVertical: moderateScale(16),
            paddingHorizontal: moderateScale(18),
            //shadow
            shadowOffset: {
              width: 0,
              height: 2
            },
            elevation: 5,
            shadowRadius: 3.84,
            shadowOpacity: 0.25
          }}
        >
          <Text
            style={{
              color: "#000000",
              fontWeight: "700",

              alignSelf: "flex-start",
              textTransform: "capitalize",
              fontSize: moderateScale(14)
            }}
          >
            Daily Hsm
          </Text>

          <View>
            <Text
              style={{
                color: "#000000",

                alignSelf: "flex-start",
                textTransform: "capitalize",
                fontSize: moderateScale(14),
                marginTop: verticalScale(8)
              }}
            >
              Data not found
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading
        ? <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff"
            }}
          >
            <Image
              style={{ height: 80, width: 80 }}
              resizeMode="contain"
              source={LoadingBig}
              autoPlay
            />
          </View>
        : <View style={styles.container}>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  alignSelf: "center",
                  marginVertical: moderateScale(18),
                  marginHorizontal: moderateScale(8),
                  width: dimenWidth - moderateScale(48)
                }}
              >
                <ContainChat />
                <ContainDailyMessage />
                <ContainChartDailyHsm />
                <ContainDailyServedConver />
                <ContainDailyResolvedConver />
              </View>
            </ScrollView>
          </View>}
      <Modal transparent={true} visible={isClickFilter}>
        <View>
          <DateRangePicker
            range
            maxDate={maxDate}
            endDate={endDate}
            onChange={setDates}
            open={isClickFilter}
            startDate={startDate}
            displayedDate={displayedDate}
            layoutChange={x => positionTop(x)}
          />

          {containHeader()}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default React.memo(ChatAnaly);
