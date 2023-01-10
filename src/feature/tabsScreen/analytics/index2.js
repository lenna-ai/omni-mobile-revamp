import * as React from "react";

import {
  Text,
  View,
  Image,
  FlatList,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";

import { Header } from "react-native-elements";

import IconBack from "./../../../assets/image/icon_back.svg";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const listCharts = [
  {
    bulan: "Januari",
    total: 2180000,
    firstResponseTime: 4.66,
    totalConversations: 102,
    totalResolved: 90,
    totalOnGoing: 72
  },
  {
    bulan: "Febuari",
    total: 3680000,
    firstResponseTime: 4.66,
    totalConversations: 182,
    totalResolved: 102,
    totalOnGoing: 4
  },
  {
    bulan: "Maret",
    total: 1000000,
    firstResponseTime: 4.26,
    totalConversations: 101,
    totalResolved: 120,
    totalOnGoing: 10
  },
  {
    bulan: "April",
    total: 3080000,
    firstResponseTime: 3.02,
    totalConversations: 120,
    totalResolved: 10,
    totalOnGoing: 90
  },
  {
    bulan: "Mei",
    total: 4000000,
    firstResponseTime: 8.9,
    totalConversations: 122,
    totalResolved: 106,
    totalOnGoing: 132
  },
  {
    bulan: "Juni",
    total: 2981000,
    firstResponseTime: 4.0,
    totalConversations: 172,
    totalResolved: 111,
    totalOnGoing: 11
  },
  {
    bulan: "Juli",
    total: 4800000,
    firstResponseTime: 10.66,
    totalConversations: 20,
    totalResolved: 19,
    totalOnGoing: 4
  },
  {
    bulan: "Agustus",
    total: 1680020,
    firstResponseTime: 10.66,
    totalConversations: 200,
    totalResolved: 210,
    totalOnGoing: 12
  },
  {
    bulan: "September",
    total: 2100000,
    firstResponseTime: 4.77,
    totalConversations: 37,
    totalResolved: 90,
    totalOnGoing: 222
  },
  {
    bulan: "Oktober",
    total: 1780000,
    firstResponseTime: 4.2,
    totalConversations: 180,
    totalResolved: 98,
    totalOnGoing: 13
  },
  {
    bulan: "November",
    total: 3680000,
    firstResponseTime: 6.06,
    totalConversations: 99,
    totalResolved: 22,
    totalOnGoing: 90
  },
  {
    bulan: "Desember",
    total: 1680000,
    firstResponseTime: 6.26,
    totalConversations: 101,
    totalResolved: 100,
    totalOnGoing: 45
  }
];

const getHeightTotal = () => {
  let data = Math.max.apply(
    Math,
    listCharts.map(function(data) {
      return data.total;
    })
  );
  return data;
};

const dataListCharts = (
  index,
  bulan,
  total,
  firstResponseTime,
  totalConversations,
  totalResolved,
  totalOnGoing,
  selected,
  onSelect
) => {
  let valueindex = (index + 1) % 2;

  let heightTotal = getHeightTotal();

  let getPersen = total / heightTotal * 100;
  let getValueHeight = getPersen / 100 * 190;

  return (
    <View
      style={{
        width: 16.6 / 100 * (dimenWidth - 40),
        height: 190,
        justifyContent: "flex-end"
      }}
    >
      <TouchableOpacity
        onPress={() =>
          onSelect(
            bulan,
            totalOnGoing,
            totalResolved,
            firstResponseTime,
            totalConversations
          )}
      >
        <View
          style={{
            flexDirection: "row",
            height: getValueHeight,
            backgroundColor: !selected
              ? "#7FA6D4"
              : valueindex == 0 ? "#EDF0F5" : "#E5E9F4"
          }}
        />
      </TouchableOpacity>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 12,
            lineHeight: 24,
            color: !selected ? "#7FA6D4" : "#A6A7AA",
            letterSpacing: 0.1,
            fontWeight: !selected ? "bold" : "normal",

            textTransform: "capitalize"
          }}
        >
          {bulan.substring(0, 3)}
        </Text>
      </View>
    </View>
  );
};

