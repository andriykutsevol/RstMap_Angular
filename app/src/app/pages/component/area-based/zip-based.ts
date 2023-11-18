export function set_zip_based_layer(that:any){


  // that.gmapservice.zipLayer.addListener("mouseover", (e)=>{mouseInToRegion(e, that)});
  // that.gmapservice.zipLayer.addListener("mouseout", (e)=>{mouseOutOfRegion(e, that)});

  that.gmapservice.zipLayer.addListener("click", (e) =>{
    onclickOnRegion(e, that);
    that.gmapservice.set_morethanone_metro_event.emit({'flag': false, 'data': []});


  });


  that.gmapservice.zipLayer.setStyle(feature => {


    var low = [60, 100, 50]; // color of smallest datum
    var high = [0, 100, 50]; // color of largest datum


    var color = [];
    // for (var i = 0; i < 3; i++) {
    //   color[i] = (high[i] - low[i]) * delta + low[i];
    // }

    if ((that.zillowMax_zip - that.zillowMin_zip) == 0){

      color[0] = 30;
      color[1] = 100;
      color[2] = 50;

    }else{

      var delta =
      (feature.getProperty("zillow_variable") - that.zillowMin_zip) /
      (that.zillowMax_zip - that.zillowMin_zip);

      color[0] = (high[0] - low[0]) * delta + low[0];
      color[1] = 100;
      color[2] = 50;

    }



    var showRow = true;
    if (
      // feature.getProperty("zillow_variable") == null ||
      // isNaN(feature.getProperty("zillow_variable")) ||
      // feature.getProperty("zillow_variable") == -1

      feature.getProperty("zillow_variable") == -1

    ) {
      showRow = false;
    }


    //---- To exclude ---------------

    if(that.featureIDs_to_exclude.includes(feature.j)){
      // console.log(that.gmapservice.sdLayer.getFeatureById('2502790'));
      showRow = false;
    }

    //--------------------------------



    var outlineWeight = 0.5,
      zIndex = 1;

    if (feature.getProperty("state") === "hover") {
      outlineWeight = zIndex = 2;
    }

    //-------------------------

    if (that.active_dataset['Current_RegionName'] == feature.getProperty("RegionName")){
      that.infowindow_zip.setContent(feature.getProperty("zillow_variable").toString());
    }

    //-------------------------

    return {
      strokeWeight: outlineWeight,
      strokeColor: "#fff",
      zIndex: zIndex,
      fillColor:
        "hsl(" + color[0] + "," + color[1] + "%," + color[2] + "%)",
      fillOpacity: 0.6,
      visible: showRow
    };
  });




}









  //========================================

  export function draw_zip_based_dataset(data:any, that:any){



    //that.zip_based_dataset = data;
    that.active_dataset.zip_based_dataset = data;

    if(data["data"].length > 0){

      $("#toggle_dataset").prop("checked", true);

      that.gmapservice.zipLayer.forEach(feature => {
        that.gmapservice.zipLayer.remove(feature);
      });

      try {
        that.gmapservice.zipLayer.addGeoJson(data["geojson"], {
          idPropertyName: "RegionName"
        });
      } catch (err) {
        $("#toggle_dataset").prop("checked", false);
        return;
      }

      //----------------------------

      redraw_zip_features(data, that);

      //----------------------------

    }else {

    }


  }



export function redraw_zip_features(data:any, that:any){


    that.zillowMin_zip = Number.MAX_VALUE;
    that.zillowMax_zip = Number.MIN_VALUE;


    try {

      let not_empty = false;

      data["data"].forEach(element => {

        //console.log(element['BuyerSellerIndex']);

        let col_name = that.active_dataset.columns[that.active_dataset.field_slider_value];

        let zillowVariable = parseFloat(element[col_name]);

        let stateId = element['RegionName'];


        if(! that.featureIDs_to_exclude.includes(stateId)){

              if ((zillowVariable != -1)){

                not_empty = true;

                if (zillowVariable < that.zillowMin_zip) {
                  that.zillowMin_zip = zillowVariable;
                }
                if (zillowVariable > that.zillowMax_zip) {
                  that.zillowMax_zip = zillowVariable;
                }

              }

        }

        try {
          that.gmapservice.zipLayer
            .getFeatureById(stateId)
            .setProperty("zillow_variable", zillowVariable);
        } catch (err) {
          //console.log('err: setProperty');
        }

      });

      if (!not_empty){

        document.getElementById("zillow-min").textContent = "min";
        document.getElementById("zillow-max").textContent = "max";
      }else{
        update_legend(that);
      }

    } catch (err) {
      return;
    }



  }




