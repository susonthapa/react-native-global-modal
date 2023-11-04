import React, { useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

const Expandable = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <View style={{
      alignItems: 'center',
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
      }}>This is the starting of a long content</Text>
      <Button title="Toggle" onPress={() => setIsExpanded((isExpanded) => !isExpanded)} />
      {isExpanded &&
        <View>
          <View style={{
            width: 200,
            height: 200,
            backgroundColor: 'pink',
          }} />
          <Text style={{
            fontSize: 18,
            color: 'gray',
            padding: 8,
          }}>You can see the Pink Box above with a size 200x200</Text>
        </View>
      }
    </View>
  )
}

export default Expandable