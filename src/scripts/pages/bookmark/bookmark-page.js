import {
  generateLoaderAbsoluteTemplate,
  generateReportItemTemplate,
  generateReportsListEmptyTemplate,
  generateReportsListErrorTemplate,
} from '../../templates';
import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';
import Map from '../../utils/map';

 
export default class BookmarkPage {
    #presenter = null;
    #map = null;
  async render() {
    return `
      <section>
        <div class="reports-list__map__container">
          <div id="map" class="reports-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>
 
      <section class="container">
        <h1 class="section-title">Daftar Story Tersimpan</h1>
 
        <div class="reports-list__container">
          <div id="reports-list"></div>
          <div id="reports-list-loading-container"></div>
        </div>
      </section>
    `;
  }
 
  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });
    await this.#presenter.initialGalleryAndMap();
  }

 
  populateBookmarkedStories(message, reports) {
    if (reports.length <= 0) {
      this.populateBookmarkedStoriesListEmpty();
      return;
    }
 
    const html = reports.reduce((accumulator, report) => {
      if (this.#map) {
        const coordinate = [report.lat, report.lon];
        const markerOptions = { alt: report.name };
        const popupOptions = { content: report.name };

        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      }
      return accumulator.concat(
        generateReportItemTemplate({
          ...report,
          placeNameLocation: report.description,
        }),
      );
    }, '');
 
    document.getElementById('reports-list').innerHTML = `
      <div class="reports-list">${html}</div>
    `;
  }
 
  populateBookmarkeStorietsListEmpty() {
    document.getElementById('reports-list').innerHTML = generateReportsListEmptyTemplate();
  }
 
  populateBookmarkedStoriesError(message) {
    document.getElementById('reports-list').innerHTML = generateReportsListErrorTemplate(message);
  }
 
  showStoriesListLoading() {
    document.getElementById('reports-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }
 
  hideStoriesListLoading() {
    document.getElementById('reports-list-loading-container').innerHTML = '';
  }

    async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }
}