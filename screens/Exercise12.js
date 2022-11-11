import React from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  Button,
  TextInput,
  Alert,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

const DATA = [
  {
    id: 1,
    url: "https://i1.wp.com/kicksgeeks.vn/wp-content/uploads/2021/04/lebron-18-palmer.jpg?fit=1600%2C923&ssl=1",
  },
  {
    id: 2,
    url: "https://bizweb.dktcdn.net/100/427/393/files/nike-lebron-18-low-stewie-cv7564-104-8-optimized-jpeg.jpg?v=1629384732937",
  },
  {
    id: 3,
    url: "https://footgearh.vn/upload/images/Xbox-Space-Jam-Nike-LeBron-18-Low-5.png",
  },
];

urlPatternValidation = (url) => {
  const regex = new RegExp(
    "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
  );
  return regex.test(url);
};

export default function Exercise12({ navigation }) {
  const [url, setUrl] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const flatlistRef = useRef();

  const { width, height } = Dimensions.get("screen");
  const imgWidth = width * 0.9;
  const imgHeight = imgWidth * 0.9;

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  const scrollToIndex = useCallback((index) => {
    flatlistRef.current.scrollToIndex({ animated: true, index: index });
    setImageIndex(index);
  });

  const getUrl = (value) => {
    setUrl(value);
  };

  const addUrl = () => {
    if (!urlPatternValidation(url)) {
      Alert.alert("Invalid URL");
      setUrl("");
    } else {
      DATA.push({
        id: DATA.length + 1,
        url: url,
      });
      Alert.alert("New image has been added!!");
      setUrl("");
      Keyboard.dismiss();
    }
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      setUrl("");
    });
  }, [navigation]);

  const Item = ({ url }) => (
    <View
      style={{
        width,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: url }}
        style={{
          width: imgWidth,
          height: imgHeight,
          resizeMode: "cover",
          borderRadius: 20,
        }}
      />
    </View>
  );

  const renderItem = ({ item }) => <Item url={item.url} />;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ref={flatlistRef}
        getItemLayout={getItemLayout}
        horizontal
        pagingEnabled
        scrollEnabled={"false"}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 50,
        }}
      >
        {imageIndex == 0 ? (
          <TouchableOpacity disabled style={styles.backwardDisable}>
            <Text style={styles.btnText}>Backward</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.backwardBtn}
            onPress={() => scrollToIndex(imageIndex - 1)}
          >
            <Text style={styles.btnText}>Backward</Text>
          </TouchableOpacity>
        )}

        {imageIndex >= DATA.length - 1 ? (
          <TouchableOpacity disabled style={styles.forwardDisable}>
            <Text style={styles.btnText}>Forward</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.forwardBtn}
            onPress={() => scrollToIndex(imageIndex + 1)}
          >
            <Text style={styles.btnText}>Forward</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ marginTop: 40 }}>
        <Text style={styles.label}>URL:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter URL"
          value={url}
          onChangeText={(value) => getUrl(value)}
        />
        {url.length == 0 ? (
          <TouchableOpacity style={styles.addUrlDisable} disabled>
            <Text style={styles.btnText}>Add URL</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addUrlBtn} onPress={() => addUrl()}>
            <Text style={styles.btnText}>Add URL</Text>
          </TouchableOpacity>
        )}
      </View>
      <Button
        title="Exercise 3-4"
        onPress={() => navigation.navigate("Exercise3-4")}
      />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  label: {
    marginLeft: 40,
    padding: 5,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    marginHorizontal: 40,
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  addUrlBtn: {
    backgroundColor: "#1e90ff",
    width: 350,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 40,
    marginBottom: 50,
  },
  addUrlDisable: {
    backgroundColor: "#808080",
    width: 350,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 40,
    marginBottom: 50,
  },
  backwardBtn: {
    backgroundColor: "#1e90ff",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  backwardDisable: {
    backgroundColor: "#808080",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  forwardBtn: {
    backgroundColor: "#1e90ff",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  forwardDisable: {
    backgroundColor: "#808080",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  btnText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
