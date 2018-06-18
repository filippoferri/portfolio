'use strict';
!function () {
  console.log('%cDesigned and coded with ❤︎ by Filippo Ferri — Full Stack Designer — filippoferri.co', 'background:#000;color:#2CFED4;padding:0.5em 1em;line-height:2;');
}();


var behancekey = 'zG5hD137ewPzex14VIGpP5ClZDsUvJSH';

var behanceAPI = function () {
  var key;
  var baseURL = 'https://www.behance.net/v2/';
  var userProjects = new Array();
  var offsetPage = 1; // optionally you can set up which page to start
  var numPages = 2; // Set up the max of pages to retrieve from behance (Each page gets 10 items max).

  function setKey(k) {
    key = k;
  }

  function getProjects(user, cb) {
    var url = '';
    jQuery.each([offsetPage, numPages], function (i, numb) {

      url = baseURL + 'users/' + user + '/projects?api_key=' + key + '&callback=&page=' + numb;

      jQuery.get(url, {}, function (res, code) {
        jQuery.each(res.projects, function (i, obj) {
          userProjects.push(obj);
        });
      }, 'JSONP').done(function () {
        cb(userProjects);
      });

    });
  }

  function getProjectDetails(project, cb) {
    var url = baseURL + 'projects/' + project + '?api_key=' + key + '&callback=';
    jQuery.get(url, {}, function (res, code) {
      cb(res.project);
    }, 'JSONP');
  }

  return {
    setKey: setKey,
    getProjects: getProjects,
    getProjectDetails: getProjectDetails
  };

}();

function loadProject(projectID) {
  behanceAPI.getProjectDetails(projectID, function (loadModules) {

    var moduleHTML = '';

    //var moduleTitle = '';
    //moduleTitle += '<h1>' + loadModules.name + '</h1>';
    //$('#myModalLabel').html(moduleTitle);

    //var moduleDescription = '';
    //moduleDescription += '<p>' + loadModules.description + '</p>';
    //$('.modal-description').html(moduleDescription);

    for (var i = 0; i < loadModules.modules.length; i++) {
      if (loadModules.modules[i].sizes.original != undefined) {
        moduleHTML += '<img src="' + loadModules.modules[i].sizes.original + '">';
        moduleHTML += '';
      }
    }
    jQuery('#ff-project-details').html(moduleHTML);

    UIkit.modal('#project-modal', {modal: false, keyboard: false, bgclose: false, center: true}).show();
  });
}

$(document).ready(function () {

  // Behance

// Set behance api key
  behanceAPI.setKey(behancekey);

  // Get projects
  behanceAPI.getProjects('filippoferri', function (projectlist) {
    var projectHTML = '';
    for (var i = 0; i < projectlist.length; i++) {
      var project = projectlist[i];
      projectHTML += '<div><div class="ff-item"><div onclick="loadProject(' + project.id + ')"><img src="' + project.covers[404] + '"><span>'+ project.name +'</span></div></div></div>';
    }

    $('.ff-featured-projects').slick('slickAdd', projectHTML );
  });


// Carousel
  $('.ff-featured-projects').slick({

    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 639,
        settings: 'unslick'
      }
    ]

  });

});








