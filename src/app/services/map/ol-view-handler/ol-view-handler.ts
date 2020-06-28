import View from 'ol/View';
import { fromLonLat, toLonLat } from 'ol/proj';
import { MapPointModule } from 'src/app/map/modules/mappoint/mappoint.module';

const DEFAULT_CENTER_LONLAT = [139.339285, 35.670167];
const DEFAULT_ZOOM = 14;
const MAX_ZOOM = 14;
const MIN_ZOOM = 14;

export class OlViewHandler {
  private view: View;

  constructor() {
    this.view = new View({
      center: fromLonLat(DEFAULT_CENTER_LONLAT),
      zoom: DEFAULT_ZOOM,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
    });
  }

  getView(): View {
    return this.view;
  }

  setCenterOfPoints(points: MapPointModule[]): void {}
}
