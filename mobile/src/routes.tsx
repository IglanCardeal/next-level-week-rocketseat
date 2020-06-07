import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home/Home';
import Points from './pages/Points/Points';
import Detail from './pages/Detail/Detail';

const AppStack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: '#f0f0f4', // defini um fundo padrao para todas as telas,
            // a menos que o style de uma tela sobreescreva.
          },
        }}
      >
        <AppStack.Screen name="home" component={Home} />
        <AppStack.Screen name="points" component={Points} />
        <AppStack.Screen name="detail" component={Detail} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
