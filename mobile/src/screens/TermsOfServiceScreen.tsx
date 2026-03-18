import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

export default function TermsOfServiceScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.pageTitle}>Terms of Service</Text>

        <View style={styles.card}>
          <Text style={styles.text}>
            Welcome to Pause. These Terms of Service govern your use of the
            Pause mobile application.
          </Text>

          <Text style={styles.section}>Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing or using Pause, you agree to comply with these
            terms. If you do not agree, you should discontinue use of the
            application.
          </Text>

          <Text style={styles.section}>Use of the Application</Text>
          <Text style={styles.text}>
            Pause is designed to help users take short mental breaks during
            work. You agree to use the app responsibly and only for lawful
            purposes.
          </Text>

          <Text style={styles.section}>Account Responsibility</Text>
          <Text style={styles.text}>
            When signing in through Google, you are responsible for
            maintaining the confidentiality of your account information.
          </Text>

          <Text style={styles.section}>Health Disclaimer</Text>
          <Text style={styles.text}>
            Pause provides wellness tools and is not intended to replace
            professional medical advice.
          </Text>

          <Text style={styles.section}>Changes to Terms</Text>
          <Text style={styles.text}>
            These terms may be updated from time to time. Continued use of
            the app indicates acceptance of the updated terms.
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