const Analytics = ({ navigation }) => {
  const [totalOnGoing, setTotalOnGoing] = React.useState(undefined);
  const [totalResolved, setTotalResolved] = React.useState(undefined);
  const [firstResponseTime, setFirstResponseTime] = React.useState(undefined);
  const [totalConversations, setTotalConversations] = React.useState(undefined);
  const [selected, setSelected] = React.useState(new Map());

  React.useEffect(() => {
    valueSeletedFirst();
  }, []);

  const onSelect = React.useCallback(
    (
      bulan,
      totalOnGoing,
      totalResolved,
      firstResponseTime,
      totalConversations
    ) => {
      const newSelected = new Map(new Map());
      newSelected.set(bulan, !selected.get(bulan));
      setSelected(newSelected);
      if (selected.get(bulan)) {
        setTotalOnGoing(undefined);
        setTotalResolved(undefined);
        setFirstResponseTime(undefined);
        setTotalConversations(undefined);
      } else {
        setTotalOnGoing(totalOnGoing);
        setTotalResolved(totalResolved);
        setFirstResponseTime(firstResponseTime);
        setTotalConversations(totalConversations);
      }
    },
    [selected]
  );

  const valueSeletedFirst = () => {
    const newSelect = new Map();
    newSelect.set("Juli", true);
    setSelected(newSelect);
  };

  const renderDataCarousel = (value1, value2, value3, value4) => {
    return (
      <View
        style={{
          height: 144,
          borderRadius: 10,
          paddingVertical: 10,
          alignItems: "center",
          paddingHorizontal: 8,
          backgroundColor: value4,
          justifyContent: "space-around",
          width: (dimenWidth - 48) / 2 - 3.5
        }}
      >
        <Text
          style={{
            fontSize: 12,
            lineHeight: 18,
            color: "#ffffff",
            fontWeight: "normal",
            textAlign: "center"
          }}
        >
          {value1}
        </Text>
        <View>
          <Text
            style={{
              fontSize: 40,
              color: "#ffffff",
              fontWeight: "bold",

              textAlign: "center"
            }}
          >
            {value2}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#ffffff",
              fontWeight: "normal",

              textTransform: "lowercase",
              textAlign: "center"
            }}
          >
            {value3}
          </Text>
        </View>
      </View>
    );
  };

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
                  width: "82%",
                  height: 43
                }}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <IconBack />
                </TouchableOpacity>
                <Text
                  style={{
                    marginLeft: 6,
                    color: "#000000",
                    fontSize: 24,
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
          backgroundColor: "#E5E5E5",
          justifyContent: "center",
          borderBottomColor: "#E5E5E5"
        }}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: "#E5E5E5", paddingBottom: 12 }
      ]}
    >
      {headerComponent()}
      <View style={styles.container}>
        <View style={{ marginHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 20,
              color: "#3C64B1",
              fontWeight: "bold",

              marginBottom: 20,
              textTransform: "capitalize"
            }}
          >
            Monthly Performance
          </Text>
          <FlatList
            horizontal={true}
            data={listCharts}
            renderItem={({ item, index }) =>
              dataListCharts(
                index,
                item.bulan,
                item.total,
                item.firstResponseTime,
                item.totalConversations,
                item.totalOnGoing,
                item.totalResolved,
                !selected.get(item.bulan),
                onSelect
              )}
            extraData={selected}
            keyExtractor={item => item.bulan}
            // ListFooterComponent={renderFooter}
            // ListEmptyComponent={<ListEmptyComponent />}
          />
        </View>
      </View>
      <View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            marginTop: 8,
            justifyContent: "space-between"
          }}
        >
          {renderDataCarousel(
            "First Response Time",
            firstResponseTime != null || firstResponseTime != undefined
              ? firstResponseTime
              : " - ",
            "minutes",
            "#2787C4"
          )}
          {renderDataCarousel(
            "Total Conversations",
            totalConversations != null || totalConversations != undefined
              ? totalConversations
              : " - ",
            "conversations",
            "#186AB3"
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            marginTop: 12,
            justifyContent: "space-between"
          }}
        >
          {renderDataCarousel(
            "Total Resolved",
            totalResolved != null || totalResolved != undefined
              ? totalResolved
              : " - ",
            "inquiries",
            "#55BECB"
          )}
          {renderDataCarousel(
            "Total On Going",
            totalOnGoing != null || totalOnGoing != undefined
              ? totalOnGoing
              : " - ",
            "conversations",
            "#0690A2"
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Analytics;
