import React, { useEffect } from "react"
import { Text, View } from 'react-native'
import { showGlobalModal } from "../Modal/GlobalModal"

const AutomaticModal = () => {

  useEffect(() => {
    setTimeout(() => showGlobalModal({
      Component: () => (
        <View style={{
          backgroundColor: 'pink',
          padding: 36,
        }}>
          <Text>This is the Second Dialog</Text>
          <View style={{ width: 100, height: 100, backgroundColor: 'yellow' }} />
          <Text style={{
            fontSize: 20,
            backgroundColor: 'gray',
          }}>This is a nice image in here! Wait there is another modal!</Text>
        </View>
      )
    }), 1000)
    setTimeout(() => showGlobalModal({
      Component: () => (
        <View style={{
          backgroundColor: 'yellow',
          padding: 36,
        }}>
          <View style={{ width: 100, height: 200, backgroundColor: 'pink' }} />
          <Text style={{
            fontSize: 20,
            backgroundColor: 'gray'
          }}>This is the Third Dialog. No More dialogs</Text>
        </View>
      )
    }), 3000)
  }, [])

  return (
    <View style={{
      padding: 36,
    }}>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
      }}>This is the First Dialog. Please wait next dialog will be shown in a bit</Text>
    </View>
  )
}

export default AutomaticModal