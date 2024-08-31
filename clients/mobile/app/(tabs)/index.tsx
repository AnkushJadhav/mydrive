import { useEffect, useState } from "react";
import { View, SafeAreaView, FlatList, StatusBar } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Image } from "expo-image";

export default function Index() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [paginatedAssets, setPaginatedAssets] =
    useState<MediaLibrary.PagedInfo<MediaLibrary.Asset>>();

  useEffect(() => {
    (async () => {
      if (permissionResponse?.status !== "granted") {
        await requestPermission();
      }
      const assetsItr = await MediaLibrary.getAssetsAsync({
        sortBy: "creationTime",
      });
      setPaginatedAssets(assetsItr);
    })();
  }, [setPaginatedAssets]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
      }}
    >
      <FlatList
        numColumns={4}
        horizontal={false}
        showsVerticalScrollIndicator
        data={paginatedAssets?.assets}
        renderItem={({ item }) => (
          <View key={item.id} style={{ height: 100, width: 100 }}>
            <Image source={{ uri: item.uri }} style={{ flex: 1 }} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}
