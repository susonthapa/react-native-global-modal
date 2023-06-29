import React from "react"
import { Text, View } from 'react-native'

const LongContent = () => {
  return (
    <View style={{
      alignItems: 'center',
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
      }}>This is the starting of a long content</Text>
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
      <View style={{
        width: 250,
        height: 100,
        backgroundColor: 'yellow',
      }} />
      <Text style={{
        fontSize: 18,
        color: 'gray',
        padding: 8,
      }}>This is a yellow box with size 250x100</Text>
    </View>
  )
}

export default LongContent