/************************************************/
/* Ember App Definition
/************************************************/

var App = Ember.Application.create();

/************************************************/
/* Ember Routing & Layout
/************************************************/

// Small LayoutState extension to toggle the navigation css
App.NavState = Em.LayoutState.extend({
  navSelector: '.navbar .nav',
  enter: function(stateManager, transition) {
    this._super(stateManager, transition);
    var $nav = $(this.get('navSelector'));
    $nav.children().removeClass('active');
    var selector = this.get('selector') || ("." + this.get('path'));
    $nav.find(selector).addClass('active');
  }
});

App.SubNavState = App.NavState.extend({
  navSelector: '.subnav .nav'
})

// The top level layout
App.main = Em.View.create({
  templateName: 'main'
});

// Here we define the top level routes and
// their corresponding views (inline)
App.routeManager = Em.RouteManager.create({
  rootView: App.main,
  dashboardView: App.NavState.create({
    selector: '.dashboard',
    route: 'dashboard',
    viewClass: Em.View.extend({
      templateName: 'dashboard'
    })
  }),
  homeView: App.NavState.create({
    selector: '.home',
    route: 'home',
    viewClass: Em.View.extend({
      templateName: 'home'
    })
  }),
  howView: App.NavState.create({
    selector: '.how',
    route: 'how',
    viewClass: Em.View.extend({
      templateName: 'how'
    })
  }),
  settingsView: App.NavState.create({
    selector: '.settings',
    route: 'settings',
    viewClass: Em.View.extend({
      templateName: 'settings',
      didInsertElement: function() {
        locateUser(document.getElementById("location"));
      }
    })
  }),
  ideaView: App.NavState.create({
    selector: '.ideaDetail',
    route: 'ideaDetail',
    viewClass: Em.View.extend({
      templateName: 'ideaDetail',
    }),
    // consume the path parameter when the state is entered
	enter: function(stateManager, transition) {
	  this._super(stateManager, transition);
	  var itemId = stateManager.getPath('params.id');
	  App.set('actualIdea',App.store.find(App.IdeaObj,itemId));
	  console.log("0-store:" + App.actualIdea.get('title') + " " + itemId);
	  this.get('view').set('content', App.actualIdea);
	},
    section1: App.SubNavState.create({
      route: 'idea-section1/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section1'
      })
    }),
    section2: App.SubNavState.create({
      route: 'idea-section2/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section2'
      })
    }),
    section3: App.SubNavState.create({
      route: 'idea-section3/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section3'
      })
    }),
    section4: App.SubNavState.create({
      route: 'idea-section4/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section4'
      })
    }),
    section5: App.SubNavState.create({
      route: 'idea-section5/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section5',
        didInsertElement: function() {
        	drawPie(document.getElementById("pieCanvas"));
        	//drawPieRaphael();
        }
      })
    })
  }),
  ideasListView: App.NavState.create({
    selector: '.ideasList',
    route: 'ideasList',
    viewClass: Em.View.extend({
      templateName: 'ideasList',
    }),
    ideas: Em.LayoutState.create({
      viewClass: Em.View.extend({
        templateName: 'ideas',
        contentBinding: 'App.allIdeas'
      })
    })
  })
});

$(function() {
  App.main.appendTo('body');
  App.routeManager.start();
});

/************************************************/
/* Objects Definition
/************************************************/

App.Pages = Ember.Object.create({
	page: [
		{	//index 0
			id: 'ideas',
			title: 'Actual Ideas'
		},
		{	//index 1
			id: 'dashboard',
			title: 'Dashboard'
		},
		{	//index 2
			id: 'home',
			title: 'Open Ministry'
		},
		{	//index 3
			id: 'settings',
			title: 'Settings'
		},
		{	//index 4
			id: 'how',
			title: 'How does it work?'
		}
	]
})

App.IdeaObj = DS.Model.extend({
    author_id: DS.attr('string'),
    body: DS.attr('string'),
    created_at: DS.attr('date'),
    id: DS.attr('string'),
    publish_state: DS.attr('string'),
    slug: DS.attr('string'),
    state: DS.attr('string'),
    summary: DS.attr('string'),
    title: DS.attr('string'),
	updated_at: DS.attr('date'),
	expertOpinions: 'TODO API',
	user_voted: DS.attr('string'),
    user_vote: DS.attr('string'),
    comments: 'TODO include API',
    votes_yes: 50,
    votes_no: 20,
    votes_total: 70,
	section1_url: function() {
		return "#ideaDetail/idea-section1/" + this.get('id');
	}.property('url'),	
	section2_url: function() {
		return "#ideaDetail/idea-section2/" + this.get('id');
	}.property('url'),	
	section3_url: function() {
		return "#ideaDetail/idea-section3/" + this.get('id');
	}.property('url'),	
	section4_url: function() {
		return "#ideaDetail/idea-section4/" + this.get('id');
	}.property('url'),	
	section5_url: function() {
		return "#ideaDetail/idea-section5/" + this.get('id');
	}.property('url'),	
	shortUpdatedAt: function() {
		var string = this.get('updated_at');
		//string = string.substring(0,10);
		return string;
	}.property('updated_at'),
	didLoad: function(){
    	//alert("I loaded " + this.get('id'));
    }
});

