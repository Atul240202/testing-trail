import React from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const WatchIcon: React.FC = () => {
  return (
    <View className="mb-32 items-center justify-center">
      <View className="absolute h-72 w-72 items-center justify-center rounded-full border-2 border-indigo-200">
        <View className="h-56 w-56 items-center justify-center rounded-full border-8 border-indigo-600 bg-indigo-50">
          <View className="h-40 w-40 items-center justify-center rounded-full bg-white">
            <View className="h-28 w-24 items-center justify-center">
              <View className="absolute top-0 h-2 w-14 rounded-full bg-indigo-600" />

              <View className="h-20 w-20 items-center justify-center rounded-3xl border-4 border-indigo-600 bg-white">
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={36}
                  color="#4f46e5"
                />
              </View>

              <View className="absolute bottom-0 h-2 w-14 rounded-full bg-indigo-600" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WatchIcon;
