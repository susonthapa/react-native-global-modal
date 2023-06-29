/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Button,
  SafeAreaView, StatusBar, Text,
  useColorScheme,
  View
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import GlobalModal, { showGlobalModal } from './GlobalModal';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View>
        <Text>Global Dialog Test</Text>
        <Button title='Open 3 Dialogs' onPress={() => {
          showGlobalModal({
            Component: () => (
              <View style={{
                backgroundColor: 'gray',
                padding: 36,
              }}>
                <Text>This is the First Dialog</Text>
              </View>
            )
          })
          setTimeout(() => showGlobalModal({
            Component: () => (
              <View style={{
                backgroundColor: 'pink',
                padding: 36,
              }}>
                <Text>This is the Second Dialog</Text>
              </View>
            )
          }), 1000)
          setTimeout(() => showGlobalModal({
            Component: () => (
              <View style={{
                backgroundColor: 'yellow',
                padding: 36,
              }}>
                <Text>This is the Third Dialog</Text>
              </View>
            )
          }), 3000)
        }} />
        <Button title='Nested Modal' onPress={() => {
          showGlobalModal({
            Component: () => (
              <View>
                <Text>This is a Simple Modal</Text>
                <Button title='Open Another Modal' onPress={() => {
                  showGlobalModal({
                    Component: () => (
                      <View style={{
                        backgroundColor: 'pink',
                        padding: 36,
                      }}>
                        <Text>This is a Complex Modal</Text>
                        <Text>This is supposed to be another Modal</Text>
                        <View style={{
                          height: 100,
                          width: 100,
                          backgroundColor: 'red',
                        }} />
                        <Text>Another Dialog Text</Text>
                      </View>
                    )
                  })
                }} />
              </View>
            )
          })
        }} />
      </View>
      <GlobalModal />
    </SafeAreaView>
  );
}

export default App;
