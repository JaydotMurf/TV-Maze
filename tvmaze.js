$(document).ready(() => {
  class TVShowsApp {
    constructor() {
      this.$showsList = $('#showsList');
      this.$episodesArea = $('#episodesArea');
      this.$searchForm = $('#searchForm');
      this.$imgNotFound = `imgs/default-Img.png`;
    }

    async getShows() {
      try {
        const searchTerm = $('#searchForm-term').val().toLowerCase();
        const searchResults = await axios.get(
          `https://api.tvmaze.com/search/shows`,
          {
            params: { q: searchTerm },
          }
        );
        console.log(searchResults.data);
        return searchResults.data;
      } catch (error) {
        console.log(error);
      }
    }

    populateShows(shows) {
      this.$showsList.empty();

      for (let show of shows) {
        const imageSrc =
          show.show.image && show.show.image !== 'null'
            ? show.show.image.medium
            : this.$imgNotFound;

        const $show = $(`
          <div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
            <div class="card">
              <img
                src="${imageSrc}"
                alt="${show.show.name}"
                class="card-img-top w-25 me-3"
              >
              <div class="card-body">
                <h5 class="text-primary">${show.show.name}</h5>
                <p class="card-text"><small>${show.show.summary}</small></p>
                <button class="btn btn-outline-light btn-sm Show-getEpisodes">
                  Episodes
                </button>
              </div>
            </div>
          </div>
        `);

        this.$showsList.append($show);
      }
    }

    async displayShows() {
      const shows = await this.getShows();

      this.$episodesArea.hide();
      this.populateShows(shows);
    }

    run() {
      this.$searchForm.on('submit', async (evt) => {
        evt.preventDefault();
        await this.displayShows();
      });
    }
  }

  const app = new TVShowsApp();
  app.run();
});
