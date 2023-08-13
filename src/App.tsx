/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Button, Modal, SafeAreaView, StatusBar, Text,
  useColorScheme,
  View
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import AutomaticModal from './Examples/AutomaticModal';
import Confirmation from './Examples/Confirmation';
import LongContent from './Examples/LongContent';
import NestedModal from './Examples/NestModal';
import Progress from './Examples/Progress';
import ScrollingContent from './Examples/ScrollingContent';
import GlobalModal, { hideGlobalModal, showGlobalModal } from './Modal/GlobalModal';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={{
          alignItems: 'center',
          height: '100%',
          justifyContent: 'space-evenly',
        }}>
          <Text style={{
            fontSize: 32,
            color: 'gray',
            fontWeight: 'bold',
          }}>Global Dialog Test</Text>
          <Button title='Open 3 Modals' onPress={() => {
            showGlobalModal({
              Component: AutomaticModal
            })
          }} />
          <Button title='Nested Modal' onPress={() => {
            showGlobalModal({
              Component: NestedModal
            })
          }} />
          <Button title='Progress Modal' onPress={() => showGlobalModal({ Component: Progress })} />
          <Button title='Confirmation Modal' onPress={() => showGlobalModal({
            modalKey: 'confirmation-modal',
            Component: () => <Confirmation onCancelPress={() => hideGlobalModal('confirmation-modal')} onYesPress={() => hideGlobalModal('confirmation-modal')} />,
            hideClose: true
          })} />
          <Button title='Long Content Modal' onPress={() => showGlobalModal({
            Component: () => <LongContent />,
          })} />
          <Button title='Scrolling Content Modal' onPress={() => showGlobalModal({
            Component: () => <ScrollingContent />,
          })} />
          <Button title='Show All' onPress={() => {
            showGlobalModal({
              Component: NestedModal
            })
            setTimeout(() => {
              showGlobalModal({
                Component: Progress
              })
              setTimeout(() => {
                showGlobalModal({
                  modalKey: 'confirmation-modal',
                  Component: () => <Confirmation onCancelPress={() => hideGlobalModal('confirmation-modal')} onYesPress={() => hideGlobalModal('confirmation-modal')} />,
                  hideClose: true
                })
                setTimeout(() => {
                  showGlobalModal({
                    Component: LongContent
                  })
                  setTimeout(() => {
                    showGlobalModal({
                      Component: ScrollingContent,
                    })
                  }, 1000)
                }, 1000)
              }, 1000)
            }, 1000)
          }} />
        </View>
        <GlobalModal />
      </SafeAreaView>
    </>
  );
}

export default App;
