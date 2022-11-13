import { Camera, CameraType } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("ImageDB");

export const CameraScreen = ({ setShowCamera, navigation }) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [takenImg, setTakenImg] = useState(null);

  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View>
        <Text style={{ textAlign: "center" }}>
          This application want to access your camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleCameraType = () => {
    setCameraType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const takePhoto = async () => {
    if (cameraRef) {
      let recentPhoto = await cameraRef.current.takePictureAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      return recentPhoto;
    }
  };

  const addImageTakenToDatabase = () => {
    console.log("thanh ngu");
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO Images (Url) VALUES (?)",
          [takenImg],
          (tx, results) => {
            console.log(
              "🚀 ~ file: Exercise34.js ~ line 96 ~ tx.executeSql ~ results",
              results
            );
          }
        );
      });
      Alert.alert("New image has been added!!");
    } catch (error) {
      console.log(
        "🚀 ~ file: Exercise34.js ~ line 124 ~ addImage ~ error",
        error
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!takenImg ? (
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <View style={styles.buttonView}>
            <TouchableOpacity onPress={toggleCameraType}>
              <MaterialCommunityIcons
                name="camera-flip-outline"
                size={45}
                color="white"
              />
            </TouchableOpacity>
            <View style={styles.takePhotoButtonView}>
              <TouchableOpacity
                style={styles.takePhotoButton}
                onPress={async () => {
                  const photo = await takePhoto();
                  setTakenImg(photo.uri);
                }}
              >
                <Entypo
                  name="camera"
                  size={60}
                  color="white"
                  style={{ alignSelf: "center", justifyContent: "center" }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={toggleCameraType}>
              <MaterialCommunityIcons
                name="cancel"
                size={45}
                color="white"
                onPress={() => {
                  setShowCamera(false);
                }}
              />
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <SafeAreaView style={styles.container}>
          <View
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              source={{ uri: takenImg }}
              style={{
                flex: 1,
                resizeMode: "cover",
                position: "relative",
              }}
            ></Image>
            <TouchableOpacity
              style={styles.addToDatabaseButton}
              onPress={() => {
                addImageTakenToDatabase();
                setTakenImg(null);
                setShowCamera(false);
              }}
            >
              <FontAwesome5
                name="check-circle"
                size={100}
                color="white"
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backToCameraScreen}
              onPress={() => {
                setTakenImg(null);
              }}
            >
              <MaterialCommunityIcons name="cancel" size={45} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {/* <Camera  type={cameraType} ></Camera> */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  camera: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  close: {
    position: "absolute",
  },
  buttonText: {
    fontSize: 30,
  },
  buttonView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 70,
    marginBottom: 50,
  },

  takePhotoButtonView: {
    borderWidth: 9,
    borderRadius: 50,
    width: 100,
    height: 100,
    borderColor: "white",
  },
  takePhotoButton: {
    flex: 1,
    justifyContent: "center",
  },
  buttonViewAfterTaken: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 70,
    marginBottom: 0,
    position: "absolute",
  },
  addToDatabaseButton: {
    borderColor: "white",
    position: "absolute",
    marginStart: 165,
    marginTop: 645,
  },
  backToCameraScreen: {
    marginTop: 672,
    position: "absolute",
    marginStart: 315,
  },
});
