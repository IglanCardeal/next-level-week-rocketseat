import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import PickerSelect from 'react-native-picker-select'

// import logo from '../../assets/logo.png'; // import gerando erro de TypeScript
const logo = require('../../assets/logo.png');
const bgImage = require('../../assets/home-background.png');

import style from './style';

const Home = () => {
  const navigation = useNavigation();

  const [uf, setUf] = useState<string>('');
  const [city, setCity] = useState<string>('');

  function handleNavigationPoints() {
    navigation.navigate('points', {
      uf,
      city,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={bgImage}
        style={style.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={style.main}>
          <Image source={logo} />
          <View style={{ marginBottom: 45 }}>
            <Text style={style.title}>
              Seu marketplace de coleta de residuos
            </Text>
            <Text style={style.description}>
              Ajudamos pessoas a encontrarem pontos de coleta forma eficiente.
            </Text>
          </View>
        </View>

        <View style={style.footer}>
          <TextInput
            style={style.input}
            placeholder="Digite a UF do estado"
            maxLength={2}
            value={uf}
            autoCapitalize="characters"
            autoCorrect={false}
            onChangeText={setUf}
          />
          <TextInput
            style={style.input}
            placeholder="Digite a cidade"
            value={city}
            onChangeText={setCity}
            autoCorrect={false}
          />

          <RectButton style={style.button} onPress={handleNavigationPoints}>
            <View style={style.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={style.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;
