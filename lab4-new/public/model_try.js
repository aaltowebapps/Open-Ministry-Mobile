var Task = Backbone.Model.extend({
        initialize: function(){
            alert("Welcome to this world");
        }
    });
    
var Tasks = Backbone.Collection.extend({ 
  model: Task  
});

var task = tasks.create({
  name: "First Task",
  secs: "324",
  starting : "0"
});

alert(JSON.stringify(tasks.toJSON));