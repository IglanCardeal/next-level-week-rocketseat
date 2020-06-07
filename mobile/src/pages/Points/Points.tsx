import React, { useState, useEffect } from 'react';
import Emoji from 'react-native-emoji';
import MapView, { Marker } from 'react-native-maps';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import style from './style';
import api from '../../services/api';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

const Poinst = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [points, setPoints] = useState<Point[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  useEffect(() => {
    api
      .get('items')
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        alert(
          'Nao foi possivel acessar os recursos da aplicacao. Verifique sua conexao com a internet e tente novamente mais tarde.',
        );

        navigation.goBack();
      });
  }, []);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Opsss...',
          'Precisamos de sua permissao para podermos ter sua localizacao.',
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;

      setInitialPosition([latitude, longitude]);
    }

    loadPosition();
  }, []);

  useEffect(() => {
    api
      .get('points', {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems,
        },
      })
      .then((response) => {
        setPoints(response.data);
      })
      .catch((error) => {
        Alert.alert(error);
      });
  }, [selectedItems]);

  function handleNavidateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('detail', { point_id: id });
  }

  function handleSelectItem(id: number) {
    const index = selectedItems.indexOf(id);
    const upddateSelectedItems = selectedItems;

    if (index >= 0) {
      upddateSelectedItems.splice(index, 1);

      return setSelectedItems([...upddateSelectedItems]);
    }

    setSelectedItems([...selectedItems, id]);
  }

  return (
    <>
      <View style={style.container}>
        <TouchableOpacity onPress={handleNavidateBack}>
          <Icon name="arrow-left" size={30} color="#34cb79" />
        </TouchableOpacity>

        <Text style={style.title}>
          <Emoji name="recycle" style={{ fontSize: 20 }} /> Bem vindo.
        </Text>

        <Text
          style={{
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          Selecione o item da reciclagem
        </Text>
        <View style={style.itemsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
          >
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  style.item,
                  selectedItems.includes(item.id) ? style.selectedItem : {},
                ]}
                onPress={() => handleSelectItem(item.id)}
                activeOpacity={0.6}
              >
                <SvgUri width={42} height={42} uri={item.image_url} />
                <Text style={style.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={style.description}>
          Encontre no mapa um ponto de coleta.
        </Text>

        <View style={style.mapContainer}>
          {initialPosition[0] !== 0 && (
            <MapView
              style={style.map}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.054,
                longitudeDelta: 0.054,
              }}
            >
              {points.map((point) => (
                <Marker
                  key={String(point.id)}
                  coordinate={{
                    latitude: Number(point.latitude),
                    longitude: Number(point.longitude),
                  }}
                  style={style.mapMarker}
                  onPress={() => handleNavigateToDetail(point.id)}
                >
                  <View style={style.mapMarkerContainer}>
                    <Image
                      source={{
                        uri: point.image_url,
                      }}
                      style={style.mapMarkerImage}
                    />
                    <Text style={style.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
    </>
  );
};

export default Poinst;
