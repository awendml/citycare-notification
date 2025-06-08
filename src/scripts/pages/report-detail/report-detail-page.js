import {
  generateCommentsListEmptyTemplate,
  generateCommentsListErrorTemplate,
  generateLoaderAbsoluteTemplate,
  generateRemoveReportButtonTemplate,
  generateReportCommentItemTemplate,
  generateReportDetailErrorTemplate,
  generateReportDetailTemplate,
  generateSaveReportButtonTemplate,
} from '../../templates';
import { createCarousel } from '../../utils';
import ReportDetailPresenter from './report-detail-presenter';
import { parseActivePathname } from '../../routes/url-parser';
import Map from '../../utils/map';
import * as CityCareAPI from '../../data/api';

export default class ReportDetailPage {
  #presenter = null;
  #form = null;
  #map = null;


  async render() {
    return `
      <section>
        <div class="report-detail__container">
          <div id="report-detail" class="report-detail"></div>
          <div id="report-detail-loading-container"></div>
        </div>
      </section>

    `;
  }

  async afterRender() {
    this.#presenter = new ReportDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: CityCareAPI,
    });

    // this.#setupForm();

    this.#presenter.showReportDetail();
    // this.#presenter.getCommentsList();
  }

  async populateReportDetailAndInitialMap(message, report) {
    document.getElementById('report-detail').innerHTML = generateReportDetailTemplate({
      
      name: report.name,
      description: report.description,
      photoUrl: report.photoUrl,
      lat: report.lat,
      lon: report.lon,
      createdAt: report.createdAt,
    });

    // Carousel images
    createCarousel(document.getElementById('images'));

    // Map
    await this.#presenter.showReportDetailMap();
      if (this.#map) {
        const reportCoordinate = [report.lat, report.lon];
        const markerOptions = { alt: report.name };
        const popupOptions = { content: report.name };
        this.#map.changeCamera(reportCoordinate);
        this.#map.addMarker(reportCoordinate, markerOptions, popupOptions);
      }

    // Actions buttons
    // this.#presenter.showSaveButton();
    this.addNotifyMeEventListener();
  }

  populateReportDetailError(message) {
    document.getElementById('report-detail').innerHTML = generateReportDetailErrorTemplate(message);
  }



  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  // #setupForm() {
  //   this.#form = document.getElementById('comments-list-form');
  //   this.#form.addEventListener('submit', async (event) => {
  //     event.preventDefault();

  //     const data = {
  //       body: this.#form.elements.namedItem('body').value,
  //     };
  //     await this.#presenter.postNewComment(data);
  //   });
  // }

  // postNewCommentSuccessfully(message) {
  //   console.log(message);

  //   this.#presenter.getCommentsList();
  //   this.clearForm();
  // }

  // postNewCommentFailed(message) {
  //   alert(message);
  // }

  // clearForm() {
  //   this.#form.reset();
  // }

  // renderSaveButton() {
  //   document.getElementById('save-actions-container').innerHTML =
  //     generateSaveReportButtonTemplate();

  //   document.getElementById('report-detail-save').addEventListener('click', async () => {
  //     alert('Fitur simpan laporan akan segera hadir!');
  //   });
  // }

  renderRemoveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateRemoveReportButtonTemplate();

    document.getElementById('report-detail-remove').addEventListener('click', async () => {
      alert('Fitur simpan laporan akan segera hadir!');
    });
  }

  addNotifyMeEventListener() {
    document.getElementById('report-detail-notify-me').addEventListener('click', () => {
      alert('Fitur notifikasi laporan akan segera hadir!');
    });
  }

  showReportDetailLoading() {
    document.getElementById('report-detail-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideReportDetailLoading() {
    document.getElementById('report-detail-loading-container').innerHTML = '';
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showCommentsLoading() {
    document.getElementById('comments-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideCommentsLoading() {
    document.getElementById('comments-list-loading-container').innerHTML = '';
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Tanggapi
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Tanggapi</button>
    `;
  }
}
