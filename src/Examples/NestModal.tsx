import React from "react"
import { Button, Text, View } from 'react-native'
import { showGlobalModal } from "../Modal/GlobalModal"
import Expandable from "./Expandable"

const NestedModal = () => {
  return (
    <View>
      <Text>This is a Simple Modal</Text>
      <Button title='Open Another Modal' onPress={() => {
        showGlobalModal({
          Component: Expandable
          // Component: () => (
          //   <View style={{
          //     backgroundColor: 'pink',
          //     padding: 36,
          //   }}>
          //     <Text>This is a Complex Modal</Text>
          //     <Text>This is supposed to be another Modal</Text>
          //     <View style={{
          //       height: 100,
          //       width: 100,
          //       backgroundColor: 'red',
          //     }} />
          //     <Text>Another Dialog Text</Text>
          //   </View>
          // )
        })
      }} />
    </View>
  )
}

export default NestedModal