export function toggle_dataset(that:any){


  if ($("#toggle_dataset").prop("checked")){

    try {

      that.gmapservice.zipLayer.forEach(feature => {
        that.gmapservice.zipLayer.remove(feature);
      });

      try {
        that.gmapservice.zipLayer.addGeoJson(that.active_dataset.zip_based_dataset["geojson"], {
          idPropertyName: "RegionName"
        });
      } catch (err) {
        $("#toggle_dataset").prop("checked", false);
        return;
      }


      redraw_zip_features(that.active_dataset.zip_based_dataset, that);


    } catch (err) {
      $("#toggle_dataset").prop("checked", false);
      return;
    }

  } else {

    that.gmapservice.zipLayer.forEach(feature => {
      that.gmapservice.zipLayer.remove(feature);
    });

  }

}







export function activate_zipbased_dataset(that:any){

  //if(that.active_dataset.sd_based_dataset){
    that.gmapservice.sdLayer.forEach(feature => {
      that.gmapservice.sdLayer.remove(feature);
    });
  //}

  if (that.active_dataset.zip_based_dataset){
    $("#toggle_dataset").prop("checked", true);


    that.gmapservice.zipLayer.forEach(feature => {
      that.gmapservice.zipLayer.remove(feature);
    });

    try {
      that.gmapservice.zipLayer.addGeoJson(that.active_dataset.zip_based_dataset["geojson"], {
        idPropertyName: "RegionName"
      });
    } catch (err) {
      $("#toggle_dataset").prop("checked", false);
      return;
    }


    redraw_zip_features(that.active_dataset.zip_based_dataset, that);

  }else{
    console.log('toggle_dataset');
    $("#toggle_dataset").prop("checked", false);

    that.gmapservice.zipLayer.forEach(feature => {
      that.gmapservice.zipLayer.remove(feature);
    });

    }


}




  //==================================================
  //==================================================



  // export function mouseInToRegion(e:any, that:any) {




  //   e.feature.setProperty("state", "hover");

  //   let coords = JSON.parse(e.feature.getProperty("POSITION"))['coordinates'];

  //   that.infowindow_zip.setOptions({
  //     disableAutoPan : true
  //   });

  //   that.infowindow_zip.setPosition({lat: coords[1], lng: coords[0]});

  //   that.infowindow_zip.setContent(e.feature.getProperty("zillow_variable").toString());

  //   that.infowindow_zip.open(that.gmapservice.gmap);


  // }



  //-----------------------------------------



  // export function mouseOutOfRegion(e:any, that:any) {
  //   // reset the hover state, returning the border to normal
  //   e.feature.setProperty("state", "normal");

  // }


  //-----------------------------------------


  function html_from_props(e:any, that:any){

    let html = '';

    try{

      e.feature.forEachProperty( (val,name) => {
        if(name == 'POSITION'){
        }else if(name == 'state'){
        }else if(name == 'zillow_variable'){

          name = that.active_dataset.title + " : " + that.active_dataset.columns[that.active_dataset.field_slider_value];

          html += '<b><b>' + name + ' : </b></b>' + val + ' <br>';

        }else{
          html += '<b><b>' + name + ': </b></b>' + val + ' <br>';
        }

      } );

    }catch(err){
      console.log('exception from html_from_props(e:any)');
      console.log(err);
    }

    return html;

  }



  function set_main_info_html(e:any, that:any){

    // https://developers.google.com/maps/documentation/javascript/layers
    // https://developers.google.com/maps/documentation/javascript/datalayer


    let html = html_from_props(e, that);

    $(".detailed_info_content").html(html);


  }

//---------------------------------------------------



  function onclickOnRegion(e:any, that:any){


    that.gmapservice.zipLayer.forEach(feature => {
      // that.gmapservice.zipLayer.remove(feature);
      feature.setProperty("state", "normal");
    });

    e.feature.setProperty("state", "hover");

    that.current_featureID = e.feature.j;


    that.active_dataset['Current_RegionName'] = e.feature.getProperty("RegionName");

    let coords = JSON.parse(e.feature.getProperty("POSITION"))['coordinates'];

    that.infowindow_zip.setOptions({
      disableAutoPan : true
    });

    that.infowindow_zip.setPosition({lat: coords[1], lng: coords[0]});

    that.infowindow_zip.setContent(e.feature.getProperty("zillow_variable").toString());

    that.infowindow_zip.open(that.gmapservice.gmap);

    set_main_info_html(e, that);

  }


  function update_legend(that:any) {
    // update and display the legend
    document.getElementById(
      "zillow-min"
    ).textContent = that.zillowMin_zip.toLocaleString();
    document.getElementById(
      "zillow-max"
    ).textContent = that.zillowMax_zip.toLocaleString();

    $(".progress").hide();
  }
