import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.pageTitle}>Privacy Policy</Text>

        <View style={styles.card}>

          <Text style={styles.text}>
            Your privacy is important to us. This policy explains how Pause
            collects and uses your information.
          </Text>

          <Text style={styles.section}>Information We Collect</Text>
          <Text style={styles.text}>
            When signing in with Google, we collect basic information such
            as your name and email address.
          </Text>

          <Text style={styles.section}>How We Use Information</Text>
          <Text style={styles.text}>
            Your information helps us provide personalized experiences and
            improve the Pause application.
          </Text>

          <Text style={styles.section}>Data Security</Text>
          <Text style={styles.text}>
            We implement security measures to protect your data, though no
            digital system can guarantee complete security.
          </Text>

          <Text style={styles.section}>Third-Party Services</Text>
          <Text style={styles.text}>
            Pause may use trusted third-party services such as Google
            authentication.
          </Text>

          <Text style={styles.section}>Policy Updates</Text>
          <Text style={styles.text}>
            This privacy policy may change from time to time. Updates will
            be reflected inside the application.
          </Text>

          <Text style={styles.updated}>Last updated: March 2026</Text>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea:{
    flex:1,
    backgroundColor:'#F4F4F8'
  },

  content:{
    padding:20
  },

  pageTitle:{
    fontSize:32,
    fontFamily:'Inter_28pt-SemiBold',
    color:colors.textDark,
    marginTop:40,
    marginBottom:20
  },

  card:{
    backgroundColor:'#fff',
    borderRadius:16,
    padding:20,
    shadowColor:'#000',
    shadowOffset:{width:0,height:1},
    shadowOpacity:0.06,
    shadowRadius:6,
    elevation:2
  },

  section:{
    fontSize:16,
    fontFamily:'Inter_28pt-SemiBold',
    color:colors.textDark,
    marginTop:18,
    marginBottom:4
  },

  text:{
    fontSize:14,
    fontFamily:'Inter_28pt-Regular',
    color:colors.textGrey,
    lineHeight:22
  },

  updated:{
    marginTop:24,
    fontSize:12,
    fontFamily:'Inter_28pt-Regular',
    color:'#A0A0A8'
  }

});