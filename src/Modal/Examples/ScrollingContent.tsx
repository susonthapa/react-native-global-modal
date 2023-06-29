import React from "react"
import { ScrollView, useWindowDimensions, View } from 'react-native'
import LongContent from "./LongContent"

const ScrollingContent = () => {
  const { height } = useWindowDimensions()
  return (
    <View style={{
      height: height * 0.65
    }}>
      <ScrollView>
        <LongContent />
        <LongContent />
        <LongContent />
        <LongContent />
        <LongContent />
      </ScrollView>
    </View>
  )
}

export default ScrollingContent