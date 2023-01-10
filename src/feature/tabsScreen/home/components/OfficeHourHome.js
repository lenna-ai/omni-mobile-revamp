import * as React from "react";
import LinearGradient from "react-native-linear-gradient";

import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { Text, View, Platform, StyleSheet, Dimensions } from "react-native";
import { moderateScale, verticalScale } from "./../../../other/Scaling";
import { useSelector } from "react-redux";
import {
  imageImageCarousel1,
  imageImageCarousel2
} from "./../../../../assets/icons";

const dimenWidth = Dimensions.get("screen").width;

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
export default (OfficeHourHome = () => {
  let disDataOfficeHour = useSelector(state => state.mDataOfficeHour);
  let containLoading = disDataOfficeHour.loading;
  let containOfficeHour = disDataOfficeHour.dataOfficeHour;

  const OfficeHourShimmer = () => {
    return (
      <ShimmerPlaceHolder
        height={verticalScale(100)}
        autoRun={true}
        width={dimenWidth - moderateScale(48)}
        style={styles.continerShimmerOfficeHour}
      />
    );
  };

  const getHourAndMinute = (hour, minute) => {
    var timeNow = new Date();
    timeNow.setHours(hour);
    timeNow.setMinutes(minute);
    return timeNow;
  };

  const OfficeHourContent = () => {
    let officeHourInside = undefined;

    let stringEnd = [];
    let isOpen = false;
    let displayTime = "";
    let stringStart = [];

    officeHourInside = containOfficeHour.find(function(entry) {
      let dateNow = new Date();
      let hourOpen = parseInt(entry.start.substring(0, 2));
      let minuteOpen = parseInt(
        entry.start.substring(entry.start.length - 2, entry.start.length)
      );
      let hourClose = parseInt(entry.end.substring(0, 2));
      let minuteClose = parseInt(
        entry.end.substring(entry.end.length - 2, entry.end.length)
      );

      stringStart.push(entry.start);
      stringEnd.push(entry.end);

      let now = getHourAndMinute(dateNow.getHours(), dateNow.getMinutes());
      let open = getHourAndMinute(hourOpen, minuteOpen);
      let close = getHourAndMinute(hourClose, minuteClose);
      return now >= open && now <= close;
    });

    if (officeHourInside != undefined) {
      isOpen = true;
      displayTime = officeHourInside.start + " - " + officeHourInside.end;
    } else {
      isOpen = false;
      displayTime = stringStart[0] + " - " + stringEnd[stringEnd.length - 1];
    }

    return (
      <View
        style={[
          styles.officeHourContainer,
          { backgroundColor: isOpen ? "#BA77E6" : "#60327E" }
        ]}
      >
        <View style={styles.officeHourSubContainer}>
          <View style={{ flexDirection: "column" }}>
            {isOpen
              ? <Text style={styles.officeHourTitle}>The Store is Open</Text>
              : <Text style={styles.officeHourTitle}>The Store is Close</Text>}

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.officeHourSubTitle}>Office Hour</Text>
              <Text style={styles.officeHourSubTitle}>
                {displayTime}
              </Text>
            </View>
          </View>

          <View>
            {isOpen
              ? imageImageCarousel1(
                  dimenWidth / moderateScale(3),
                  verticalScale(100)
                )
              : imageImageCarousel2(
                  dimenWidth / moderateScale(3),
                  verticalScale(100)
                )}
          </View>
        </View>
      </View>
    );
  };

  if (containLoading) {
    return <OfficeHourShimmer />;
  } else {
    return <OfficeHourContent />;
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  officeHourContainer: {
    height: verticalScale(100),
    borderRadius: moderateScale(10),
    width: dimenWidth - moderateScale(48),
    marginHorizontal: moderateScale(24)
  },
  officeHourSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: moderateScale(16)
  },
  officeHourTitle: {
    color: "#fff",
    fontWeight: "bold",

    fontSize: moderateScale(18),
    lineHeight: moderateScale(30)
  },
  officeHourSubTitle: {
    color: "#fff",
    marginRight: 8,
    fontWeight: "normal",

    fontSize: moderateScale(12),
    lineHeight: moderateScale(30)
  },
  continerShimmerOfficeHour: {
    borderRadius: moderateScale(10),
    marginHorizontal: moderateScale(24)
  }
});
