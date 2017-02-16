angular.module('module.dashboard', [])
    .controller('DashboardController', Dashboard);

var client = require('guidebox')

var Guidebox = new client('ae8273f03e1e2c7171d25f4fb27ad3b646063eaa');
var moviesUpdates = Guidebox.updates.list({object: 'movie', type: 'new', time:'1487177673'});

    dashboard.$inject=['$http']

function Dashboard($http) {
    console.info('Dashboard.initialized');

    var dashCtl = this

    function getNewShows(){
      console.log("getting new shows")
      $http.get('http://api-public.guidebox.com/v2/updates?object=show&type=new&time=1487177673&api_key=ae8273f03e1e2c7171d25f4fb27ad3b646063eaa')
      .then(function(res, err){
        console.log('new shows: ', res.data)
      })
    }

    // function getNewShows () {
    //   console.log('Making "get" request for new shows')
    //   $http.get('http://api-public.guidebox.com/v2/updates?object=show&type=new&time=1487104021?api_key=ae8273f03e1e2c7171d25f4fb27ad3b646063eaa')
    //   .then(function(res, err){
    //     console.log(res.data)
    //     // dashCtl.newShows =
    //   })
    // }
    function test () {
      console.log('Making "get" request for shows, TEST')
      $http.get('http://api-public.guidebox.com/v2/shows?api_key=ae8273f03e1e2c7171d25f4fb27ad3b646063eaa')
      .then(function(res, err){
        console.log(res.data)
        console.log(res.data.results[0].title)
        dashCtl.data = res.data
        dashCtl.shows = [];
        for(var i=0; i<dashCtl.data.total_returned; i++){
            dashCtl.shows.push(dashCtl.data.results[i].title)
        }
        console.log(dashCtl.shows)
      })
    }

    dashCtl.search = function(){
      var show = dashCtl.searchText
      console.log('you searched for ', show)
      $http.get('http://api-public.guidebox.com/v2/search?api_key=ae8273f03e1e2c7171d25f4fb27ad3b646063eaa&type=show&query='+ show)
      .then(function(res, err){
        console.log(res.data)
        dashCtl.showsResponse = res.data.results
      })
    }

    dashCtl.showInfo = function() {
      var id = document.getElementById('showID').textContent
      console.log(id)
      $http.get('http://api-public.guidebox.com/v2/shows/' + id + '?api_key=ae8273f03e1e2c7171d25f4fb27ad3b646063eaa')
      .then(function(res, err){
        console.log(res.data)
      })
    }

    function getTechNews3() {
          console.log('making http request')
          $http.get('https://newsapi.org/v1/articles?source=techradar&sortBy=top&apiKey=0251ee6c7b8948c19e35f7276a29e46b')
            .then(function(res, err){
              console.log(res.data)
              dashCtl.articlesTech3 = res.data.articles
            })
      }


    getNewShows();
    test();
    getTechNews3();
    // getNewMovies();
}
