import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/AntDesign';

const GameModeScreen = ({navigation}) => {

  const onLogout = () => {
    auth()
      .signOut()
      .then(() => {
        Snackbar.show({
          text: 'Logout Successfully!',
          duration: Snackbar.LENGTH_SHORT,
        });
        navigation.replace('LoginScreen');
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <Icon name="logout" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../assets/logo.png')} />
      </View>

      <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('ComputerScreen')}>
        <Text style={styles.buttonText}>Single Player</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('GameScreen')}>
        <Text style={styles.buttonText}>Two Player</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GameModeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 34,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    width: '100%',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
