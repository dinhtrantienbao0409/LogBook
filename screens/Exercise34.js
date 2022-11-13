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
import * as SQLite from "expo-sqlite";
import { CameraScreen } from "../screens/CameraScreen";
const db = SQLite.openDatabase("ImageDB");

urlPatternValidation = (url) => {
  const regex = new RegExp(
    "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
  );
  return regex.test(url);
};

export default function Exercise34({ navigation }) {
  const [url, setUrl] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  console.log(
    "🚀 ~ file: Exercise34.js ~ line 35 ~ Exercise34 ~ showCamera",
    showCamera
  );

  const flatlistRef = useRef();

  const { width, height } = Dimensions.get("screen");
  const imgWidth = width * 0.9;
  const imgHeight = imgWidth * 0.9;

  useEffect(() => {
    createTables();
    getImage();
  }, []);

  const createTables = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS " +
          "Images " +
          "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Url TEXT NOT NULL);",
        [],
        () => {
          console.log("success");
        }
      );
    });
  };

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

  const addImage = () => {
    if (!urlPatternValidation(url)) {
      Alert.alert("Invalid URL");
      setUrl("");
    } else {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO Images (Url) VALUES (?)",
            [url],
            (tx, results) => {
              console.log(
                "🚀 ~ file: Exercise34.js ~ line 96 ~ tx.executeSql ~ results",
                results
              );
            }
          );
        });
        Alert.alert("New image has been added!!");
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Exercise3-4",
            },
          ],
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: Exercise34.js ~ line 124 ~ addImage ~ error",
          error
        );
      }
    }
  };

  const getImage = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM Images ", [], (tx, results) => {
          // console.log(
          //   "🚀 ~ file: Home.js ~ line 58 ~ db.transaction ~ results",
          //   results.rows._array
          // );
          var len = results.rows.length;
          if (len > 0) {
            setImages(results.rows._array);
          }
        });
      });
    } catch (error) {
      console.log("🚀 ~ file: Home.js ~ line 32 ~ getData ~ error", error);
    }
  };

  const onshowCamera = () => {
    setShowCamera(true);
  };

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

  const renderItem = ({ item }) => <Item url={item["URL"]} />;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {showCamera ? (
        <View
          style={{
            flex: 1,
          }}
        >
          <CameraScreen setShowCamera={setShowCamera} />
        </View>
      ) : (
        <SafeAreaView>
          <FlatList
            data={images}
            keyExtractor={(item) => item["ID"]}
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

            {imageIndex >= images.length - 1 ? (
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
              <TouchableOpacity
                style={styles.addUrlBtn}
                onPress={() => addImage()}
              >
                <Text style={styles.btnText}>Add URL</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.launchCameraBtn}
            onPress={() => onshowCamera()}
          >
            <Text style={styles.btnText}>Launch The Camera</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
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
    marginBottom: 10,
  },
  launchCameraBtn: {
    backgroundColor: "#1e90ff",
    width: 350,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 40,
    marginBottom: 10,
  },
  addUrlDisable: {
    backgroundColor: "#808080",
    width: 350,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 40,
    marginBottom: 10,
  },
  backwardBtn: {
    backgroundColor: "#1e90ff",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 50,
  },
  backwardDisable: {
    backgroundColor: "#808080",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 50,
  },
  forwardBtn: {
    backgroundColor: "#1e90ff",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 50,
  },
  forwardDisable: {
    backgroundColor: "#808080",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 50,
  },
  btnText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
