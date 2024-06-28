import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";



const Chat = ({route, navigation, db}) => {
  const { username, background, userID } = route.params;
    const [messages, setMessages] = useState([]);
    // const collectionName = "messages";
    const onSend = (newMessages) => {
        // setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
        addDoc(collection(db, "messages"), newMessages[0])
      }

    const renderBubble = (props) => {
        return <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: "#000"
            },
            left: {
              backgroundColor: "#FFF"
            }
          }}
        />
      }

      // useEffect hook to set messages options
    useEffect(() => {
      navigation.setOptions({ title: username });
      // Create a query to get the "messages" collection from the Firestore database
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      // This function will be called whenever there are changes in the collection.
      const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        // Iterate through each document in the snapshot
        documentsSnapshot.forEach(doc => {
          newMessages.push({ id: doc.id, ...doc.data(),  createdAt: new Date(doc.data().createdAt.toMillis()), })
        });
        setMessages(newMessages);
      });

      return () => {
        if (unsubMessages) unsubMessages();
      }
      }, []);

      return (
        <View style={[styles.container, { backgroundColor: background }]}>
          <GiftedChat
            messages={messages}
            renderBubble={renderBubble}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: userID,
              name: username,
            }}
          />
          {Platform.OS === "android" || Platform.OS === 'ios'? (
            <KeyboardAvoidingView behavior="height" />
          ) : null}
        </View>
      );     
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
 }
});

export default Chat;