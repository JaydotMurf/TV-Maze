$(document).ready(() => {
  const TVShowsApp = {
    $showsList: $('#showsList'),
    $episodesArea: $('#episodesArea'),
    $searchForm: $('#searchForm'),
    $episodesBtn: $(`.Show-getEpisodes`),
    $imgNotFound: `https://tinyurl.com/tv-missing`,
    selectedShowId: null,

    async getShows() {
      try {
        const searchTerm = $('#searchForm-term').val().toLowerCase();
        const searchResults = await axios.get(
          `https://api.tvmaze.com/search/shows`,
          {
            params: { q: searchTerm },
          }
        );
        return searchResults.data;
      } catch (error) {
        console.log(error);
      }
    },

    populateShows(shows) {
      this.$showsList.empty();

      for (let show of shows) {
        const imageSrc =
          show.show.image && show.show.image !== null
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
    },

    async displayShows() {
      const shows = await this.getShows();

      this.$episodesArea.hide();
      this.populateShows(shows);
    },

    getID() {
      this.showId = null;
      this.$showsList.on('click', '.Show-getEpisodes', (evt) => {
        evt.preventDefault();

        this.selectedShow = $(evt.target).closest('[data-show-id]');
        this.showID = parseInt(this.selectedShow[0].dataset.showId);

        console.log(this.showID);
        return this.showId;
      });
    },

    async getEpisodes() {},

    populateEpisodes() {},

    run() {
      this.$searchForm.on('submit', async (evt) => {
        evt.preventDefault();
        await this.displayShows();
      });
      this.getID();
    },
  };

  TVShowsApp.run();
});
