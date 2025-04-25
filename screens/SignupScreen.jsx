import React, {useState} from 'react';
import Icons from 'react-native-vector-icons/Feather';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSignup = () => {
    const authInstance = getAuth();
    createUserWithEmailAndPassword(authInstance, email, password)
      .then(userCredential => {
        updateProfile(userCredential.user, {
          displayName: name,
        }).then(() => {
          Snackbar.show({
            text: 'Account Created',
            duration: Snackbar.LENGTH_SHORT,
          });
          navigation.replace('GameModeScreen');
        });
      })
      .catch(error => {
        if (name === '' || email === '' || password === '') {
          Snackbar.show({
            text: 'Please enter your name, email and password first!',
            duration: Snackbar.LENGTH_LONG,
          });
        }

        else if (error.code === 'auth/invalid-email') {
          Snackbar.show({
            text: 'That email address is invalid!',
            duration: Snackbar.LENGTH_LONG,
          });
        }

        else if (error.code === 'auth/email-already-in-use') {
          Snackbar.show({
            text: 'That email address is already in use!',
            duration: Snackbar.LENGTH_LONG,
          });
        }

        else {
          Snackbar.show({
            text: 'Password must have at least six characters!',
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
        <Text style={styles.title}>Register Account</Text>
        <Text style={styles.subtitle}>Set your account</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={value => setName(value)}
            autoCapitalize="none"
          />
        </View>

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
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signupButton} onPress={onSignup}>
          <Text style={styles.signupButtonText}>Signup</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.signinLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupScreen;

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
    borderRadius: 8,
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
