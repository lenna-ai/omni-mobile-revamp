import * as React from "react";

import {
  Text,
  View,
  Modal,
  Image,
  Platform,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

// Internal Import
import API from "./../../../../utils/api";
import { encodeHashIds } from "../../../../utils/encode";
import LoadingBig from "./../../../../assets/anime/loading_big.gif";
import { moderateScale, verticalScale } from "../../../other/Scaling";
import { getData, getDataWithParams } from "../../../../modules/services";

// External Import
import moment from "moment";
import { useSelector } from "react-redux";
import PureChart from "react-native-pure-chart";
import DateRangePicker from "react-native-daterange-picker";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const AgentAnaly = ({ navigation }) => {
  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  const [isLoading, setIsLoading] = React.useState(true);

  const [totalMessagesPerAgent, setTotalMessagesPerAgent] = React.useState(
    null
  );
  const [goConversitionPerAgent, setGoConversitionPerAgent] = React.useState(
    null
  );
  const [newConversitionPerAgent, setNewConversitionPerAgent] = React.useState(
    null
  );
  const [
    averageFirstAgentResponse,
    setAverageFirstAgentResponse
  ] = React.useState(null);
  const [
    resolveConversitionPerAgent,
    setResolveConversitionPerAgent
  ] = React.useState(null);
  const [
    averageConversitionPerAgent,
    setAverageConversitionPerAgent
  ] = React.useState(null);

  const [dailyMessagePerAgent, setDailyMessagePerAgent] = React.useState(null);
  const [
    dailyNewConversationPerAgent,
    setDailyNewConversationPerAgent
  ] = React.useState(null);

  const dateNow = new Date();
  const dateCustom = new Date(dateNow.getTime() - 6 * 24 * 60 * 60 * 1000);

  const [endDate, setEndDate] = React.useState(null);
  const [startDate, setStartDate] = React.useState(null);
  const [displayedDate, setDisplayedDate] = React.useState(moment());
  const [maxDate, setMaxDate] = React.useState(moment().set(dateNow));

  const [isClickFilter, setIsClickFilter] = React.useState(false);
  const [heightDaterange, setHeightDaterange] = React.useState(0);

  const [timeShow, setTimeShow] = React.useState(true);
  const [loadFirst, setLoadFirst] = React.useState(true);

  React.useEffect(() => {
    setStartDate(moment().set("date", dateCustom.getDate()));
    setEndDate(moment().set("date", dateNow.getDate()));

    loadDialyAgent();
  }, []);

  React.useEffect(
    () => {
      if (!loadFirst) {
        loadAllData(true);
      }
    },
    [loadFirst]
  );

  const loadDialyAgent = async () => {
    let dailyMsgPerAgent = await getDailyAgent("daily-messages-per-agent");
    let dailyNewPerAgent = await getDailyAgent(
      "daily-new-conversation-per-agent"
    );

    if (!dailyMsgPerAgent && !dailyNewPerAgent) {
      setLoadFirst(false);
    }
  };

  const getDailyAgent = async type => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };

    try {
      let res = await getData(
        API.PATH + encodeHashIds(dataUser.app_id) + "/dashboard/" + type,
        headers
      );

      if (res.success) {
        if (isObject(res.data)) {
          funSetDaily(type, res.data);
        }
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  };

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

    let isTotalMessgeAgent = await getDataDaily(
      dateSevenDayAgoFormat,
      dateNowFormat,
      "total-message-agent"
    );

    let isNewConversationAgent = await getDataDaily(
      dateSevenDayAgoFormat,
      dateNowFormat,
      "new-conversation-per-agent"
    );

    let isGoConversationAgent = await getDataDaily(
      dateSevenDayAgoFormat,
      dateNowFormat,
      "total-ongoing-conversation-per-agent"
    );

    let isResolveConversationAgent = await getDataDaily(
      dateSevenDayAgoFormat,
      dateNowFormat,
      "total-resolved-conversation-per-agent"
    );

    let averageConversationAgent = await getDataDaily(
      dateSevenDayAgoFormat,
      dateNowFormat,
      "average-conversation-duration-per-agent"
    );

    let averageFirstAgentResponse = await getDataDaily(
      dateSevenDayAgoFormat,
      dateNowFormat,
      "average-first-response-time-per-agent"
    );

    if (
      !isTotalMessgeAgent &&
      !isNewConversationAgent &&
      !isGoConversationAgent &&
      !isResolveConversationAgent &&
      !averageConversationAgent &&
      !averageFirstAgentResponse
    ) {
      setIsLoading(false);
    }
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
          funSetDaily(type, res.data);
        } else {
          funSetDaily(type, null);
        }
      } else {
        funSetDaily(type, null);
      }
    } catch (e) {
      funSetDaily(type, null);
    }
    return false;
  };

  const funSetDaily = (type, value) => {
    if (type == "total-message-agent") {
      value != null
        ? setTotalMessagesPerAgent(value.agent)
        : setTotalMessagesPerAgent(value);
    } else if (type == "new-conversation-per-agent") {
      value != null
        ? setNewConversitionPerAgent(value.new_conversation_per_agent)
        : setNewConversitionPerAgent(value);
    } else if (type == "total-ongoing-conversation-per-agent") {
      value != null
        ? setGoConversitionPerAgent(value.total_ongoing_room_conversation)
        : setGoConversitionPerAgent(value);
    } else if (type == "total-resolved-conversation-per-agent") {
      value != null
        ? setResolveConversitionPerAgent(value.total_resolved_room_conversation)
        : setResolveConversitionPerAgent(value);
    } else if (type == "average-conversation-duration-per-agent") {
      if (value != null) {
        let arrContain = [];
        value.average_conversation_duration_per_agent.series.data.map(function(
          item,
          i
        ) {
          let objContain = {
            name: value.average_conversation_duration_per_agent.categories[i],
            data: item
          };
          arrContain.push(objContain);
        });
        setAverageConversitionPerAgent(arrContain);
      } else {
        setAverageConversitionPerAgent(value);
      }
    } else if (type == "average-first-response-time-per-agent") {
      if (value != null) {
        let arrContain = [];
        value.average_first_response_time_per_agent.series.data.map(function(
          item,
          i
        ) {
          let objContain = {
            name: value.average_first_response_time_per_agent.categories[i],
            data: item
          };
          arrContain.push(objContain);
        });
        setAverageFirstAgentResponse(arrContain);
      } else {
        setAverageFirstAgentResponse(value);
      }
    } else if (type == "daily-messages-per-agent") {
      if (value != null) {
        let arrContain = [];
        value.daily_messages_per_agent.series.map(function(item, i) {
          let arrSubContain = [];

          item.data.map(function(itemA, a) {
            let objSubContain = {
              x: value.daily_messages_per_agent.categories[a],
              y: itemA
            };
            arrSubContain.push(objSubContain);
          });

          let colorRandom =
            "rgb(" +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            ")";

          let objContain = {
            seriesName: item.name,
            data: arrSubContain,
            color: colorRandom
          };
          arrContain.push(objContain);
        });
        setDailyMessagePerAgent(arrContain);
      } else {
        setDailyMessagePerAgent(value);
      }
    } else if (type == "daily-new-conversation-per-agent") {
      if (value != null) {
        let arrContain = [];
        value.daily_new_conversation_per_agent.series.map(function(item, i) {
          let arrSubContain = [];

          item.data.map(function(itemA, a) {
            let objSubContain = {
              x: value.daily_new_conversation_per_agent.categories[a],
              y: itemA
            };
            arrSubContain.push(objSubContain);
          });

          let objContain = {
            seriesName: item.name,
            data: arrSubContain,
            color: ChangeColorFunction()
          };
          arrContain.push(objContain);
        });
        setDailyNewConversationPerAgent(arrContain);
      } else {
        setDailyNewConversationPerAgent(arrContain);
      }
    }
  };

  const ChangeColorFunction = () => {
    let colorCode =
      "rgb(" +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      ")";
    return colorCode;
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

  const ContainAgent = () => {
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
            agent
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
      </View>
    );
  };

  const positionTop = x => {
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

  const itemNameUser = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-start",
          marginHorizontal: moderateScale(6)
        }}
      >
        <View
          style={{
            width: moderateScale(12),
            height: moderateScale(12),
            backgroundColor: item.color,
            marginRight: moderateScale(8),
            borderRadius: moderateScale(16)
          }}
        />

        <Text
          style={{
            color: "#000000",

            alignSelf: "flex-start",
            textTransform: "capitalize",
            fontSize: moderateScale(12)
          }}
        >
          {item.seriesName}
        </Text>
      </View>
    );
  };

  const ContainDailyNewConversationPerAgent = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: moderateScale(28)
        }}
      >
        <View
          style={{
            flex: 1,
            shadowColor: "#000",
            backgroundColor: "#fff",
            marginTop: moderateScale(5),
            paddingTop: moderateScale(16),
            borderRadius: moderateScale(10),
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
          {dailyNewConversationPerAgent != null
            ? <View style={{ flex: 1 }}>
                <FlatList
                  horizontal={true}
                  renderItem={itemNameUser}
                  data={dailyNewConversationPerAgent}
                  keyExtractor={(item, index) => index.toString()}
                  style={{
                    flex: 1,
                    alignSelf: "flex-end",
                    marginBottom: moderateScale(24)
                  }}
                />
                <ScrollView
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                >
                  <PureChart type="line" data={dailyNewConversationPerAgent} />
                </ScrollView>
              </View>
            : <View>
                <Text
                  style={{
                    color: "#000000",
                    alignSelf: "center",

                    textTransform: "capitalize",
                    fontSize: moderateScale(14),
                    marginTop: verticalScale(8),
                    marginBottom: moderateScale(8)
                  }}
                >
                  Data not found
                </Text>
              </View>}

          <Text
            style={{
              color: "#000000",
              fontWeight: "700",
              alignSelf: "center",

              fontSize: moderateScale(11)
            }}
          >
            Daily New Conversation per Agent
          </Text>
        </View>
      </View>
    );
  };

  const ContainDailyMessagePerAgent = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: moderateScale(28)
        }}
      >
        <View
          style={{
            flex: 1,
            shadowColor: "#000",
            backgroundColor: "#fff",
            marginTop: moderateScale(5),
            paddingTop: moderateScale(16),
            borderRadius: moderateScale(10),
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
          {dailyMessagePerAgent != null
            ? <View style={{ flex: 1 }}>
                <FlatList
                  horizontal={true}
                  renderItem={itemNameUser}
                  data={dailyMessagePerAgent}
                  keyExtractor={(item, index) => index.toString()}
                  style={{
                    flex: 1,
                    alignSelf: "flex-end",
                    marginBottom: moderateScale(24)
                  }}
                />
                <ScrollView
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                >
                  <PureChart type="line" data={dailyMessagePerAgent} />
                </ScrollView>
              </View>
            : <View>
                <Text
                  style={{
                    color: "#000000",
                    alignSelf: "center",

                    textTransform: "capitalize",
                    fontSize: moderateScale(14),
                    marginTop: verticalScale(8),
                    marginBottom: moderateScale(8)
                  }}
                >
                  Data not found
                </Text>
              </View>}

          <Text
            style={{
              color: "#000000",
              fontWeight: "700",
              alignSelf: "center",

              fontSize: moderateScale(11)
            }}
          >
            Daily Message per Agent
          </Text>
        </View>
      </View>
    );
  };

  const ContainAverageFirstnAgentResponse = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: moderateScale(28)
        }}
      >
        <View
          style={{
            flex: 1,
            shadowColor: "#000",
            backgroundColor: "#fff",
            marginTop: moderateScale(5),
            paddingTop: moderateScale(16),
            borderRadius: moderateScale(10),
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
            Average Agent First Response Time
          </Text>

          {averageFirstAgentResponse != null
            ? <ScrollView
                horizontal={true}
                showsVerticalScrollIndicator={false}
              >
                <VictoryChart
                  theme={VictoryTheme.material}
                  maxDomain={{ x: averageFirstAgentResponse.length }}
                  padding={{
                    top: moderateScale(40),
                    bottom: moderateScale(40),
                    left: moderateScale(160),
                    right: moderateScale(8)
                  }}
                >
                  <VictoryBar
                    y="data"
                    x="name"
                    horizontal
                    width={moderateScale(600)}
                    height={moderateScale(600)}
                    data={averageFirstAgentResponse}
                    style={{ data: { fill: "#5588C3" } }}
                  />
                </VictoryChart>
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

  const ContainAverageConversationAgent = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: moderateScale(28)
        }}
      >
        <View
          style={{
            flex: 1,
            shadowColor: "#000",
            backgroundColor: "#fff",
            marginTop: moderateScale(5),
            paddingTop: moderateScale(16),
            borderRadius: moderateScale(10),
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
            Average Conversation Duration per Agent
          </Text>

          {averageConversitionPerAgent != null
            ? <ScrollView
                horizontal={true}
                showsVerticalScrollIndicator={false}
              >
                <VictoryChart
                  theme={VictoryTheme.material}
                  maxDomain={{ x: averageConversitionPerAgent.length }}
                  padding={{
                    top: moderateScale(40),
                    bottom: moderateScale(40),
                    left: moderateScale(160),
                    right: moderateScale(8)
                  }}
                >
                  <VictoryBar
                    y="data"
                    x="name"
                    horizontal
                    width={moderateScale(600)}
                    height={moderateScale(600)}
                    data={averageConversitionPerAgent}
                    style={{ data: { fill: "#5588C3" } }}
                  />
                </VictoryChart>
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

  const ContainResolveConversationAgent = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: moderateScale(28)
        }}
      >
        <View
          style={{
            flex: 1,
            shadowColor: "#000",
            backgroundColor: "#fff",
            marginTop: moderateScale(5),
            paddingTop: moderateScale(16),
            borderRadius: moderateScale(10),
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
            Resolved Conversation per Agent
          </Text>

          {resolveConversitionPerAgent != null
            ? <ScrollView
                horizontal={true}
                showsVerticalScrollIndicator={false}
              >
                <VictoryChart
                  theme={VictoryTheme.material}
                  maxDomain={{ x: resolveConversitionPerAgent.length }}
                  padding={{
                    top: moderateScale(40),
                    bottom: moderateScale(40),
                    left: moderateScale(160),
                    right: moderateScale(8)
                  }}
                >
                  <VictoryBar
                    x="name"
                    horizontal
                    width={moderateScale(600)}
                    y="total_resolved_livechat"
                    height={moderateScale(600)}
                    data={resolveConversitionPerAgent}
                    style={{ data: { fill: "#5588C3" } }}
                  />
                </VictoryChart>
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

  const ContainOngoingConversationAgent = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: moderateScale(28)
        }}
      >
        <View
          style={{
            flex: 1,
            shadowColor: "#000",
            backgroundColor: "#fff",
            marginTop: moderateScale(5),
            paddingTop: moderateScale(16),
            borderRadius: moderateScale(10),
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
            Served Room Conversation per Agent
          </Text>

          {goConversitionPerAgent != null
            ? <ScrollView
                horizontal={true}
                showsVerticalScrollIndicator={false}
              >
                <VictoryChart
                  theme={VictoryTheme.material}
                  maxDomain={{ x: goConversitionPerAgent.length }}
                  padding={{
                    top: moderateScale(40),
                    bottom: moderateScale(40),
                    left: moderateScale(160),
                    right: moderateScale(8)
                  }}
                >
                  <VictoryBar
                    x="name"
                    horizontal
                    y="total_ongoing_livechat"
                    width={moderateScale(600)}
                    height={moderateScale(600)}
                    data={goConversitionPerAgent}
                    style={{ data: { fill: "#5588C3" } }}
                  />
                </VictoryChart>
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

  const ContainNewConversationAgent = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: moderateScale(28)
        }}
      >
        <View
          style={{
            flex: 1,
            shadowColor: "#000",
            backgroundColor: "#fff",
            marginTop: moderateScale(5),
            paddingTop: moderateScale(16),
            borderRadius: moderateScale(10),
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
            New Conversation per Agent
          </Text>

          {newConversitionPerAgent != null
            ? <ScrollView
                horizontal={true}
                showsVerticalScrollIndicator={false}
              >
                <VictoryChart
                  theme={VictoryTheme.material}
                  maxDomain={{ x: newConversitionPerAgent.length }}
                  padding={{
                    top: moderateScale(40),
                    bottom: moderateScale(40),
                    left: moderateScale(160),
                    right: moderateScale(8)
                  }}
                >
                  <VictoryBar
                    x="name"
                    horizontal
                    width={moderateScale(600)}
                    height={moderateScale(600)}
                    y="new_conversation_per_agent"
                    data={newConversitionPerAgent}
                    style={{ data: { fill: "#5588C3" } }}
                  />
                </VictoryChart>
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

  const ContainTotalMessagesAgent = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            shadowColor: "#000",
            backgroundColor: "#fff",
            marginTop: moderateScale(5),
            paddingTop: moderateScale(16),
            borderRadius: moderateScale(10),
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
            Total Messages per Agent
          </Text>

          {totalMessagesPerAgent != null
            ? <ScrollView
                horizontal={true}
                showsVerticalScrollIndicator={false}
              >
                <VictoryChart
                  theme={VictoryTheme.material}
                  maxDomain={{ x: totalMessagesPerAgent.length }}
                  padding={{
                    top: moderateScale(40),
                    bottom: moderateScale(40),
                    left: moderateScale(160),
                    right: moderateScale(8)
                  }}
                >
                  <VictoryBar
                    x="name"
                    horizontal
                    y="total_message"
                    width={moderateScale(600)}
                    height={moderateScale(600)}
                    data={totalMessagesPerAgent}
                    style={{ data: { fill: "#5588C3" } }}
                  />
                </VictoryChart>
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
                <ContainAgent />
                <ContainTotalMessagesAgent />
                <ContainNewConversationAgent />
                <ContainOngoingConversationAgent />
                <ContainResolveConversationAgent />
                <ContainAverageConversationAgent />
                <ContainAverageFirstnAgentResponse />
                <ContainDailyMessagePerAgent />
                <ContainDailyNewConversationPerAgent />
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

export default React.memo(AgentAnaly);
