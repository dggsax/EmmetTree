import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, StatusBar, Platform } from 'react-native';
import InternetStatus from './components/InternetStatus';
import Home from './components/Home';
import useDecisionTree, { IDecisionTree } from './hooks/useDecisionTree';


export default function App() {
  const tree = useDecisionTree();

  return (
    <View>
      <MyStatusBar />

      <View style={styles.container}>

        {/* This is the header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Hi, Emmet!</Text>
          <InternetStatus />
        </View>

        {/* This is where the body goes */}
        {
          tree !== undefined ? (
            <Home decisionTree={tree} />
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
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  header: {
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'pink'
  },
  headerText: {
    fontSize: 30
  }
});

const MyStatusBar: React.FC = () => {
  const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

  return (
    <View style={{ height: STATUSBAR_HEIGHT }} >
      <StatusBar />
    </View>
  )
}