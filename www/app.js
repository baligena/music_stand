///////////////////UTILITY
function util_error(message){
   console.log('%c' +message, 'color: red');
}
///////////////////////////
window.onerror = function(a,b,c){
  alert(a+'\n'+b+'\n'+c);
}


//DEFAULTS
window.app = {
  url:''
  ,file:''
  ,cifra: {
    id:undefined,
    history:[]
  }
  ,view:{}
  ,pages:{}
  ,collection:{}
  ,router:{}
  ,data:{}
  ,URN:{
      current:'',
      previous:'',
  }
}

var get_data = {
    source: 'http://fsq.baligena.com/convert_music_stand?download'

    ,mobile: function()
    {
        var deferred = new $.Deferred();
        try{
            if(navigator.network.connection.type == 'none'){
                alert('get from localstorage');
                var retrievedObject = localStorage.getItem('cifras');
                window.app.data.JSON = JSON.parse(retrievedObject);
                deferred.resolve();
            }
            else{
                return $.get( this.source, function( data ) {
                    window.app.data.JSON = JSON.parse(data);
                    localStorage.setItem('cifras', JSON.stringify(app.data.JSON));
                });
            }
        }
        catch(e){
            alert('Device not ready, should try again');
            deferred.reject();
        }
        return deferred;
    }
    ,browser:function(){
        return $.get( this.source, function( data ) {
            window.app.data.JSON = JSON.parse(data);
            localStorage.setItem('cifras', JSON.stringify(app.data.JSON));
        });
    }
}

var load_cifras = function(){
    return (/Chrome/i.test(navigator.userAgent) ? get_data.browser() : get_data.mobile());
}

app.view.page = Backbone.View.extend({
    //DEFAULTS
    el: 'main'
    ,name: 'SET page NAME, CURRENTLY COMING FROM PARENT'
    ,initialize:function(options){
        //initialize runs only once when object is initiated
        this.clear_page(); //this may be the cause of app showing blank as it boots up
        this.options = options;
        app.url = document.URL;
        app.file = location.pathname;
        _.bindAll(this, 'render');
        this.render();
    }
    ,set_URN:function(){
        app.URN.previous = app.URN.current;
        app.URN.current = location.hash;
    }
    ,change_page:function(ev){
        // console.log('change page'); //check for duplicates
        $('.controls li').css('background','rgb(0, 26, 3)');

        this.record_history(ev.target.id-1);
        app.cifra.id = ev.target.id-1;
        if(ev.target.className == 'first_line'){
          app.route.navigate('cifra/'+app.cifra.id, {trigger: true});
        }
        else{
          app.route.navigate(ev.target.id, {trigger: true});
          // console.log($(ev.target).html());
          //controls css
          $(ev.target).css('background','grey');
        }
        $('body').animate({ scrollTop: 0 }, 0); //scroll to the top of page

    }
    ,record_history:function(id){ 
        if( isNaN(id) || id == -1){ //only record the cifra pages that has an id set to a number greater than -1
          return false;
        }
        var history =  app.cifra.history;
        var i = history.indexOf(id)
        if( i != -1){ //no duplicates
          history.splice(i, 1);
        }
        history.unshift(id); 
    }
    ,clear_page:function(){
        // alert('page was cleared');
        var deferred = new $.Deferred();
        this.$el.html('');
        deferred.resolve('hello world');
        return deferred;
    }
});

  app.view.controls = app.view.page.extend({
      el: 'body'
      ,events:{
          'click .controls li': 'change_page'
      }
      ,initialize:function(){
          this.draw_controls();
      }
      ,draw_controls:function(){
          this.$el.append('<li class="null"></li>'); //hack that make the control navigation not overlap/clear
          
          this.$el.append('<ul class="controls"></ul>');
          var ul = $('ul.controls');
          //when you add a page route is should automatically be created a page
          ul.append('<li id="">Alpha</li>');      
          ul.append('<li id="history">History</li>');      
          ul.append('<li id="info">Info</li>');      
          ul.append('<li id="version">v2.0.3</li>');      
      }
  });

