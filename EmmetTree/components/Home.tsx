import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableHighlight } from 'react-native';
import { IDecisionTree, ICategory } from '../hooks/useDecisionTree';
import { NavigationScreenProp } from 'react-navigation';

interface IProps {
  decisionTree: IDecisionTree,
  navigation: NavigationScreenProp<any, any>
}

const Home: React.FC<IProps> = (props) => {
  return (
    <View>
      <Categories
        categories={props.decisionTree.categories}
        navigation={props.navigation}
        tree={props.decisionTree} />
    </View>
  )
}

interface ICategoriesProps {
  categories: ICategory[],
  navigation: NavigationScreenProp<any, any>,
  tree: IDecisionTree
}

const Categories: React.FC<ICategoriesProps> = (props) => {

  return (
    <View style={styles.categoriesContainer}>
      {/* We use a FlatList because it creates a native scrollable view! */}
      <FlatList
        data={props.categories}
        renderItem={
          ({ item }) => (
            <TouchableHighlight
              onPress={_ => {
                props.navigation.navigate('QuestionHome', {
                  category: item,
                  tree: props.tree
                })
              }}
              underlayColor={'white'}
              activeOpacity={.9}
              style={[styles.categoryCard, { backgroundColor: item.color.toLowerCase() }]} >
              <>
                <Text style={styles.categoryTitle}>{item.title}</Text>
                <Text style={styles.categoryDetails}>{item.details}</Text>
              </>
            </TouchableHighlight>
          )
        }
        keyExtractor={item => item.title}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  categoriesContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    height: '100%'
  },
  categoryCard: {
    marginTop: 10,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  categoryTitle: {
    fontSize: 30,
    paddingLeft: 5,
    flex: 1 / 2
  },
  categoryDetails: {
    textAlign: 'left',
    flex: 1
  }
})
export default Home;