App.IdeaObj.reopenClass({
    url: 'http://192.168.1.112:3000/ideas'
});

/************************************************/
/* Ember Data Store Definition
/************************************************/

App.adapter = DS.RESTAdapter.create({
  findAll: function(store, type) {
      var url = type.url+".json";
      jQuery.getJSON(url, function(data) {
          var ids = data.map(function(item, index, self){ return item.id });
          store.loadMany(type, ids, data);
      });
  },
  ajax: function(url, type, hash) {
    var success = hash.success, self = this;

    console.log(url);
    console.log(type);

    if (success) {
      hash.success = function(json) {
        success.call(self, json);
      };
    }
  },
  find: function(store, type, id) {
        var url = type.url;
        //url = url.fmt(id);
        url = url+"/"+id;

		console.log("find: " +url);
		console.log("id: " + id);

        jQuery.getJSON(url, function(data) {
            // data is a Hash of key/value pairs. If your server returns a
            // root, simply do something like:
            // store.load(type, id, data.person)
            store.load(type, id, data);
        });
    }
});

App.store = DS.Store.create({
	revision: 3,
	adapter: App.adapter
});

/************************************************/
/* Ember Data Store - Data loading
/************************************************/

App.allIdeas = App.store.findAll(App.IdeaObj);
console.log(App.allIdeas);

/************************************************/
/* Java Script Functions
/************************************************/

function drawPie(canvas) {
	///// STEP 1 - Get the, get the, get the data!
    var data = [], color, colors = [], value = 0, total = 0;
    var datasize = 2;

    data[0]=App.actualIdea.get('votes_no');//20; //no
    console.log("nr1: " + data[0]);
    data[1]=App.actualIdea.get('votes_yes');//22; //yes
    console.log("nr2: " + data[0]);
    total=App.actualIdea.get('votes_total');
    
    colors[0]="#E35651";
    colors[1]="#5BB55B";

    ///// STEP 2 - Draw pie on canvas

    // exit if canvas is not supported
    if (typeof canvas.getContext === 'undefined') {
        return;
    }

    // get canvas context, determine radius and center
    var ctx = canvas.getContext('2d');
    var canvas_size = [canvas.width, canvas.height];
    var radius = Math.min(canvas_size[0], canvas_size[1]) / 2;
    var center = [canvas_size[0]/2, canvas_size[1]/2];

    var sofar = 0; // keep track of progress
    // loop the data[]
    for (var i=0;i<datasize;i++) {
        var thisvalue = data[i] / total;
        ctx.beginPath();
        ctx.moveTo(center[0], center[1]); // center of the pie
        ctx.arc(  // draw next arc
            center[0],
            center[1],
            radius,
            Math.PI * (- 0.5 + 2 * sofar), // -0.5 sets set the start to be top
            Math.PI * (- 0.5 + 2 * (sofar + thisvalue)),
            false
        );

        ctx.lineTo(center[0], center[1]); // line back to the center
        ctx.closePath();
        ctx.fillStyle = colors[i];    // color
        ctx.fill();

        sofar += thisvalue; // increment progress tracker
    }

    ///// DONE!
}

function drawPieRaphael() {
	var r = Raphael("votepie",200,200);
	var pie = r.piechart(135, 92, 57, [
	  // piechart requires non-zero sizes to draw properly, so let's guard these values
	  20,
	  22
	],
	{
	  legend: [
	      "20 Kyllä ääntä %%.%",
	      "22 Ei ääntä %%.%"
	    ],
	  legendpos: "south", 
	  colors: ["#a9003f", "#8cc63f"],
	  // Clicking portions could link somewhere
	  // href: ["http://somewhere.com", "http://somewhere.com"]
	});
	r.text(130, 17, "42 äänen jakautuminen").attr({ font: "17px sans-serif" });
	r.attr("postion","inherit");
	pie.hover(function () {
	  this.sector.stop();
	  this.sector.scale(1.1, 1.1, this.cx, this.cy);

	  if (this.label) {
	      this.label[0].stop();
	      this.label[0].attr({ r: 7.5 });
	      this.label[1].attr({ "font-weight": 800 });
	  }
	}, function () {
	  this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, "bounce");

	  if (this.label) {
	      this.label[0].animate({ r: 5 }, 500, "bounce");
	      this.label[1].attr({ "font-weight": 400 });
	  }
	});
}

function locateUser(node) {
	//Update the position at least every 5 seconds and use GPS if available
	navigator.geolocation.watchPosition(function(geodata) {
		console.log("LAT: " + geodata.coords.latitude + "<br />LONG: " + geodata.coords.longitude);
		node.innerHTML = "Debug Info:<br /><br />LAT: " + geodata.coords.latitude + "<br />LONG: " + geodata.coords.longitude+'<a class="close" data-dismiss="alert">×</a>';
	},function() {},{enableHighAccuracy:true, maximumAge:30000, timeout:5000} );
}

Handlebars.registerHelper('fct_shortUrl', function() {
	console.log("date:" + this.get('updated_at'));
	var date = this.get('updated_at');
	console.log(date.toString);
	console.log(date.subsring(0,10));
	return new Handlebars.SafeString(this.get('updated_at').substring(0,10));
});