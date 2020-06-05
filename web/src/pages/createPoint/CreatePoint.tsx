import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';

import api from '../../services/api';

import logo from '../../assets/logo.svg';
import './style.css';

const CreatePoint = () => {
  interface Item {
    id: number;
    title: string;
    image_url: string;
  }

  interface IBGEUFResponse {
    sigla: string;
  }

  interface IBGECityResponse {
    nome: string;
  }

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  const history = useHistory();

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUf(uf);
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  function handlMapClick(event: LeafletMouseEvent) {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;

    setSelectedPosition([lat, lng]);
  }

  function handleInputChanges(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items,
    };

    try {
      const response = await api.post('create-point', data);

      console.log(response);

      if (response.status === 200) {
        alert('Ponto de coleta cadastrado com sucesso!');

        history.push('/');
      }
    } catch (error) {
      console.log(error);

      alert(
        'Nao foi possivel cadastrar um novo ponto de coleta devido a um erro inesperado!',
      );
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setInitialPosition([latitude, longitude]);
      },
      (error: any) => {
        const errorMessage: any = {
          '1':
            'A sua localizacao nao foi encontrada, pois voce nao autorizou esta aplicacao a acessa-la!',
          '2': 'A sua localizacao nao esta disponivel!',
          '3': 'Tempo expirado. Nao foi possivel obter sua localizacao',
        };

        alert(errorMessage[error.code]);
      },
    );
  }, []);

  useEffect(() => {
    api.get('items').then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);

        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') return;

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`,
      )
      .then((response) => {
        const citiesName = response.data.map((city) => city.nome);

        setCities(citiesName);
      });
  }, [selectedUf]);

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para a home
        </Link>
      </header>

      <form onSubmit={handleSubmit} method="POST">
        <h1>Cadastro do ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChanges}
              required
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChanges}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChanges}
                required
                minLength={10}
                maxLength={11}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereco</h2>
            <span>Selecione o endereco no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handlMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectedUf}
                required
              >
                <option value="">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectedCity}
                required
              >
                <option value="0">Selecione uma Cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Items de coleta</h2>
            <span>Selecione um ou mais items de coleta</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
