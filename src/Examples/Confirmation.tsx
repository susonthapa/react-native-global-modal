import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  onCancelPress: () => void,
  onYesPress: () => void,
}

const Confirmation = (props: Props) => {
  return (
    <View>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: 'gray',
      }}>Are you sure?</Text>
      <View style={{
        flexDirection: 'row',
        marginTop: 16,
      }}>
        <TouchableOpacity style={{
          flex: 1,
          backgroundColor: '#FF5252',
          ...styles.button
        }} onPress={props.onCancelPress}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          flex: 1,
          backgroundColor: '#7C4DFF',
          ...styles.button,
        }} onPress={props.onYesPress}>
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    padding: 8,
    marginRight: 4,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  }
})

export default Confirmation
