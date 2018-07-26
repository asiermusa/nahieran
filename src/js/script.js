import { init, pwa, isOnline } from './components/init';

document.getElementById('app').innerHTML = init()

//Aplikzio web progresiboa erregistratu
pwa()
//Online/ffline gauden zehaztu
isOnline()