app.view.nav_list = app.view.page.extend({
    render: function(){
        this.set_URN();
        this.draw_list();
        return this;
    } 
    ,draw_list:function(){
        var that = this;
        var i = 1;
        app.data.collection.each(function(model){
            that.$el.append('<li class="first_line" id=' + i + '>' + model.get('first_line') + '</li>');
            i++;
        });
    }
})

app.view.home_page = app.view.nav_list.extend({
    name: 'home' 
    ,events:{
        'click li.first_line': 'change_page'
    }
});

app.view.history_page = app.view.nav_list.extend({
    //if you load the history page directly theres no events to make the navigation work
    name: 'history'
    ,draw_list:function(){
       var that = this;
       var history = app.cifra.history;
       $.each(history, function(key, value){
          if(value != undefined){
              // that.$el.append('<li class="first_line" id=' + (value+1) + '>' + that.collection.at(value).get('first_line') + '</li>');
              that.$el.append('<li class="first_line" id=' + (value+1) + '>' + app.data.collection.at(value).get('first_line') + '</li>');
          }
       });
    }     
});

app.view.cifra_page = app.view.page.extend({
    name: 'cifra'
    ,render: function(){
        this.set_URN();
        // $('body').animate({ scrollTop: 0 }, 0); //scroll to the top of page
        this.$el.append('<pre>'+app.data.collection.at(app.cifra.id).get('html')+'</pre>');
        return this;
    }
});

app.view.info_page = app.view.page.extend({
    name: 'info'
    ,render: function(){
        this.$el.append('<p>info page</p>');
        this.$el.append('<p>any errors?</p>');
        this.$el.append('<p>Is internet on?</p>');
        this.$el.append('<span id="update_list">Update Cifras</span>');
        return this;
    }
    ,events:{
        'click #update_list':'update_list'
    }
    ,update_list: function(){
        load_cifras().done(function(){
            app.data.collection = new app.collection.cifras(app.data.JSON);
        });
    }
});

app.collection.cifras = Backbone.Collection.extend({
    // model: Song
});

app.router.music_stand = Backbone.Router.extend({
    routes:{
        // "route", "fuction name",
        "": "draw_home",
        "cifra/:id": "draw_cifra", //eg: URL/#/cifra/12
        "history": "draw_history",
        "info": "draw_info",
    }
    ,initialize:function(){
          new app.view.controls(); 
          app.data.collection = new app.collection.cifras(app.data.JSON);
    } 
    ,draw_home:function(){
        // this.render_view('home_page','{collection: app.data.collection}');
        this.render_view('home_page');
    }
    ,draw_cifra: function(id){
        if(app.cifra['id'] == undefined){
          app.route.navigate('', {trigger: true});
          util_error('Custom Warning: app.cifra.id was not set.  May be because you arrived at the previous route incorrectly, therefore the page was redirected.\nFile: '+ app.file+'\nRoute:"'+app.URN.current+'"');
          return false;
        }
        // this.render_view('cifra_page','{collection: app.data.collection}');
        this.render_view('cifra_page');
    }
    ,draw_history:function(){
        // this.render_view('history_page','{collection: app.data.collection}');
        this.render_view('history_page');
    }
    ,draw_info:function(){
        this.render_view('info_page');    
    }
    // ,render_view:function(view, param){
    ,render_view:function(view){
        page = app.pages[view];
        if(!page){  //exist?
          // app.pages[view] = eval('new app.view.'+ view + '('+param+')');
          app.pages[view] = eval('new app.view.'+ view);
        }
        else{
            page.clear_page().done(function(n){
                page.render();
                // console.log(n);
            });
        }
    }

});
  


load_cifras().done(function(){
   app.route = new app.router.music_stand;
       if(Backbone.History.started == false){
            Backbone.history.start(); 
       }

});



