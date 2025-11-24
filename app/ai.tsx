import {useState, useRef, useEffect, useCallback } from "react";
import Markdown from "react-native-markdown-display";
import * as SecureStore from "expo-secure-store";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from "react-native";
// --- CHANGE: Use expo-clipboard ---
import * as Clipboard from 'expo-clipboard'; 
// ---------------------------------


// Original code
// --- TYPE DEFINITIONS ---
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isTyping?: boolean;
}

// --- CONFIGURATION ---
const API_KEY = "AIzaSyDO1IzSIgDtmeX6RKX4m-QvwBrIX2_3RHJU"
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const MAX_INPUT_HEIGHT = 120;
const MIN_INPUT_HEIGHT = 50;

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hello! I'm Juno, your intelligent learning assistant, created by the Recallr team. You can try asking me to **explain** something or *list* steps. Long press this bubble to copy the text!",
    sender: 'bot',
  },
];

// --- CHAT BUBBLE COMPONENT ---

const ChatBubble = ({ message, handleCopy, copiedMessageId }: { message: Message, handleCopy: (text: string, id: number) => void, copiedMessageId: number | null }) => {
  const isUser = message.sender === 'user';
  const bubbleStyle = isUser ? styles.userBubble : styles.botBubble;
  const textStyle = isUser ? {body: {color: "#fff"}} : {body: {color: "#000000ff"}};

  const isTyping = message.isTyping === true; 
  const isCopied = copiedMessageId === message.id;

  return (
    <View style={isUser ? styles.userContainer : styles.botContainer}>
      {/* Bot Avatar */}
      {!isUser && (
        <Image
          source={require('../assets/images2/icons8-bot-96.png')}
          style={styles.avatar}
        />
      )}
      
      {/* Wrapper for Long Press */}
      <TouchableOpacity 
        activeOpacity={0.8}
        // Only allow copy if it's not the typing indicator
        onLongPress={!isTyping ? () => handleCopy(message.text, message.id) : undefined}
        style={{maxWidth: '100%'}} 
      >
        {/* Message Bubble */}
        <View style={bubbleStyle}>
          {isTyping ? (
            <ActivityIndicator size="small" color={isUser ? '#FFF' : '#555'} />
          ) : (
            <Markdown style={textStyle}>
              {message.text}
            </Markdown>
          )}
        </View>
        
        {/* Confirmation Text */}
        {isCopied && (
          <Text style={[styles.copyConfirmation, isUser ? styles.userCopyText : styles.botCopyText]}>
            Copied!
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};


// --- MAIN COMPONENT ---

export default function Home() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT); 
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);

  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const handleContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    const newHeight = event.nativeEvent.contentSize.height;
    setInputHeight(Math.min(MAX_INPUT_HEIGHT, Math.max(MIN_INPUT_HEIGHT, newHeight)));
  };

  const handleCopy = useCallback((textToCopy: string, id: number) => {
    Clipboard.setString(textToCopy);
    setCopiedMessageId(id);
    
    const timer = setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = useCallback(async () => {
    if (!text.trim() || isLoading) return;

    const userMessageText = text.trim();
    const userMessage: Message = {
      id: Date.now() + Math.random(), 
      text: userMessageText,
      sender: 'user',
    };
    
    const typingMessage: Message = {
      id: Date.now() + Math.random() + 1,
      text: "Juno is typing...",
      sender: 'bot',
      isTyping: true,
    };

    setMessages(prev => [...prev, userMessage, typingMessage]);
    setText("");
    setIsLoading(true);

    try {
      // 1. CONSTRUCT HISTORY FOR CONTEXT
      const historyForApi = messages
          .filter(msg => !msg.isTyping) 
          .map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
          }));
      
      historyForApi.push({ role: 'user', parts: [{ text: userMessageText }] });

      const payload = {
          contents: historyForApi
      };

      const maxRetries = 3;
      let response: Response | undefined;
      for (let i = 0; i < maxRetries; i++) {
        try {
          response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (response.ok) {
            break;
          } else {
            console.warn(`Attempt ${i + 1} failed with status: ${response.status}`);
            if (i === maxRetries - 1) throw new Error(`API failed after ${maxRetries} attempts.`);
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
          }
        } catch (e) {
          if (i === maxRetries - 1) throw e;
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
      
      if (!response) {
          throw new Error("Failed to get API response after all retries.");
      }

      const result = await response.json();
      const botResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text || 
                              "Sorry, I couldn't generate a response. Please try again.";

      // 2. Remove typing indicator and add final bot response
      setMessages(prev => {
        const newMessages = prev.filter(msg => !msg.isTyping);
        newMessages.push({
          id: Date.now() + Math.random() + 2,
          text: botResponseText,
          sender: 'bot', 
        });
        return newMessages;
      });

    } catch (error) {
      console.error("Gemini API Error:", error);
      // Remove typing indicator and show error message
      setMessages(prev => {
        const newMessages = prev.filter(msg => !msg.isTyping);
        newMessages.push({
          id: Date.now() + Math.random() + 2,
          text: "I'm having trouble connecting right now. Please try again.",
          sender: 'bot',
        });
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      setInputHeight(MIN_INPUT_HEIGHT); // Reset input height
    }
  }, [text, isLoading, messages]); 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E0E0E0" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>

            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.chatContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              indicatorStyle="black"
            >
              {messages.map((message) => (
                <ChatBubble 
                  key={message.id} 
                  message={message} 
                  handleCopy={handleCopy}
                  copiedMessageId={copiedMessageId}
                />
              ))}
            </ScrollView>


            {/* Input at bottom */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>

                <TextInput
                  placeholder="Type your message..."
                  placeholderTextColor="#797979"
                  multiline
                  scrollEnabled={true} 
                  value={text}
                  onChangeText={setText}
                  style={[styles.textbox, { height: inputHeight }]} 
                  selectionColor="#1E90FF"
                  editable={!isLoading}
                  onContentSizeChange={handleContentSizeChange} 
                  
                  
                  // Platform-specific props can remain as spread or be simplified
                  {...(Platform.OS === 'ios' && { indicatorStyle: 'black' })}
                  {...(Platform.OS === 'android' && { persistentScrollbar: true })}
/>

                <TouchableOpacity 
                  style={styles.sendButton}
                  onPress={handleSend}
                  disabled={!text.trim() || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#1E90FF" style={styles.sendIcon} />
                  ) : (
                    <Image
                      source={require("../assets/images2/sent.png")}
                      style={[styles.sendIcon, { tintColor: text.trim() ? '#1E90FF' : '#797979' }]}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E0E0",
  },
  chatContainer: {
    padding: 10,
    paddingTop: 20,
    flexGrow: 1, 
    justifyContent: 'flex-end', 
  },
  
  // --- MARKDOWN STYLES ---
  markdownBold: {
    fontWeight: 'bold',
  },
  markdownItalic: {
    fontStyle: 'italic',
  },
  
  // --- MESSAGE STYLES ---
  
  botContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginBottom: 8,
    marginRight: 40,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end', 
    marginBottom: 8,
    marginLeft: 40,
  },
  
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
    backgroundColor: '#FFF',
  },

  messageText: {
    fontSize: 15,
  },
  userText: {
    fontSize: 15,
    color: '#FFF',
  },
  botText: {
    fontSize: 15,
    color: '#000',
  },
  userBubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#FF9800', 
    overflow: 'hidden', 
  },
  botBubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF', 
    overflow: 'hidden',
  },

  // --- COPY CONFIRMATION STYLES ---
  copyConfirmation: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
  userCopyText: {
    color: '#797979',
    textAlign: 'right',
    alignSelf: 'flex-end', // Aligns the text under the user bubble
    paddingRight: 10, // Small offset
  },
  botCopyText: {
    color: '#797979',
    textAlign: 'left',
    alignSelf: 'flex-start', // Aligns the text under the bot bubble
    paddingLeft: 34, // Offset for the bot avatar space + small gap
  },

  // --- INPUT STYLES ---

  inputWrapper: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    backgroundColor: '#E0E0E0',
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25, 
    paddingHorizontal: 10,
    alignItems: "flex-end", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    elevation: 2,
    minHeight: 50,
  },
  
  textbox: {
    flex: 1,
    fontSize: 16,
    // Ensure text starts at the top for multi-line input
    textAlignVertical: "top", 
    paddingVertical: 12, // Standardized vertical padding
    paddingLeft: 10,
    maxHeight: MAX_INPUT_HEIGHT,
    minHeight: MIN_INPUT_HEIGHT, // Ensure it starts at MIN_INPUT_HEIGHT
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
    marginBottom: 4,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
});

