import * as React from "react";
import IconBell from "./../../../../../assets/image/icon_bell.svg";
import LinearGradient from "react-native-linear-gradient";

import { Text, View, Platform, StyleSheet, Dimensions } from "react-native";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const dimenWidth = Dimensions.get("screen").width;

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
export default (HeaderHome = ({ name, date, loading }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  });

  const HeaderContent = () => {
    return (
      <View style={[styles.containerHeader]}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <Text numberOfLines={1} style={styles.textHeaderTitle}>
            Hi, Your Name
          </Text>
          <Text numberOfLines={1} style={styles.textHeaderSubTitle}>
            Have a good
          </Text>
        </View>
        <IconBell width={22} height={24} />
      </View>
    );
  };

  const HeaderContentShimmer = () => {
    return (
      <ShimmerPlaceHolder
        height={60}
        autoRun={true}
        width={dimenWidth - 48}
        style={styles.continerShimmerHeaderHome}
      />
    );
  };

  const HeaderComponent = () => {
    if (isLoading) {
      return <HeaderContentShimmer />;
    } else {
      return <HeaderContent />;
    }
  };

  return (
    <View style={{ alignItems: "center" }}>
      <HeaderComponent />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerHeader: {
    height: 60,
    marginTop: 30,
    borderRadius: 10,
    marginBottom: 11,
    alignItems: "center",
    flexDirection: "row",
    width: dimenWidth - 48,
    justifyContent: "space-between"
  },
  textHeaderTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 2,
    marginRight: 30,
    color: "#2E3034",
    fontWeight: "bold",

    textTransform: "capitalize"
  },
  textHeaderSubTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginRight: 30,
    marginBottom: 4,
    color: "#2E3034"
  },
  continerShimmerHeaderHome: {
    marginTop: 30,
    borderRadius: 10,
    marginBottom: 11
  }
});
