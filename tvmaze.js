$(document).ready(() => {
  const TVShowsApp = {
    $showsList: $('#showsList'),
    $episodesArea: $('#episodesArea'),
    $episodesList: $('#episodesList'),
    $searchForm: $('#searchForm'),
    $episodesBtn: $(`.Show-getEpisodes`),
    $imgNotFound: `https://tinyurl.com/tv-missing`,

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
          <div data-show-id="${show.show.id}" data-toggle="modal" data-target="#myModal" class="Show col-md-12 col-lg-6 mb-4">
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

    getShowID(evt) {
      const selectedShow = $(evt.target).closest('[data-show-id]');
      this.selectedShowId = parseInt(selectedShow[0].dataset.showId);
      return this.selectedShowId;
    },

    async getEpisodes(evt) {
      this.ID = this.getShowID(evt);
      if (this.ID !== null) {
        try {
          const response = await axios.get(
            `https://api.tvmaze.com/shows/${this.ID}/episodes`
          );
          const episodes = response.data.map((episode) => ({
            episodeID: episode.id,
            episodeName: episode.name,
            season: episode.season,
            episodeNumber: episode.number,
          }));
          return episodes;
        } catch (error) {
          console.log(error);
        }
      }
    },

    async populateEpisodes(evt) {
      this.arrayOfEpisodes = await this.getEpisodes(evt);

      this.$episodesList.empty();
      this.arrayOfEpisodes.forEach((episode) => {
        console.log(episode);
        this.$episodesList.append(
          $(
            `<li><p><strong>Name:</strong> ${episode.episodeName} <br> <strong>Season:</strong> ${episode.season} <br> <strong>Episode Number:</strong> ${episode.episodeNumber}</p></li>`
          )
        );
      });

      this.$episodesArea.show();
    },

    run() {
      this.$searchForm.on('submit', async (evt) => {
        evt.preventDefault();
        await this.displayShows();
      });

      this.$showsList.on('click', '.Show-getEpisodes', async (evt) => {
        evt.preventDefault();
        await this.populateEpisodes(evt);
      });
    },
  };

  TVShowsApp.run();
});
