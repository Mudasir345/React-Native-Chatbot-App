import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

// Frontend responses data
const userMessage = [
  ["hi", "hey", "hello"],
  ["sure", "yes", "no"],
  ["are you genius", "are you nerd", "are you intelligent"],
  ["i hate you", "i don't like you"],
  ["how are you", "how is life", "how are things", "how are you doing"],
  ["how is corona", "how is covid 19", "how is covid19 situation"],
  ["what are you doing", "what is going on", "what is up"],
  ["how old are you"],
  ["who are you", "are you human", "are you bot", "are you human or bot"],
  ["who created you", "who made you", "who is your developer"],
  ["your name please", "your name", "may i know your name", "what is your name", "what call yourself"],
  ["i love you"],
  ["happy", "good", "fun", "wonderful", "fantastic", "cool", "very good"],
  ["bad", "bored", "tired"],
  ["help me", "tell me story", "tell me joke"],
  ["ah", "ok", "okay", "nice", "welcome"],
  ["thanks", "thank you"],
  ["what should i eat today"],
  ["bro"],
  ["what", "why", "how", "where", "when"],
  ["corona", "covid19", "coronavirus"],
  ["you are funny"],
  ["i don't know"],
  ["boring"],
  ["i'm tired"]
];

const botReply = [
  ["Hello!", "Hi!", "Hey!", "Hi there!"],
  ["Okay"],
  ["Yes I am!"],
  ["I'm sorry about that. But I like you dude."],
  ["Fine... how are you?", "Pretty well, how are you?", "Fantastic, how are you?"],
  ["Getting better. There?", "Somewhat okay!", "Yeah fine. Better stay home!"],
  ["Nothing much", "About to go to sleep", "Can you guess?", "I don't know actually"],
  ["I am always young."],
  ["I am just a bot", "I am a bot. What are you?"],
  ["Mudasir Choudhry"],
  ["I am nameless", "I don't have a name"],
  ["I love you too", "Me too"],
  ["Have you ever felt bad?", "Glad to hear it"],
  ["Why?", "Why? You shouldn't!", "Try watching TV", "Chat with me."],
  ["What about?", "Once upon a time..."],
  ["Tell me a story", "Tell me a joke", "Tell me about yourself"],
  ["You're welcome"],
  ["Briyani", "Burger", "Sushi", "Pizza"],
  ["Dude!"],
  ["Yes?"],
  ["Please stay home"],
  ["Glad to hear it"],
  ["Say something interesting"],
  ["Sorry for that. Let's chat!"],
  ["Take some rest, Dude!"]
];

const alternative = [
  "Same here, dude.",
  "That's cool! Go on...",
  "Dude...",
  "Ask something else...",
  "Hey, I'm listening..."
];

const App = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [showHelpText, setShowHelpText] = useState(true);

  // Function to check if input matches frontend queries
  const isFrontendQuery = (input) => {
    return userMessage.some(querySet => 
      querySet.includes(input.toLowerCase().trim())
    );
  };

  // Function to compare and get reply
  const compare = (triggerArray, replyArray, text) => {
    let item;
    for (let x = 0; x < triggerArray.length; x++) {
      if (triggerArray[x].includes(text)) {
        let items = replyArray[x];
        item = items[Math.floor(Math.random() * items.length)];
        break;
      }
    }
    return item || alternative[Math.floor(Math.random() * alternative.length)];
  };

  // Process frontend query
  const processFrontendQuery = (input) => {
    let text = input.toLowerCase()
      .replace(/[^\w\s\d]/gi, "")
      .replace(/[\W_]/g, " ")
      .replace(/ a /g, " ")
      .replace(/i feel /g, "")
      .replace(/whats/g, "what is")
      .replace(/please /g, "")
      .replace(/ please/g, "")
      .trim();

    return compare(userMessage, botReply, text);
  };

  // Send query to backend
  const sendQueryToBackend = async (query) => {
    try {
      const response = await fetch('http://localhost:5500/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: query })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.response.trim();
    } catch (error) {
      console.error('Error:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  };

  // Function to handle the sending of messages
  const sendMessage = async () => {
    if (inputText.trim()) {
      // Add user message
      const newMessages = [...messages, { text: inputText, isUserMessage: true }];
      setMessages(newMessages);
      setShowHelpText(false);

      let botResponse;
      if (isFrontendQuery(inputText)) {
        // Handle frontend query
        botResponse = processFrontendQuery(inputText);
      } else {
        // Handle backend query
        botResponse = await sendQueryToBackend(inputText);
      }

      // Add bot response
      setMessages([...newMessages, { text: botResponse, isUserMessage: false }]);
      setInputText('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        
        {/* Top Navigation Bar */}
        <View style={styles.navbar}>
          <Text style={styles.navbarText}>MernGPT</Text>
          <TouchableOpacity style={styles.toggleButton}>
            <View style={styles.toggleLine} />
            <View style={styles.toggleLine} />
            <View style={styles.toggleLine} />
          </TouchableOpacity>
        </View>

        {/* Main Content with Chat History */}
        <View style={styles.mainContent}>
          {showHelpText && (
            <Text style={styles.helpText}>How can I help you?</Text>
          )}
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  {
                    alignSelf: item.isUserMessage ? 'flex-start' : 'flex-end',
                    backgroundColor: item.isUserMessage ? '#E0F7FA' : '#C8E6C9',
                  },
                ]}>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            style={styles.chatList}
          />
        </View>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message MernGPT"
            placeholderTextColor="#B0B0B0"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText ? '#4CAF50' : '#D3D3D3' },
            ]}
            disabled={!inputText}
            onPress={sendMessage}>
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  navbarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  toggleButton: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: 24,
    height: 16,
  },
  toggleLine: {
    height: 2,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: width * 0.05,
    paddingBottom: 10,
  },
  helpText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: '#000',
    padding: 10,
    borderRadius: 10,
  },
  chatList: {
    flex: 1,
    width: '100%',
  },
  messageContainer: {
    borderRadius: 15,
    marginVertical: 5,
    padding: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    height: 60,
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  sendButton: {
    marginLeft: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default App;