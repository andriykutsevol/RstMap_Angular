export function set_sd_based_layer(that:any){


        // that.gmapservice.zipLayer.addListener("mouseover", (e)=>{mouseInToRegion(e, that)});
        // that.gmapservice.zipLayer.addListener("mouseout", (e)=>{mouseOutOfRegion(e, that)});

        that.gmapservice.sdLayer.addListener("click", (e) =>{
          onclickOnRegion(e, that);
        });


        that.gmapservice.sdLayer.setStyle(feature => {


          var low = [60, 100, 50]; // color of smallest datum
          var high = [0, 100, 50]; // color of largest datum


          var color = [];
          // for (var i = 0; i < 3; i++) {
          //   color[i] = (high[i] - low[i]) * delta + low[i];
          // }

          if ((that.sdMax - that.sdMin) == 0){

            color[0] = 30;
            color[1] = 100;
            color[2] = 50;

          }else{


            var delta =
            (feature.getProperty("zillow_variable") - that.sdMin) /
            (that.sdMax - that.sdMin);


            color[0] = (high[0] - low[0]) * delta + low[0];
            color[1] = 100;
            color[2] = 50;

          }


          var showRow = true;
          if (
            feature.getProperty("zillow_variable") == null ||
            isNaN(feature.getProperty("zillow_variable"))

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

          if (that.active_dataset['Current_RegionName'] == feature.getProperty("GEOID")){
            that.infowindow_sd.setContent(feature.getProperty("zillow_variable").toString());
          }

          // -------------------------

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

  export function draw_sd_based_dataset(data:any, that:any){



    // //that.sd_based_dataset = data;
    that.active_dataset.sd_based_dataset = data;

    if(data["data"].length > 0){

      $("#toggle_dataset").prop("checked", true);

      that.gmapservice.sdLayer.forEach(feature => {
        that.gmapservice.sdLayer.remove(feature);
      });

      try {
        that.gmapservice.sdLayer.addGeoJson(data["geojson"], {
          idPropertyName: "GEOID"
        });

      } catch (err) {
        $("#toggle_dataset").prop("checked", false);
        return;
      }

      //----------------------------

      redraw_sd_features(data, that);

      //----------------------------

    }else {

    }


  }



export function redraw_sd_features(data:any, that:any){


    that.sdMin = Number.MAX_VALUE;
    that.sdMax = Number.MIN_VALUE;


    try {

      let not_empty = false;

      data["data"].forEach(element => {


          let col_name = that.active_dataset.columns[that.active_dataset.field_slider_value];

          let zillowVariable = parseFloat(element[col_name]);

          let geoId = element['GEOID'];

          if(! that.featureIDs_to_exclude.includes(geoId)){

                //isNaN(feature.getProperty("zillow_variable"))
                if (!isNaN(zillowVariable)){

                  not_empty = true;

                  if (zillowVariable < that.sdMin) {
                    that.sdMin = zillowVariable;
                  }
                  if (zillowVariable > that.sdMax) {
                    that.sdMax = zillowVariable;
                  }

                }

          }


          try {
            that.gmapservice.sdLayer
              .getFeatureById(geoId)
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

      that.gmapservice.sdLayer.forEach(feature => {
        that.gmapservice.sdLayer.remove(feature);
      });

      try {
        that.gmapservice.sdLayer.addGeoJson(that.active_dataset.sd_based_dataset["geojson"], {
          idPropertyName: "GEOID"
        });
      } catch (err) {
        $("#toggle_dataset").prop("checked", false);
        return;
      }


      redraw_sd_features(that.active_dataset.sd_based_dataset, that);


    } catch (err) {
      $("#toggle_dataset").prop("checked", false);
      return;
    }

  } else {

    that.gmapservice.sdLayer.forEach(feature => {
      that.gmapservice.sdLayer.remove(feature);
    });

  }

}






export function activate_sdbased_dataset(that:any){


  //if(that.active_dataset.zip_based_dataset){
    that.gmapservice.zipLayer.forEach(feature => {
      that.gmapservice.zipLayer.remove(feature);
    });
  //}


  if (that.active_dataset.sd_based_dataset){
    $("#toggle_dataset").prop("checked", true);


    that.gmapservice.sdLayer.forEach(feature => {
      that.gmapservice.sdLayer.remove(feature);
    });



    try {
      that.gmapservice.sdLayer.addGeoJson(that.active_dataset.sd_based_dataset["geojson"], {
        idPropertyName: "GEOID"
      });
    } catch (err) {
      $("#toggle_dataset").prop("checked", false);
      return;
    }


    redraw_sd_features(that.active_dataset.sd_based_dataset, that);

  }else{
    $("#toggle_dataset").prop("checked", false);

    that.gmapservice.sdLayer.forEach(feature => {
      that.gmapservice.sdLayer.remove(feature);
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
        if(name == 'LOCATION'){
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


    that.gmapservice.sdLayer.forEach(feature => {
      // that.gmapservice.zipLayer.remove(feature);
      feature.setProperty("state", "normal");
    });

    e.feature.setProperty("state", "hover");

    that.current_featureID = e.feature.j;


    that.active_dataset['Current_RegionName'] = e.feature.getProperty("GEOID");

    let coords = JSON.parse(e.feature.getProperty("LOCATION"))['coordinates'];

    that.infowindow_sd.setOptions({
      disableAutoPan : true
    });

    that.infowindow_sd.setPosition({lat: coords[1], lng: coords[0]});

    that.infowindow_sd.setContent(e.feature.getProperty("zillow_variable").toString());

    that.infowindow_sd.open(that.gmapservice.gmap);

    set_main_info_html(e, that);

  }


  function update_legend(that:any) {
    // update and display the legend
    document.getElementById(
      "zillow-min"
    ).textContent = that.sdMin.toLocaleString();
    document.getElementById(
      "zillow-max"
    ).textContent = that.sdMax.toLocaleString();

    $(".progress").hide();
  }
