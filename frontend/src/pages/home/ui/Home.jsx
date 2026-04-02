import { ScrollingImage } from 'shared/ui/ScrollingImage'
import { GeneralInfo } from './components/GeneralInfo/GeneralInfo';
import { MapInfo } from './components/MapInfo/MapInfo';
import gallery from '../Gallery.jpg'


export function Home() {
  return (
    <>
    <ScrollingImage imageSrc={gallery} speed={140} />

    <GeneralInfo />

    <MapInfo />
    </>
  );
}