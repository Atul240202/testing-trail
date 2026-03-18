import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import WatchIcon from '../WatchIcon';
import { handleHealthConnectSync } from '../../../services/healthConnect';
import { logger } from '../../../utils/logger.js';

interface Device {
  id: string;
  name: string;
  type: string;
  connected: boolean;
}

interface DevicePairingStepProps {
  onComplete: (device: Device | null) => void;
  initialValue?: Device | null;
}
// const mockDevices: Device[] = [
//   {
//     id: '1',
//     name: 'Apple Watch Series 9',
//     type: 'watch',
//     connected: false,
//   },
//   {
//     id: '2',
//     name: 'Apple Watch Ultra 2',
//     type: 'watch',
//     connected: false,
//   },
//   { id: '3', name: 'Oura Ring Gen 3', type: 'ring', connected: false },
//   {
//     id: '4',
//     name: 'Samsung Galaxy Watch 6',
//     type: 'watch',
//     connected: false,
//   },
// ];

const DevicePairingStep: React.FC<DevicePairingStepProps> = ({
  onComplete,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  // const [showDeviceList, setShowDeviceList] = useState(false);
  // const [devices, setDevices] = useState<Device[]>([]);
  // const [selectedDevice, setSelectedDevice] = useState<Device | null>(
  //   initialValue,
  // );


  const handlePairDevice = async (): Promise<void> => {
    // setIsScanning(true);
    // setShowDeviceList(true);
    try{
      setIsScanning(true);

      const result = await handleHealthConnectSync();

      if(!result){
        logger.error('Health Connect sync failed');
        setIsScanning(false);
        return;
      }
      onComplete(null);
    } catch (error) {
      logger.error('Error during Health Connect sync:', error);
      setIsScanning(false);
    }

    // setTimeout(() => {
    //   // setDevices(mockDevices);
    //   setIsScanning(false);
    // }, 2000);
  };

  // const handleConnectDevice = (device: Device): void => {
  //   setIsScanning(true);

  //   setTimeout(() => {
  //     setIsScanning(false);
  //     setShowDeviceList(false);
  //     setSelectedDevice(device);
  //     onComplete(device);

  //     Alert.alert('Success', `${device.name} connected successfully!`, [
  //       {
  //         text: 'OK',
  //         onPress: () => {
  //           onComplete(device);
  //         },
  //       },
  //     ]);
  //   }, 1500);
  // };

  return (
    <View className="flex-1 w-full items-center justify-center">
      <WatchIcon />

      <View className="mb-4 mt-16">
        <Text 
          className="text-center text-3xl leading-10 text-black"
          style={{ fontFamily: 'Inter_28pt-SemiBold', fontWeight: '600' }}
        >
          Pair your smart watch or
        </Text>
        <Text 
          className="text-center text-3xl leading-10 text-black"
          style={{ fontFamily: 'Inter_28pt-SemiBold', fontWeight: '600' }}
        >
          smart ring
        </Text>
      </View>

      <View className="mb-8">
        <Text className="text-center text-base text-gray-600">
          This helps Pause detect stress accurately
        </Text>
      </View>

      {/* {selectedDevice && (
        <View className="mt-4 rounded-lg bg-green-50 px-4 py-3">
          <Text className="text-center text-sm font-medium text-green-700">
            ✓ Connected to {selectedDevice.name}
          </Text>
        </View>
      )} */}

      {/* <DeviceListModal
        visible={showDeviceList}
        isScanning={isScanning}
        devices={devices}
        onClose={() => setShowDeviceList(false)}
        onSelectDevice={handleConnectDevice}
      /> */}

      <View className="absolute bottom-6 left-6 right-6">
        <TouchableOpacity
          onPress={handlePairDevice}
          disabled={isScanning}
          className={`flex-row items-center justify-center gap-3 rounded-full px-6 py-4 ${
            isScanning ? 'bg-indigo-400' : 'bg-indigo-600'
          }`}
        >
          <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-white">
            <MaterialCommunityIcons name="bluetooth" size={20} color="#fff" />
          </View>
          <Text className="text-center text-base font-semibold text-white">
            {isScanning ? 'Scanning...' : 'Pair device'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DevicePairingStep;