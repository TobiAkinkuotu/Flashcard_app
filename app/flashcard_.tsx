import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; 


// --- BACKEND (MOCK DATA) ---
const defaultFlashcards = [
  {
    id: '1',
    question: 'What is the basic unit of life?',
    answer: 'The Cell',
  },
  {
    id: '2',
    question: 'What molecule carries genetic instructions?',
    answer: 'DNA',
  },
  {
    id: '3',
    question: 'What is the PowerHouse of the cell?',
    answer: 'The mitochondrion is the powerhouse of the Cell.',
  },
];

// --- FRONTEND (UI) ---
export default function FlashcardScreen() {
  
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [isAnswerVisible, setIsAnswerVisible] = useState(false); 
  const { cards, filename } = useLocalSearchParams();
  const cardsString = Array.isArray(cards) ? cards[0] : cards;
  const FLASHCARDS_DATA = cardsString ? JSON.parse(cardsString) : defaultFlashcards;
  const router = useRouter();
  
  const totalCards = FLASHCARDS_DATA.length; 
  const currentCard = FLASHCARDS_DATA[currentIndex];

  // Calculate Progress
  const progressWidth = ((currentIndex + 1) / totalCards) * 100;

  const handleNextCard = () => {
    if (currentIndex < FLASHCARDS_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsAnswerVisible(false); 
    } else {
      alert("End of cards!"); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={ () => router.push('/docs')}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{filename} Card {currentIndex + 1}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* 2. Main Content */}
      <ScrollView>
<View style={styles.content}>
        
        {/* The Flashcard */}
        <View style={styles.card}>
          <Text style={styles.questionText}>
            {currentCard ? currentCard.question : "No card data found"}
          </Text>
        </View>

        {/* Show Answer Button */}
        <TouchableOpacity 
          style={styles.showAnswerBtn}
          onPress={() => setIsAnswerVisible(!isAnswerVisible)}
        >
          <Text style={styles.showAnswerBtnText}>
            {isAnswerVisible ? "Hide Answer" : "Show Answer"}
          </Text>
        </TouchableOpacity>

        {/* Answer Section */}
        {isAnswerVisible && (
          <View>
          <View style={styles.answerBox}>
            <Text style={styles.answerText}>
              {currentCard ? currentCard.answer : ""}
            </Text>
          </View>


          <Text style={styles.recallLabel}>Rate your recall</Text>
        
          <View style={styles.recallButtons}>
            {/* Green Check - Moves to next card */}
            <TouchableOpacity style={styles.iconButton} onPress={handleNextCard}>
                <Ionicons name="checkmark" size={40} color="#22C55E" />
            </TouchableOpacity>
            
            {/* Red X - Moves to next card */}
            <TouchableOpacity style={styles.iconButton} onPress={handleNextCard}>
              <Ionicons name="close" size={40} color="#EF4444" />
            </TouchableOpacity>
          </View>
          </View>
        )}
      </View>

      {/* 3. Bottom Section (Recall & Progress) */}
      <View style={styles.bottomSection}>
        

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progressWidth}%` }]} />
        </View>
        
        <Text style={styles.progressText}>
          Card {currentIndex + 1} of {totalCards}
        </Text>
      </View>
      </ScrollView>
      

    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    width: '100%',
    aspectRatio: 1, 
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 30,
  },
  showAnswerBtn: {
    backgroundColor: '#FF8C00', 
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '70%',
    alignItems: 'center',
    marginBottom: 20,
  },
  showAnswerBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  answerBox: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
  },
  answerText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    marginBottom: 10,
  },
  answerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  addNotesText: {
    color: '#FF8C00',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  bottomSection: {
    padding: 20,
  },
  
  recallLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    marginBottom: 15,
  },
  recallButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60, 
    marginBottom: 20,
  },
  iconButton: {
    padding: 5,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0F2FE', 
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF8C00', 
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
});