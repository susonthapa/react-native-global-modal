import React from "react"
import { ActivityIndicator, Text, View } from "react-native"

const Progress = () => {
  return (
    <View style={{
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'center',
    }}>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
      }}>Loading</Text>
      <ActivityIndicator style={{
        padding: 16,
      }} size={'large'} />
    </View>
  )
}

export default Progress
