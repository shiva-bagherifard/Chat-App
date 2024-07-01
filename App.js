// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
import { useEffect } from 'react';

import { useNetInfo }from '@react-native-community/netinfo';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";

import { Alert, LogBox } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  // web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyADg4Awno3c7V9xYdjTRmgxs_UxRmZwcrA",
    authDomain: "chat-app-80b75.firebaseapp.com",
    projectId: "chat-app-80b75",
    storageBucket: "chat-app-80b75.appspot.com",
    messagingSenderId: "840165867642",
    appId: "1:840165867642:web:4f3f26d299ed544ad23bc3"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  const connectionStatus = useNetInfo();

useEffect(() => {
  if (connectionStatus.isConnected === false) {
    Alert.alert("Connection lost!");
    disableNetwork(db);
  } else if (connectionStatus.isConnected === true) {
    enableNetwork(db);
  }
}, [connectionStatus.isConnected]);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
           name="Start"
           component={Start}
        />
        <Stack.Screen name="Chat">
        {props => <Chat isConnected={connectionStatus.isConnected} db={db} {...props}  />}
        </Stack.Screen>
      </Stack.Navigator>  
      </NavigationContainer>
  );
}


export default App;