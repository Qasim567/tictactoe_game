import React, {useState} from 'react';
import {getAuth, signInWithEmailAndPassword} from '@react-native-firebase/auth';
import Icons from 'react-native-vector-icons/Feather';
import Snackbar from 'react-native-snackbar';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = () => {
    const authInstance = getAuth();
    signInWithEmailAndPassword(authInstance, email, password)
      .then(userCredential => {
        Snackbar.show({
          text: 'Login Successfully!',
          duration: Snackbar.LENGTH_SHORT,
        });
        navigation.replace('GameModeScreen');
      })
      .catch(error => {
        if (email === '' || password === '') {
          Snackbar.show({
            text: 'Please enter your email and password first!',
            duration: Snackbar.LENGTH_LONG,
          });
        }
        if (error.code === 'auth/invalid-email') {
          Snackbar.show({
            text: 'That email address is invalid!',
            duration: Snackbar.LENGTH_LONG,
          });
        }
        if (error.code === 'auth/invalid-credential') {
          Snackbar.show({
            text: 'Wrong email or password!',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../assets/logo.png')} />
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Login Account</Text>
        <Text style={styles.subtitle}>Welcome back to app</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={value => setEmail(value)}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={value => setPassword(value)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icons
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#000"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signupButton} onPress={onLogin}>
          <Text style={styles.signupButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Not register yet?</Text>
        <TouchableOpacity onPress={() => navigation.replace('SignupScreen')}>
          <Text style={styles.signinLink}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
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
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  formContainer: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#000',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    borderRadius: 8,
  },
  buttonContainer: {
    marginBottom: 3,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  signupButton: {
    backgroundColor: '#000',
    padding: 14,
    marginHorizontal: 80,
    borderRadius: 15,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  signinLink: {
    fontSize: 14,
    color: '#007BFF',
  },
});
