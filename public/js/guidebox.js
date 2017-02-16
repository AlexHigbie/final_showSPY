angular.module('guideboxApp', [])
    .controller('guideboxController', Guidebox)

var client = require('guidebox')

var Guidebox = new client('ae8273f03e1e2c7171d25f4fb27ad3b646063eaa');

function Guidebox() {

  var gCtl = this;


  function getNewMovies(){
    var newMovies = Guidebox.updates.list({object: 'movie', type: 'new', time:'1487177673'});
    return newMovies
  }







    // Guidebox info
    var newShows = Guidebox.updates.list({ object: 'show', type: 'new', time:'1487177673'});
    var newMovies = Guidebox.updates.list({object: 'movie', type: 'new', time:'1487177673'});



}
