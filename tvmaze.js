$(document).ready(() => {
  class TVShowsApp {
    constructor() {
      this.$showsList = $('#showsList');
      this.$episodesArea = $('#episodesArea');
      this.$searchForm = $('#searchForm');
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
        const $show = $(
          `<div data-show-id="${
            show.show.id
          }" class="Show col-md-12 col-lg-6 mb-4">
             <div class="media">
               <img
                  src=${show.show.image.medium ? show.show.image.medium : null} 
                  alt=${show.show.name}
                  class="w-25 me-3">
               <div class="media-body">
                 <h5 class="text-primary">${show.show.name}</h5>
                 <div><small>${show.show.summary}</small></div>
                 <button class="btn btn-outline-light btn-sm Show-getEpisodes">
                   Episodes
                 </button>
               </div>
             </div>
           </div>`
        );

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
        // console.log(await this.getShows());
        await this.displayShows();
      });
    }
  }

  const app = new TVShowsApp();
  app.run();
});
