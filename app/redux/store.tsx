// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';


import townshipVideoData from '@/app/redux/slice/whatsNewVideos';
import propertyData from '@/app/redux/slice/propertyData';
import officeData from '@/app/redux/slice/officeData';
import closedDealsData from '@/app/redux/slice/closedDealsData';
import eventsData from '@/app/redux/slice/eventsData';
import meetingsData from '@/app/redux/slice/meetingData';
import ongoingInfrastructureData from '@/app/redux/slice/ongoingInfrastructureData';
import realEstateNewsData from '@/app/redux/slice/realestateNewsData';
import realEstateTipsData from '@/app/redux/slice/realestateTipsData';
import seminarsData from '@/app/redux/slice/seminarsData';

const store = configureStore({
  reducer: {
    officeData:officeData,
    townshipVideo: townshipVideoData,
    propertyData: propertyData, 
    closedDealsData:closedDealsData,
    eventsData:eventsData,
    meetingsData:meetingsData,
    ongoingInfrastructureData:ongoingInfrastructureData,
    realEstateNewsData:realEstateNewsData,
    realEstateTipsData:realEstateTipsData,
    seminarsData:seminarsData,
  },
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
