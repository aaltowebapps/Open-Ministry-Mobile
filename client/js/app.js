var App = Ember.Application.create();

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
      templateName: 'settings'
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
      }),
	  /* consume the path parameter when the state is entered
	  enter: function(stateManager, transition) {
	    this._super(stateManager, transition);
		var itemId = stateManager.getPath('params.id');
		App.actualIdea = App.store.find(App.IdeaObj,itemId);
		console.log("1-store:" + App.actualIdea.get('title') + " " + itemId);
		this.get('view').set('content', App.actualIdea);
	  }*/
    }),
    section2: App.SubNavState.create({
      route: 'idea-section2/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section2'
      }),
	  /* consume the path parameter when the state is entered
	  enter: function(stateManager, transition) {
	    this._super(stateManager, transition);
		var itemId = stateManager.getPath('params.id');
		App.actualIdea = App.store.find(App.IdeaObj,itemId);
		console.log("2-store:" + App.actualIdea.get('title') + " " + itemId);
		this.get('view').set('content', App.actualIdea);
	  }*/
    }),
    section3: App.SubNavState.create({
      route: 'idea-section3/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section3'
      }),
	  /* consume the path parameter when the state is entered
	  enter: function(stateManager, transition) {
	    this._super(stateManager, transition);
		var itemId = stateManager.getPath('params.id');
		App.actualIdea = App.store.find(App.IdeaObj,itemId);
		console.log("3-store:" + App.actualIdea.get('title') + " " + itemId);
		this.get('view').set('content', App.actualIdea);
	  }*/
    }),
    section4: App.SubNavState.create({
      route: 'idea-section4/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section4'
      }),
	  /* consume the path parameter when the state is entered
	  enter: function(stateManager, transition) {
	    this._super(stateManager, transition);
		var itemId = stateManager.getPath('params.id');
		App.actualIdea = App.store.find(App.IdeaObj,itemId);
		console.log("4-store:" + App.actualIdea.get('title') + " " + itemId);
		this.get('view').set('content', App.actualIdea);
	  }*/
    }),
    section5: App.SubNavState.create({
      route: 'idea-section5/:id',
      viewClass: Em.View.extend({
        templateName: 'idea-section5'
      }),
	  /* consume the path parameter when the state is entered
	  enter: function(stateManager, transition) {
	    this._super(stateManager, transition);
		var itemId = stateManager.getPath('params.id');
		App.actualIdea = App.store.find(App.IdeaObj,itemId);
		console.log("5-store:" + App.actualIdea.get('title') + " " + itemId);
		this.get('view').set('content', App.actualIdea);
	  }*/
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
    })/*,
    idea: Em.LayoutState.create({
      route: ':id', // specify the path to take a parameter
      viewClass: Em.View.extend({
        templateName: 'ideaDetail'
      }),
      // consume the path parameter when the state is entered
      enter: function(stateManager, transition) {
        this._super(stateManager, transition);
        var itemId = stateManager.getPath('params.id');
        var item = App.store.find(App.IdeaObj,itemId);
        console.log("store:" + item);
        this.get('view').set('content', item);
      }
    })*/
  })
});

$(function() {
  App.main.appendTo('body');
  App.routeManager.start();
});

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

/* AREA EMBER-DATA.JS */
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
    url: 'http://localhost:3000/ideas'
});

App.allIdeas = App.store.findAll(App.IdeaObj);

/*
App.ideasController = Em.ArrayController.create({
    init: function() {
        this.set('content', App.store.findAll(App.Idea));
    }
});
App.idea1 = App.store.find(App.IdeaObj,1);
*/
console.log(App.allIdeas);
