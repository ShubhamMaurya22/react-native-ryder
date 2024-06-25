import React, {useState, useEffect} from 'react';
import {useAuth} from '../Hooks/useAuth';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
// import LoadingScreen from '../components/Loading/LoadingScreen';
import Splash from '../screen/Splash';

export default function routes() {
  const {user, loading} = useAuth();
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSplashVisible(false);
    }, 2500);
  }, []);

  if (splashVisible) {
    return <Splash />;
  }

  // if (loading) {
  //     // You can show a loading indicator or splash screen while checking auth state.
  //     return <LoadingScreen />;
  //   }
  // return (user && user?.emailVerified) ?  <AppStack/> : <AuthStack/>
  return user ? <AppStack /> : <AuthStack />;

}
