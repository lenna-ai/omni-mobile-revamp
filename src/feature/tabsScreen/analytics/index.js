import * as React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// External Import
import { Header } from "react-native-elements";
import IconBack from "./../../../assets/image/icon_back.svg";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";
import AgentAnaly from "./components/AgentAnaly";
import GeneralAnaly from "./components/GeneralAnaly";
import ChatAnaly from "./components/ChatAnaly";

const Analytics = ({ route, navigation }) => {
  const [topBar, setTopBar] = React.useState(1);
  const headerComponent = () => {
    return (
      <Header
        placement="left"
        centerComponent={() => {
          return (
            <View style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "96%",
                  height: 43
                }}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <IconBack />
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 24,
                    marginLeft: 6,
                    color: "#000000",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                  }}
                >
                  analytics
                </Text>
              </View>
            </View>
          );
        }}
        containerStyle={{
          height: 88,
          paddingTop: 5,
          marginHorizontal: -12,
          backgroundColor: "#ffffff",
          justifyContent: "center",
          borderBottomColor: "#E5E5E5"
        }}
      />
    );
  };

  const renderContent = topBar => {
    switch (topBar) {
      case 1:
        return <GeneralAnaly route={route} navigation={navigation} />;
      case 2:
        return <ChatAnaly navigation={navigation} />;
      case 3:
        return <AgentAnaly />;
      default:
        return <GeneralAnaly route={route} navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      {headerComponent()}
      <View style={styles.container}>
        <View style={styles.flexRow}>
          <TouchableOpacity
            style={{
              ...styles.btnTop,
              backgroundColor: topBar === 1 ? "lightgrey" : "white"
            }}
            onPress={() => {
              setTopBar(1);
            }}
          >
            <Text>General</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.btnTop,
              backgroundColor: topBar === 2 ? "lightgrey" : "white"
            }}
            onPress={() => {
              setTopBar(2);
            }}
          >
            <Text>Agent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.btnTop,
              backgroundColor: topBar === 3 ? "lightgrey" : "white"
            }}
            onPress={() => {
              setTopBar(3);
            }}
          >
            <Text>Chat</Text>
          </TouchableOpacity>
        </View>
        {renderContent(topBar)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginHorizontal: 18,
    paddingHorizontal: 18,
    backgroundColor: "white"
  },
  btnTop: {
    flex: 1,
    height: 40,
    backgroundColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Analytics;
