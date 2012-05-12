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
	  //get ID and load idea
	  var itemId = stateManager.getPath('params.id');
	  console.log("app.js>>enter/ideaView: load idea with id: " + itemId);
	  App.set('actualIdea',App.store.find(App.IdeaObj,itemId));
	  this.get('view').set('content', App.actualIdea);
	  //change the url of the commet and load comment
	  /*App.CommentObj.reopenClass({
		url: 'ideas/'+itemId+'/comment'
	  });
	  App.set('actualComments',App.store.find(App.CommentObj,59));
	  console.log(App.actualComments);
	  //App.actualIdea.get('comments').addObjects(App.store.findAll(App.CommentObj).content);
	  */
	},
    section1: App.SubNavState.create({
      route: 'idea-section1/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section1',
        didInsertElement: function() {
        	addSwipeGesture(null,"section2_url");
        }
      })
    }),
    section2: App.SubNavState.create({
      route: 'idea-section2/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section2',
        didInsertElement: function() {
        	addSwipeGesture("section1_url","section3_url");
        }
      })
    }),
    section3: App.SubNavState.create({
      route: 'idea-section3/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section3',
        didInsertElement: function() {
        	addSwipeGesture("section2_url","section4_url");
        }
      })
    }),
    section4: App.SubNavState.create({
      route: 'idea-section4/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section4',
        didInsertElement: function() {
        	addSwipeGesture("section3_url","section5_url");
        }
      })
    }),
    section4comment: App.SubNavState.create({
      route: 'idea-section4-comment/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section4-comment',
        didInsertElement: function() {
        	addSwipeGesture("section3_url","section5_url");
        }
      })
    }),
    section5: App.SubNavState.create({
      route: 'idea-section5/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section5',
        didInsertElement: function() {
        	addSwipeGesture("section4_url",null);
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
    author_id: DS.attr('number'),
    body: DS.attr('string'),
    created_at: DS.attr('date'),
    id: DS.attr('number'),
    publish_state: DS.attr('string'),
    slug: DS.attr('string'),
    state: DS.attr('string'),
    summary: DS.attr('string'),
    title: DS.attr('string'),
	updated_at: DS.attr('date'),
	expertOpinions: 'TODO API',					//not in the real model -> has to be replaced
	user_voted: DS.attr('string'),
    user_vote: DS.attr('string'),
    //comments: DS.hasMany('App.CommentObj'),
    votes_yes: 50,								//not in the real model -> has to be replaced
    votes_no: 20,								//not in the real model -> has to be replaced
    votes_total: 70,							//not in the real model -> has to be replaced
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
	section4_comment_url: function() {
		return "#ideaDetail/idea-section4-comment/" + this.get('id');
	}.property('url'),	
	section5_url: function() {
		return "#ideaDetail/idea-section5/" + this.get('id');
	}.property('url'),	
	didLoad: function(){
    	console.log("app.js>>didLoad/IdeaObj: IdeaObj with Id " + this.get('id') + " loaded.");
    }
});

App.CommentObj = DS.Model.extend({
	primaryKey: 'id',
    id: DS.attr('number'),
    author_id: DS.attr('number'),
    body: DS.attr('string'),
    published: DS.attr('string'),
    commentable_id: DS.attr('string'),
    commentable_type: DS.attr('string'),
    created_at: DS.attr('string'),
    updated_at: DS.attr('string'),
    publish_state: DS.attr('string'),
    didLoad: function(){
    	console.log("app.js>>didLoad/CommentObj: CommentObj with Id " + this.get('id') + " loaded.");
    }
});

App.IdeaObj.reopenClass({
    url: 'idea'	
    //url: 'http://192.168.1.112:3000/ideas' /* if it is on a different computer running */
});

App.CommentObj.reopenClass({
    url: 'ideas/1/comment'
    //url: 'http://192.168.1.112:3000/ideas' /* if it is on a different computer running */
});

/************************************************/
/* Ember Object for Comment testing 
/************************************************/

App.Comment = Em.Object.extend({
  idea_id: null,
  username: null,
  comment: null
});

App.commentController = Em.ArrayProxy.create({
  content: [],

  createComment: function(comment,id,username) {
    var comment = App.Comment.create({idea_id: id, username: username, comment: comment});
    this.pushObject(comment);
  }
});


App.CreateCommentView = Em.TextArea.extend({
  insertNewline: function() {
    var value = this.get('value');
    if (value) {
      App.commentController.createComment(value,App.actualIdea.get('id'),'testuser');
      this.set('value', '');
      window.location = App.actualIdea.get('section4_url');
    }
  }
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
	revision: 4,
	adapter: DS.RESTAdapter.create({ bulkCommit: false })
	//adapter: App.adapter  /* my own adapter -> was necessary till the API was running locally on my laptop */
});

/************************************************/
/* Ember Data Store - Data loading
/************************************************/

App.allIdeas = App.store.findAll(App.IdeaObj);
//App.allComments = App.store.findAll(App.CommentObj);

/************************************************/
/* Java Script Functions
/************************************************/

function drawPie(canvas) {
	///// STEP 1 - Get the, get the, get the data!
    var data = [], color, colors = [], value = 0, total = 0;
    var datasize = 2;

    App.actualIdea.set('votes_no',Math.floor((Math.random()*100)+1));	/* only for testing variables -> should be removed when real numbers are in the object */
    App.actualIdea.set('votes_yes',Math.floor((Math.random()*100)+1));	/* only for testing variables -> should be removed when real numbers are in the object */
    
    data[0]=App.actualIdea.get('votes_no'); //no
    data[1]=App.actualIdea.get('votes_yes'); //yes

    App.actualIdea.set('votes_total',(data[0]+data[1]));	/* only for testing variables -> should be removed when real numbers are in the object */
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
		console.log("app.js>>locateUser: LAT: " + geodata.coords.latitude + "<br />LONG: " + geodata.coords.longitude);
		node.innerHTML = "Debug Info:<br /><br />LAT: " + geodata.coords.latitude + "<br />LONG: " + geodata.coords.longitude+'<a class="close" data-dismiss="alert">×</a>';
	},function() {},{enableHighAccuracy:true, maximumAge:30000, timeout:5000} );
}

function addSwipeGesture(left,right) {
	$("#slideContainer").touchwipe({
     wipeLeft: function() { 
     	if(right!=null) {
     		console.log("app.js>>addSwipeGesture: swipe to right page: " + right);
     		window.location = App.actualIdea.get(right);     	
     	}	
     },
     wipeRight: function() { 
     	if(left!=null){
     		console.log("app.js>>addSwipeGesture: swipe to right page: " + left);
     		window.location = App.actualIdea.get(left);     	
     	}	
     },
     min_move_x: 20,
     min_move_y: 20,
     preventDefaultEvents: true
});
}

Handlebars.registerHelper('fct_shortUrl', function() {
	console.log("date:" + this.get('updated_at'));
	var date = this.get('updated_at');
	console.log(date.toString);
	console.log(date.subsring(0,10));
	return new Handlebars.SafeString(this.get('updated_at').substring(0,10));
});