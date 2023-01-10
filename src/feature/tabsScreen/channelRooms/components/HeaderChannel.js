import * as React from "react";

import {
  Text,
  View,
  Platform,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";

//Import Assets
import IconBack from "./../../../../assets/image/icon_back.svg";
import IconSearch from "./../../../../assets/image/icon_search.svg";
import IconFilter from "./../../../../assets/image/icon_filter.svg";
import SelectDropdown from "react-native-select-dropdown";
import Tooltip from "react-native-walkthrough-tooltip";
import Popover from "react-native-popover-view";

//Import External
import { useSelector } from "react-redux";
import { Icon, Header } from "react-native-elements";
import { moderateScale } from "../../../other/Scaling";
import { IconX } from "../../../../assets/icons";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

export default HeaderChannel = ({
  goBack,
  closeSearch,
  onSubmitSearch,
  onFilterAction,
  refRBSheetFilter,
}) => {
  const [isSearch, setIsSearch] = React.useState(false);
  const [textSearch, setTextSearch] = React.useState("");
  const [filter, setFilter] = React.useState("");
  const [showChannel, setShowChannel] = React.useState(false);

  const filterChannel = ["All", "Whatsapp", "Line", "Instagram"];

  const dataFilter = [
    { id: 1, name: "All" },
    { id: 2, name: "Unserved" },
    { id: 3, name: "Served" },
    { id: 4, name: "Resolved" },
  ];

  const clearTextSearch = () => {
    setTextSearch("");
  };

  const showSearchInHeader = () => {
    const [textSearch, setTextSearch] = React.useState("");

    const clearTextSearch = () => {
      setTextSearch("");
    };

    if (isSearch) {
      return (
        <>
          <View
            style={[
              styles.containInput,
              {
                width: "100%",
                alignItems: "center",
                flexDirection: "row",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                setIsSearch(false);
                closeSearch();
                clearTextSearch();
              }}
            >
              <View style={{ marginRight: 4 }}>
                <IconX height={16} width={16} />
              </View>
            </TouchableOpacity>
            <TextInput
              value={textSearch}
              autoCapitalize="none"
              returnKeyType="search"
              placeholder="Search customer"
              underlineColorAndroid="transparent"
              onChangeText={(textSearch) => setTextSearch(textSearch)}
              onSubmitEditing={() => onSubmitSearch(textSearch)}
            />
          </View>
        </>
      );
    } else {
      return null;
    }
  };

  const openFilter = () => {
    refRBSheetFilter.current.open();
  };

  return (
    <View style={styles.containerHeader}>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#edeff0",
          height: 30,
        }}
      >
        {dataFilter.map((item) => {
          return (
            <TouchableOpacity
              style={{
                ...styles.btnFilter,
                backgroundColor: filter === item.id ? "#f3f3f9" : "white",
              }}
              onPress={() => {
                setFilter(item.id);
              }}
            >
              <Text style={styles.txtFilter}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.rowFilter}>
        <Popover
          from={
            <TouchableOpacity style={styles.boxFilterChanel}>
              <Text>Filter Channel</Text>
              <Image
                source={require("../../../../assets/image/icon-down.png")}
                style={{ height: 20, width: 20 }}
              />
            </TouchableOpacity>
          }
        >
          <View style={{ padding: 10, width: 100 }}>
            {filterChannel.map((v) => {
              return (
                <TouchableOpacity style={{ marginBottom: 8 }}>
                  <Text>{v}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Popover>

        <TouchableOpacity style={styles.btnGetCustomer}>
          <View
            style={{
              backgroundColor: "#3577f1",
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              height: "100%",
              width: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../../../assets/image/icon-shield-user.png")}
              style={{ height: 20, width: 20 }}
            />
          </View>
          <Text style={{ color: "white", fontSize: 12 }}>Get Customer</Text>
          <View style={styles.badgeCust}>
            <Text style={{ color: "white", fontSize: 12 }}>99</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.containInput}>
        <IconSearch height={15} width={15} />
        <TextInput
          value={textSearch}
          autoCapitalize="none"
          returnKeyType="search"
          placeholder="Search conversation"
          underlineColorAndroid="transparent"
          onChangeText={(textSearch) => setTextSearch(textSearch)}
          onSubmitEditing={() => onSubmitSearch(textSearch)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerHeader: {
    paddingHorizontal: moderateScale(8),
    paddingBottom: moderateScale(8),
    justifyContent: "center",
    backgroundColor: "#FFFF",
    width: "100%",
  },
  containInput: {
    paddingHorizontal: 20,
    backgroundColor: "rgba(228, 228, 231, 0.4)",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    height: 40,
  },
  btnFilter: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  txtFilter: {
    marginHorizontal: 12,
    fontWeight: "bold",
  },
  rowFilter: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  btnGetCustomer: {
    height: 30,
    width: 160,
    backgroundColor: "#2d65cd",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 5,
    marginLeft: 5,
    borderRadius: 5,
    flexDirection: "row",
  },
  badgeCust: {
    height: 20,
    width: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 10,
    marginLeft: 5,
  },
  boxFilterChanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    width: 120,
    height: 30,
    backgroundColor: "#F3F6F9",
    borderRadius: 5,
  },
});
