export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

async postNewReport(formData) {
  this.#view.showSubmitLoadingButton();
  try {
    const response = await this.#model.storeNewReport(formData);

    if (!response.ok) {
      console.error('postNewReport: response:', response);
      this.#view.storeFailed(response.message);
      return;
    }

    this.#view.storeSuccessfully(response.message, response.listStory);
  } catch (error) {
    console.error('postNewReport: error:', error);
    this.#view.storeFailed(error.message);
  } finally {
    this.#view.hideSubmitLoadingButton();
  }
}

}
