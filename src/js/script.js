import { init, pwa, isOnline, ga } from './components/init';

document.getElementById('app').innerHTML = init()

//Aplikzioa web progresiboa erregistratu
pwa()
//Online/ffline gauden zehaztu
isOnline()
//Analytics
ga()
