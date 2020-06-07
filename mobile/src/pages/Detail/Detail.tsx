import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MailCompose from 'expo-mail-composer';

import style from './style';
import api from '../../services/api';

interface Params {
  point_id: number;
}

interface Point {
  id: number;
  name: string;
  city: string;
  uf: string;
  whatsapp: string;
  email: string;
  image_url: string;
  items: [
    {
      title: string;
    },
  ];
}

const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;

  const [point, setPoint] = useState<Point>();

  function handleNavidateBack() {
    navigation.goBack();
  }

  function handleComposerMail() {
    const { email } = point as Point;

    MailCompose.composeAsync({
      subject: 'Interesse na coleta de residuos',
      recipients: [email],
    });
  }

  function handleWhatsapp() {
    const { whatsapp } = point as Point;

    Linking.openURL(`whatsapp://send?phone=${whatsapp}`);
  }

  useEffect(() => {
    api
      .get(`points/${routeParams.point_id}`)
      .then((response) => {
        setPoint(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={style.container}>
        <TouchableOpacity onPress={handleNavidateBack}>
          <Icon name="arrow-left" size={30} color="#34cb79" />
        </TouchableOpacity>

        {point && (
          <View>
            <Image
              style={style.pointImage}
              source={{
                uri: point.image_url,
              }}
            />

            <Text style={style.pointName}>{point.name}</Text>
            <Text style={style.listItemsTitle}>
              <Icon name="trash-2" /> Items reciclaveis
            </Text>
            {point.items.map((item) => (
              <Text key={item.title} style={style.pointItems}>
                <Icon name="arrow-right-circle" /> {item.title}
              </Text>
            ))}

            <View style={style.address}>
              <Text style={style.addressTitle}>
                <Icon name="map-pin" /> Endereco
              </Text>
              <Text style={style.addressContent}>
                {point.city}, {point.uf}
              </Text>
            </View>
          </View>
        )}
      </View>

      {point && (
        <View style={style.footer}>
          <RectButton style={style.button} onPress={handleWhatsapp}>
            <FontAwesome name="whatsapp" size={20} color="#fff" />
            <Text style={style.buttonText}>{point.whatsapp}</Text>
          </RectButton>
          <RectButton style={style.button} onPress={handleComposerMail}>
            <Icon name="mail" size={20} color="#fff" />
            <Text style={style.buttonText}>{point.email}</Text>
          </RectButton>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Detail;
