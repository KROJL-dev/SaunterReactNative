import { MapViewDirectionsWaypoints } from 'react-native-maps-directions';

export interface IDirectionData {
  coordinate: MapViewDirectionsWaypoints[];
  directionSize:number;
}
export interface IPath {
  id: string;
  title: string;
  description: string;
  isFavourite: boolean;
  directionData: IDirectionData;
}
 
