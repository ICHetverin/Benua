import { ScrollingImage } from "shared/ui/ScrollingImage";
import { GeneralInfo } from "./components/GeneralInfo/GeneralInfo";
import { MapInfo } from "./components/MapInfo/MapInfo";
import { PersonsObjectsSection } from "./components/PersonsObjectsSection/PersonsObjectsSection";
import { ExcursionsSection } from "./components/ExcursionsSection/ExcursionsSection";
import { InfographicsSection } from "./components/InfographicsSection/InfographicsSection";
import { CemeteriesSection } from "./components/CemeteriesSection/CemeteriesSection";
import gallery from "../Gallery.jpg";

export function Home() {
  return (
    <>
      <ScrollingImage imageSrc={gallery} speed={140} />

      <GeneralInfo />

      <MapInfo />

      <PersonsObjectsSection />

      <ExcursionsSection />

      <InfographicsSection />

      <CemeteriesSection />
    </>
  );
}
