import React from 'react';
import { 
  View,
  Text,
  ActionSheetIOS
} from 'react-native';

let BUTTONS = [
  'Option 0',
  'Option 1',
  'Option 2',
  'Destruct',
  'Cancel',
];
let DESTRUCTIVE_INDEX = 3;
let CANCEL_INDEX = 4;

const ActionExample: React.FC = () => {

  const showActions = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
      destructiveButtonIndex: DESTRUCTIVE_INDEX,
    },
    (buttonIndex) => {
      console.log(BUTTONS[buttonIndex]);
      alert(BUTTONS[buttonIndex])
      // this.setState({ clicked: BUTTONS[buttonIndex] });
    });
  }

  return (
    <View>
      <Text onPress={showActions}>Howdy</Text>
    </View>
  )  
}

export default ActionExample;