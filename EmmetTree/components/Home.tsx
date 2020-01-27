import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IDecisionTree, ICategory } from '../hooks/useDecisionTree';

interface IProps {
  decisionTree: IDecisionTree
}

const Home: React.FC<IProps> = (props) => {
  useEffect(() => {
    console.log(props.decisionTree)
  }, [])

  return (
    <View style={styles.container}>
      <Categories categories={props.decisionTree.categories} />
    </View>
  )
}

interface ICategoriesProps {
  categories: ICategory[]
}

const Categories: React.FC<ICategoriesProps> = (props) => {
  console.log(props)

  Object.values(props.categories).map(category => console.log(category))

  return (
    <View style={styles.categoriesContainer}>
      {Object.values(props.categories).map((category, i) => {
          return (
            <View style={[styles.categoryCard, {backgroundColor: 'orange'}]} key={i} >
              <Text>{category.title}</Text>
            </View>
          )
      })}
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    backgroundColor: 'green'
  },
  categoriesContainer: {
    paddingLeft: 10,
    paddingRight: 10
  },
  categoryCard: {
    // backgroundColor: 'blue',
    marginTop: 10
  }
})
export default Home;