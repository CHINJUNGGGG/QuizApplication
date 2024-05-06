import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import Option from './components/Option';
import { useEffect, useState } from 'react';
import { quizData } from './questions';
import Results from './components/Results';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DataItem {
  name: string;
  score: any;
}

export default function App() {

  const [questions, setQuestions] = useState<any>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showLeader, setShowLeader] = useState(false);
  const [checkIfSelected, setCheckIfSelected] = useState({
    option1: false,
    option2: false,
    option3: false,
    option4: false,
  })
  const [percentageComplete, setPercentageComplete] = useState(0)
  const [questionComplete, setQuestionComplete] = useState(0)
  const [users, setUsers] = useState("");
  const [data, setData] = useState<DataItem[]>([]);

  const shuffleQuiz = () => {
    const shuffledQuestions = quizData.map(question => ({
      ...question,
      options: question.options.sort(() => Math.random() - 0.5)
    }));
    const shuffledQuiz = shuffledQuestions.sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuiz);
  };

  useEffect(() => {
    shuffleQuiz()
    setUsers("Anonymous_users")
  }, [])
  
  let currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    let percentage = (currentQuestionIndex + 1) * 5
    let questionAnswer = (currentQuestionIndex + 1) * 1

    setPercentageComplete(percentage);
    setQuestionComplete(questionAnswer);
  }, [currentQuestionIndex]);


  const handleNext = () => {
    let correctAnswer = questions[currentQuestionIndex]?.answer;

    if (selectedOption === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < questions?.length - 1) {
      setCurrentQuestionIndex((prevQuestion) => prevQuestion + 1);
    } else {
      storeData(score);
      setShowResult(true);
    }

    setCheckIfSelected({
      option1: false,
      option2: false,
      option3: false,
      option4: false,
    
    })
  }

  const storeData = async (value: number) => {
    try {
      const object: DataItem = { name: users, score: value };
      const newData = [...data, object];
      setData(newData);
      const leaderBoard = JSON.stringify(newData);
      await AsyncStorage.setItem('leaderBoard', leaderBoard);
    } catch (e) {
      console.log('error ' + e)
    }
  };

  const checkOptionOne = () => {
    setCheckIfSelected({
      option1: true,
      option2: false,
      option3: false,
      option4: false,
    });
  };

  const checkOptionTwo = () => {
    setCheckIfSelected({
      option1: false,
      option2: true,
      option3: false,
      option4: false,
    });
  };

  const checkOptionThree = () => {
    setCheckIfSelected({
      option1: false,
      option2: false,
      option3: true,
      option4: false,
    });
  };

  const checkOptionFour = () => {
    setCheckIfSelected({
      option1: false,
      option2: false,
      option3: false,
      option4: true,
    });
  };

  const restart = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
  }

  const leaderBoard = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setShowLeader(true)
  }

  const back = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowLeader(false)
  }


  const renderLeaderboardItem = ({ item }: { item: DataItem }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
      <Text>{item.name}</Text>
      <Text>{item.score}</Text>
    </View>
  );

  if (showResult) return  <Results restart={restart} score={score} leaderBoard={leaderBoard} />
  if (showLeader) return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Leaderboard</Text>
        <FlatList
          data={data}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item, i) => item.name + `_${i}`}
        />
        <View>
          <TouchableOpacity onPress={back} activeOpacity={.8} style={styles.btn} >
            <Text style={{color:"white", fontWeight: "600"}} >Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )    


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <SafeAreaView>
        <View style={styles.countwrapper} >
          <Text style={{fontWeight: "600"}} >{currentQuestionIndex + 1}/{questions?.length}</Text>
        </View>

        <View style={styles.questionwrapper} >

          <View style={styles.progresswrapper} >
            <View style={[styles.progressBar, {width: `${percentageComplete}%`}]} ></View>
            <View style={styles.progresscount} >
                <Text style={styles.percentage}>{questionComplete}</Text>
            </View>
          </View>

         <Text style={{ fontWeight: "500", textAlign: "center", fontSize: 18 }}>
            {currentQuestion?.question}
         </Text>
        </View>

        <View style={styles.optionswrapper} >
          <Option setSelectedOption={setSelectedOption} checkIfSelected={checkOptionOne} isSelected={checkIfSelected.option1} option={currentQuestion?.options[0]} />
          <Option setSelectedOption={setSelectedOption} checkIfSelected={checkOptionTwo} isSelected={checkIfSelected.option2} option={currentQuestion?.options[1]} />
          <Option setSelectedOption={setSelectedOption} checkIfSelected={checkOptionThree} isSelected={checkIfSelected.option3} option={currentQuestion?.options[2]} />
          <Option setSelectedOption={setSelectedOption} checkIfSelected={checkOptionFour} isSelected={checkIfSelected.option4} option={currentQuestion?.options[3]} />
        </View>

        <TouchableOpacity onPress={handleNext} activeOpacity={.8} style={styles.btn} >
          <Text style={{color:"white", fontWeight: "600"}} >Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e4e4e4',
    padding: 20,
  },
  countwrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  questionwrapper: {
    marginTop: 60,
    width: "100%",
    height: 180,
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    alignItems: "center",
  },
  progresswrapper: {
    width: 70,
    height: 70,
    backgroundColor: "#d6c7ff",
    borderRadius: 50,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    marginBottom: 30,
    marginTop: -50,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3503c3",
    alignSelf: "flex-end",
  },
  progresscount: {
    height: 58,
    width: 58,
    borderRadius: 50,
    backgroundColor: "#fff",
    zIndex: 10,
    position: "absolute",
    top: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontWeight: "600",
    fontSize: 18,
    color: "#004643",
  },
  optionswrapper: {
    marginTop: 40,
    width: "100%",
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 16,
    backgroundColor: "#3503c3",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  containerLeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
