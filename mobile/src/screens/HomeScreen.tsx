/**
 * Home Screen
 * 
 * Main dashboard for authenticated users showing current status and quick actions.
 * Displays user greeting, app status, and navigation to reset sessions and profile.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar} from 'react-native';
import { colors } from '../theme/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../store/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const HomeScreen = ({ navigation }: any) => {
   const { user } = useAuthStore();
   const userName = user?.name?.split(' ')[0] || 'User';
   const insets = useSafeAreaInsets();


   return (
       <ImageBackground
           source={require('../assets/images/mesh_bg.png')}
           style={styles.container}
           resizeMode="cover"
       >
           <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />


           {/* Header */}
           <View style={styles.header}>
               <Text style={styles.greeting}>
                   Hi, <Text style={styles.userName}>{userName}</Text>
               </Text>
               <TouchableOpacity style={styles.helpButton}>
                   <MaterialCommunityIcons name="help-circle-outline" size={24} color={colors.primaryPurple} />
                   <Text style={styles.helpText}>How This Works?</Text>
               </TouchableOpacity>
           </View>


           {/* Main Content */}
           <View style={styles.content}>
               <Text style={styles.mainText}>
                   You're okay{'\n'}right now.
               </Text>


               <View style={styles.statusCard}>
                   <View style={styles.statusIndicator} />
                   <Text style={styles.statusText}>Pause is quietly watching</Text>
               </View>
           </View>


           {/* Bottom Section */}
           <View style={styles.footer}>
               <TouchableOpacity
                   style={styles.resetButton}
                   onPress={() => navigation.navigate('Reset')}
               >
                   <MaterialCommunityIcons name="play" size={24} color={colors.white} />
                   <Text style={styles.resetButtonText}>Start reset now</Text>
               </TouchableOpacity>


               {/* Bottom Navigation */}
               <View style={[styles.bottomNav, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
                   <TouchableOpacity style={styles.navItem}>
                       <MaterialCommunityIcons name="home" size={28} color={colors.primaryPurple} />
                       <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
                   </TouchableOpacity>


                   <TouchableOpacity
                       style={styles.navItem}
                       onPress={() => navigation.navigate('MyResets')}
                   >
                       <MaterialCommunityIcons name="pause-circle-outline" size={28} color="#999" />
                       <Text style={styles.navText}>My Resets</Text>
                   </TouchableOpacity>


                   <TouchableOpacity
                       style={styles.navItem}
                       onPress={() => navigation.navigate('Profile')}
                   >
                       <MaterialCommunityIcons name="account-outline" size={28} color="#999" />
                       <Text style={styles.navText}>You</Text>
                   </TouchableOpacity>
               </View>
           </View>
       </ImageBackground>
   );
};


const styles = StyleSheet.create({
   container: {
       flex: 1,
   },
   header: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       paddingHorizontal: 24,
       paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 80,
       paddingBottom: 20,
   },
   greeting: {
       fontSize: 20,
       fontFamily: 'Inter_28pt-Regular',
       color: colors.textDark,
   },
   userName: {
       fontFamily: 'Inter_28pt-Bold',
       color: colors.primaryPurple,
   },
   helpButton: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: 'rgba(255, 255, 255, 0.7)',
       paddingHorizontal: 12,
       paddingVertical: 6,
       borderRadius: 18,
   },
   helpText: {
       fontSize: 14,
       fontFamily: 'Inter_28pt-Medium',
       color: colors.primaryPurple,
       marginLeft: 6,
   },
   content: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       paddingHorizontal: 30,
   },
   mainText: {
       fontSize: 48,
       fontFamily: 'Inter_28pt-Bold',
       color: colors.textDark,
       textAlign: 'center',
       lineHeight: 60,
       marginBottom: 40,
   },
   statusCard: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: 'rgba(255, 255, 255, 0.9)',
       paddingHorizontal: 24,
       paddingVertical: 16,
       borderRadius: 30,
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.1,
       shadowRadius: 8,
       elevation: 3,
   },
   statusIndicator: {
       width: 12,
       height: 12,
       borderRadius: 6,
       backgroundColor: '#4ADE80',
       marginRight: 12,
   },
   statusText: {
       fontSize: 16,
       fontFamily: 'Inter_28pt-Medium',
       color: colors.textDark,
   },
   footer: {
       paddingHorizontal: 24,
       paddingBottom: 0,
   },
   resetButton: {
       backgroundColor: colors.primaryPurple,
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'center',
       width: '100%',
       paddingVertical: 18,
       borderRadius: 30,
       marginBottom: 20,
       shadowColor: colors.primaryPurple,
       shadowOffset: { width: 0, height: 4 },
       shadowOpacity: 0.3,
       shadowRadius: 5,
       elevation: 5,
   },
   resetButtonText: {
       fontSize: 18,
       fontFamily: 'Inter_28pt-SemiBold',
       color: colors.white,
       marginLeft: 8,
   },
   bottomNav: {
       flexDirection: 'row',
       justifyContent: 'space-around',
       alignItems: 'center',
       paddingTop: 12,
       backgroundColor: '#fff',
       borderTopWidth: StyleSheet.hairlineWidth,
       borderTopColor: '#E5E5E5',
       marginHorizontal: -24,
   },
   navItem: {
       alignItems: 'center',
       justifyContent: 'center',
       flex: 1,
   },
   navText: {
       fontSize: 12,
       fontFamily: 'Inter_28pt-Medium',
       color: '#999',
       marginTop: 4,
   },
   navTextActive: {
       color: colors.primaryPurple,
   },
});


export default HomeScreen;