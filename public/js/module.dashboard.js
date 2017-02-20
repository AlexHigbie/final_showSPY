angular.module('module.dashboard', [])
    .controller('DashboardController', Dashboard);

var api_key = process.env.GUIDEBOX_APIKEY


    Dashboard.$inject=['$http']

function Dashboard($http) {
    console.info('Dashboard.initialized');

    var dashCtl = this

    // function getNewShows(){
    //   console.log("getting new shows")
    //   $http.get('http://api-public.guidebox.com/v2/updates?object=show&type=new&time=1487177673&api_key='+ api_key)
    //   .then(function(res, err){
    //     console.log('new shows: ', res.data)
    //   })
    // }


    // function test () {
    //   console.log('Making "get" request for shows, TEST')
    //   $http.get('http://api-public.guidebox.com/v2/shows?api_key='+ api_key)
    //   .then(function(res, err){
    //     console.log(res.data)
    //     console.log(res.data.results[0].title)
    //     dashCtl.data = res.data
    //     dashCtl.shows = [];
    //     for(var i=0; i<dashCtl.data.total_returned; i++){
    //         dashCtl.shows.push(dashCtl.data.results[i].title)
    //     }
    //     console.log(dashCtl.shows)
    //   })
    // }

    dashCtl.search = function(){
      var show = dashCtl.searchText
      console.log('you searched for ', show)
      $http.get('http://api-public.guidebox.com/v2/search?api_key='+api_key+ '&type=show&query='+ show)
      .then(function(res, err){
        console.log(res.data)
        dashCtl.showsResponse = res.data.results
      })
    }

    dashCtl.showInfo = function(result) {
      console.log(result)
      // console.log(id)
      $http.get('http://api-public.guidebox.com/v2/shows/' + result.id + '/available_content?api_key='+ api_key)
      .then(function(res, err){
        console.log(res.data)
        dashCtl.showInfoSources = res.data.results.web.episodes.all_sources
      })
      $http.get('http://api-public.guidebox.com/v2/shows/'+ result.id +'?api_key='+ api_key)
      .then(function(res, err){
        console.log(res.data)
        dashCtl.moreInfo = res.data
      })
    }

    dashCtl.searchMovies = function(){
      var movie = dashCtl.searchMovieText
      console.log('you searched for ', movie)
      $http.get('http://api-public.guidebox.com/v2/search?api_key='+ api_key + '&type=movie&query='+ movie)
      .then(function(res, err){
        console.log(res.data)
        dashCtl.moviesResponse = res.data.results
      })
    }

    dashCtl.moviesInfo = function(result) {
      console.log(result)
      console.log(result.id)
      // $http.get('http://api-public.guidebox.com/v2/movies/' + result.id + '/available_content?api_key=ae8273f03e1e2c7171d25f4fb27ad3b646063eaa')
      // .then(function(res, err){
      //   console.log(res.data)
        // dashCtl.movieInfoSources = res.data.results.web.episodes.all_sources
      // })
      $http.get('http://api-public.guidebox.com/v2/movies/'+ result.id +'?api_key='+ api_key)
      .then(function(res, err){
        console.log(res.data)
        dashCtl.movieInfo = res.data
      })
    }






    getNewShows();
    test();

    // getNewMovies();
}
