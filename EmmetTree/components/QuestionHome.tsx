import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, FlatList } from 'react-native';
import { IDecisionTree, ICategory, IQuestion, IOption } from '../hooks/useDecisionTree';
import { NavigationScreenProp } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

interface IQuestionHomeProps {
  decisionTree: IDecisionTree, // whole decision tree to generate data object to traverse the tree
  category: ICategory, // selected category
  navigation: NavigationScreenProp<any, ParamProps>
}

interface ParamProps {
  category: ICategory;
  tree: IDecisionTree;
}

enum ActionTypes {
  SELECT = 'SELECT-ID',
  RESELECT = 'RESELECT-ID'
}

interface IPastQuestion {
  id: string,
  questionId: string,
  question: string,
  answer: string
}

const QuestionHome: React.FC<IQuestionHomeProps> = (props) => {
  const navigation = props.navigation;
  const [category] = useState<ICategory>(navigation.state.params.category)
  const [loading, setLoading] = useState<boolean>(true);
  const [question, setQuestion] = useState<IQuestion | undefined>(undefined);
  const [questions] = useState<IQuestion[]>(navigation.state.params.tree.questions);
  const [pastQuestions, setPastQuestions] = useState<IPastQuestion[]>([]);

  /**
   * This is pretty hacky... essentially, when the component loads,
   * we are tellig the question manager "hey, this is the first 
   * question based on the incoming category!"
   */
  useEffect(() => {
    selectQuestion(category.next);
  }, []);

  /**
   * This hook watches for changes to the "current question" and ensures
   * that we properly set the loading status based on the changes (so, if
   * we accidentally select a question that doesn't exist, we'd throw an 
   * error and so we'd want to make sure we set the status to loading)
   */
  useEffect(() => {
    if (question !== undefined && question.options !== undefined) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [question]);

  const revertToQuestion = (questionId: string) => {
    if (questionId === '') {
      throw new Error("Can't revert to any question cause the provided ID was an empty string.")
    }

    let pastQuestionIndex = -1;

    // find the index value in the pastQuestionsArray for the question
    // that we are reverting to so we know how much we need to strip
    // the array by
    for (let i = 0; i < pastQuestions.length; i++) {
      let pastQuestion: IPastQuestion = pastQuestions[i];
      if (pastQuestion.questionId === questionId) {
        pastQuestionIndex = i;
        break;
      }
    }

    // remove old past questions up to the point of the selected question
    setPastQuestions(pqs => pqs.splice(0, pastQuestionIndex))

    selectQuestion(questionId, true)
  }

  const selectQuestion = (questionId: string, revert: boolean = false) => {
    if (questionId === '') return

    let filterResults = questions.filter((question: IQuestion) => {
      // console.log('>>>' + question.id + '==' + questionId + '<<<')
      if (question.id === questionId) {
        // console.log(question);
      }
      return question.id === questionId;
    })

    // this shoould almost be true since the front-end
    // guarantees unique question ids
    if (filterResults.length === 1) {

      // this is a little naughty, but when we're using selectQuestion
      // from the revertToQuestion function, we don't want to add to 
      // past questions array
      if (!revert) {
        // add current question to pastQuestions
        addToPastQuestions(questionId);
      }

      let nextQuestion = filterResults[0];

      this.currentQuestion = nextQuestion;

      // callback is a setState hook!
      setQuestion(nextQuestion);
    } else {
      throw new Error('The ID ' + questionId + ' return multipled questions. Question IDs should be unique!')
    }
  }

  const addToPastQuestions = (optionId: string) => {
    let currentQuestion = this.currentQuestion;

    if (question !== undefined) {
      let selectedQuestion = questions.filter((question: IQuestion) => {
        let correct = false;
        question.options.map((option: IOption) => {
          if (option.next === optionId) {
            correct = true
          }
        })
        return correct;
      })[0];

      // if this is undefined, we've reached a base question and need to 
      // empty out the pastQuestions array
      if (selectedQuestion === undefined) {
        setPastQuestions(pqs => []);
      } else {
        let selectedOption = selectedQuestion.options.filter((option: IOption) => {
          return (option.next === optionId);
        })[0];

        let pastQuestion: IPastQuestion = {
          id: optionId,
          questionId: selectedQuestion.id,
          question: currentQuestion.text,
          answer: selectedOption.text
        }

        setPastQuestions(pqs => pqs.concat(pastQuestion));
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {
        // Wait to see if we've loaded a question
        (loading) ? (
          <View>
            <ActivityIndicator size="large" />
          </View>
        ) : (
            <View style={{ padding: 14 }} >
              {/* Past Answers */}
              <View>
                {/* Use different logic to render this component */}
                {
                  (pastQuestions.length > 0) ? (
                    <Text style={styles.title}>Past Answers</Text>
                  ) : (null)
                }
                <View style={styles.pastQuestionsContainer}>
                  <FlatList
                    style={styles.pastQuestions}
                    data={pastQuestions}
                    renderItem={({ item }) => <Item pastQuestion={item} callback={revertToQuestion} />}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={true}
                  />
                </View>
              </View >

              {/* Current Question */}
              <View style={{ paddingTop: 14 }}>
                {
                  (question.options.length === 0) ? (
                    <Text style={styles.title}>SUGGESTED SOLUTION</Text>
                  ) : (
                      <Text style={styles.title}>Current Question</Text>
                    )
                }

                <View style={styles.questionContainer}>
                  <TouchableOpacity style={styles.questionContainer} >
                    <Text style={styles.question}>{question.text}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Answer Choices */}
              {
                (question.options.length > 0) ? (
                  <View style={{ paddingTop: 14 }}>
                    <Text style={styles.title}>Answer Choices</Text>
                    <View style={styles.optionsContainer}>
                      {
                        question.options
                          .sort((a, b) => a.order - b.order)
                          .map((option: IOption, index: number) => (
                            <View style={styles.answerCardContainer} key={'answerchoice-' + index}>
                              <TouchableOpacity
                                style={[styles.answerCard, { backgroundColor: category.color.toLowerCase() }]}
                                onPress={() => {
                                  selectQuestion(option.next);
                                }}
                                key={'answer-' + index}
                              >
                                <Text style={styles.answerText}>
                                  {option.text}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ))
                      }
                    </View>
                  </View>
                ) : (null)
              }
            </View>
          )
      }

    </SafeAreaView >
  )
}


function Item({ pastQuestion, callback }) {

  const jumpTo = () => {
    Alert.alert(
      'Are you sure?',
      'Are you sure want to jump back to the question: "' + pastQuestion.question + '" and change your answer?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes', onPress: () => {
            callback(pastQuestion.questionId)
          }
        },
      ],
      { cancelable: false },
    )
  }

  return (
    <TouchableOpacity
      activeOpacity={.8}
      onLongPress={_ => jumpTo()}
    >
      <View style={styles.item}>

        <Text style={styles.itemQuestion}>{pastQuestion.question}</Text>
        <Text style={styles.itemAnswer}>{pastQuestion.answer}</Text>

      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    paddingTop: 0,

  },
  questionContainer: {
    padding: 14,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  title: {
    paddingLeft: 10,
    fontSize: 20,
    marginBottom: 7
  },
  question: {
    fontSize: 50,
    color: '#000'
  },
  answerCardContainer: {
    flexGrow: 1,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  answerCard: {
    height: 80,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  answerText: {
    fontWeight: '400',
    fontSize: 40,
    color: '#000'
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    marginTop: 3,
    flexDirection: 'row'
  },
  itemQuestion: {
    textAlign: 'left',
    flex: 1
  },
  itemAnswer: {
    fontWeight: '700',
    fontSize: 20,
    paddingLeft: 5,
  },
  pastQuestions: {
    maxHeight: 100,
  },
  pastQuestionsContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  }
})


export default QuestionHome;
