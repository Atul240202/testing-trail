import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface Device {
  id: string;
  name: string;
  type: 'watch' | 'ring';
  connected: boolean;
}

interface DeviceListModalProps {
  visible: boolean;
  isScanning: boolean;
  devices: Device[];
  onClose: () => void;
  onSelectDevice: (device: Device) => void;
}

const DeviceListModal: React.FC<DeviceListModalProps> = ({
  visible,
  isScanning,
  devices,
  onClose,
  onSelectDevice,
}) => (
  <Modal visible={visible} transparent animationType="slide">
    <View className="flex-1 bg-black/50">
      <View className="absolute bottom-0 w-full rounded-t-3xl bg-white pb-8">
        <View className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
          <Text className="text-lg font-semibold text-black">
            Available Devices
          </Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {isScanning ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text className="mt-4 text-base text-gray-600">
              Scanning for devices...
            </Text>
          </View>
        ) : (
          <ScrollView className="max-h-96">
            {devices.length === 0 ? (
              <View className="items-center py-12">
                <Text className="text-base text-gray-600">
                  No devices found
                </Text>
              </View>
            ) : (
              devices.map(device => (
                <TouchableOpacity
                  key={device.id}
                  onPress={() => onSelectDevice(device)}
                  className="flex-row items-center justify-between border-b border-gray-100 px-6 py-4"
                >
                  <View className="flex-row items-center gap-3">
                    <MaterialCommunityIcons
                      name={
                        device.type === 'watch' ? 'watch' : 'circle-outline'
                      }
                      size={24}
                      color="#4f46e5"
                    />
                    <Text className="text-base font-medium text-black">
                      {device.name}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </View>
  </Modal>
);

export default DeviceListModal;
