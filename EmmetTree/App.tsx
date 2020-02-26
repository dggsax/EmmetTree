import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  Button
} from 'react-native';
import Home from './components/Home';
import QuestionHome from './components/QuestionHome';
import useDecisionTree from './hooks/useDecisionTree';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const MainNavigator = createStackNavigator({
  Home: {
    screen: Base,
    navigationOptions: {
      headerShown: false,
    }
  },
  QuestionHome: {
    screen: QuestionHome,
  }
});

const AppContainer = createAppContainer(MainNavigator);

export default function App() {
  return (
    <AppContainer />
  )
}

function Base(props) {
  const { treeText, refreshTreeFromWeb}  = useDecisionTree();
  
  return (
    <View>
      {Platform.OS === 'ios' ? (
        <MyStatusBar />
      ) : (
        <></>
      )}


      <View style={styles.container}>

        {/* This is the header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Hi, Emmet!</Text>
          <Button title="Refresh" onPress={refreshTreeFromWeb}/>
          {/* <InternetStatus /> */}
        </View>

        {/* This is where the body goes */}
        {
          treeText !== undefined ? (
            <Home decisionTree={treeText} {...props} />
          ) : (
              <ActivityIndicator size="large" />
            )
        }
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fafafa',
    justifyContent: 'space-between',
  },
  header: {
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30
  }
});

const MyStatusBar: React.FC = () => {
  const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 30 : StatusBar.currentHeight;

  return (
    <View style={{ height: STATUSBAR_HEIGHT }} >
      <StatusBar />
    </View>
  )
}