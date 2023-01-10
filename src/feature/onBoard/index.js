import * as React from "react";

import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  LogBox
} from "react-native";

// Import External
import AppIntroSlider from "react-native-app-intro-slider";

// Import Internal
import { saveData } from "./../../modules/localData";
import { AuthContext } from "./../../modules/navigation/navigationContext";

import {
  imageChevronRight,
  imageIllustrationSplash1,
  imageIllustrationSplash2,
  imageIllustrationSplash3,
  imageIllustrationSplash4
} from "./../../assets/icons";
import { moderateScale } from "../other/Scaling";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;

const OnBoard = ({ navigation }) => {
  const { boardFun } = React.useContext(AuthContext);
  const [indexSlide, setIndexSlide] = React.useState(0);
  const refOnBoard = React.useRef();

  const slides = [
    {
      key: 0,
      title: "wider range of services",
      text:
        "As an agent, now you can handle many customers from different channels and will not lose the conversations anymore.",
      image: imageIllustrationSplash1(dimenWidth, moderateScale(300))
    },
    {
      key: 1,
      title: "Play as a bot-agent team",
      text:
        "As an agent, now you can handle many customers from different channels and will not lose the conversations anymore.",
      image: imageIllustrationSplash2(dimenWidth, moderateScale(300))
    },
    {
      key: 2,
      title: "Helps Immediately Obtained",
      text:
        "Every time you have trouble in serving customers, you can ask for help to your friends who can help, no more headaches.",
      image: imageIllustrationSplash3(dimenWidth, moderateScale(300))
    },
    {
      key: 3,
      title: "WFH? No problem!",
      text:
        "Now agent can handle customers from everywhere at anytime. No matter with this global pandemic situation, your customers need to be served.",
      image: imageIllustrationSplash4(dimenWidth, moderateScale(300))
    }
  ];

  const goToLogin = () => {
    saveData("IS_ON_BOARD", true);
    boardFun();
  };

  const _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        {item.image}
        <Text style={styles.containTitle}>
          {item.title}
        </Text>
        <Text style={styles.containSubTitle}>
          {item.text}
        </Text>
      </View>
    );
  };

  const onDotComponent = () => {
    if (indexSlide < 3) {
      return (
        <View style={{ flexDirection: "row" }}>
          <View
            style={[
              styles.containSubDot,
              { backgroundColor: indexSlide == 0 ? "#5588C3" : "#E0E0E0" }
            ]}
          />
          <View
            style={[
              styles.containSubDot,
              { backgroundColor: indexSlide == 1 ? "#5588C3" : "#E0E0E0" }
            ]}
          />
          <View
            style={[
              styles.containSubDot,
              { backgroundColor: indexSlide == 2 ? "#5588C3" : "#E0E0E0" }
            ]}
          />
          <View
            style={[
              styles.containSubDot,
              { backgroundColor: indexSlide == 3 ? "#5588C3" : "#E0E0E0" }
            ]}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  const onButtonNext = () => {
    return (
      <TouchableOpacity
        onPress={() => refOnBoard.current.goToSlide(indexSlide + 1, true)}
        style={styles.containNext}
      >
        {imageChevronRight(moderateScale(12), moderateScale(20))}
      </TouchableOpacity>
    );
  };

  const _renderPagination = activeIndex => {
    setIndexSlide(activeIndex);
    return null;
  };

  const condActiveIndex = () => {
    if (indexSlide < 3) {
      return (
        <View style={styles.styleActiveIndex}>
          {onDotComponent()}
          {onButtonNext()}
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity
            onPress={() => goToLogin()}
            style={styles.containDone}
          >
            <Text style={styles.containTextDot}>Let’s start</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const onButtonSkip = () => {
    if (indexSlide < 3) {
      return (
        <View style={styles.styleButtonSkip}>
          <TouchableOpacity
            onPress={() => refOnBoard.current.goToSlide(slides.length, true)}
          >
            <Text style={styles.txtSkip}>Skip</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <AppIntroSlider
        data={slides}
        ref={refOnBoard}
        showNextButton={false}
        showDoneButton={false}
        dotStyle={{ opacity: 0 }}
        dotClickEnabled={false}
        renderItem={_renderItem}
        style={{ backgroundColor: "#fff" }}
        onSlideChange={e => setIndexSlide(e)}
      />

      <View style={styles.containActiveIndex}>
        {condActiveIndex()}
      </View>

      {onButtonSkip()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  slide: {
    flex: 0.89,
    alignItems: "center",
    justifyContent: "center"
  },
  containTitle: {
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
    fontSize: moderateScale(22),
    marginTop: moderateScale(20),
    marginBottom: moderateScale(20)
  },
  containSubTitle: {
    color: "#4F4F4F",
    textAlign: "center",
    fontSize: moderateScale(16),
    lineHeight: moderateScale(20),
    marginHorizontal: dimenWidth / moderateScale(10)
  },
  containSubDot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(10 / 2),
    marginHorizontal: moderateScale(3)
  },
  containNext: {
    alignItems: "center",
    justifyContent: "center",
    width: moderateScale(47),
    height: moderateScale(47),
    backgroundColor: "#2889C6",
    borderRadius: moderateScale(47 / 2)
  },
  containDone: {
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(44),
    backgroundColor: "#2889C6",
    borderRadius: moderateScale(8),
    width: dimenWidth - moderateScale(60)
  },
  containTextDot: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22)
  },
  txtSkip: {
    color: "#2889C6",
    fontSize: moderateScale(16)
  },
  styleActiveIndex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  styleButtonSkip: {
    position: "absolute",
    alignItems: "flex-end",
    top: dimenHeight / moderateScale(20),
    width: dimenWidth - moderateScale(60),
    marginHorizontal: moderateScale(30)
  },
  containActiveIndex: {
    position: "absolute",
    height: moderateScale(50),
    width: dimenWidth - moderateScale(60),
    marginHorizontal: moderateScale(30),
    bottom: dimenHeight / moderateScale(15)
  }
});

export default OnBoard;
