import { GmapService } from '../../../services/gmap.service';
import { concat } from 'rxjs/operator/concat';
import { element } from 'protractor';




export function set_city_based_layer(that:any){


  // that.gmapservice.cityLayer.addListener("mouseover", (e)=>{mouseInToCityRegion(e, that)});
  // that.gmapservice.cityLayer.addListener("mouseout", (e)=>{mouseOutOfCityRegion(e, that)});

  that.gmapservice.cityLayer.addListener("click", (e) =>{onClickOnCityRegion(e, that)});




  that.gmapservice.cityLayer.setStyle(feature => {

    var outlineWeight = 0.5;


    if (feature.getProperty("state") === "hover") {
      outlineWeight = 2;
    }

    return {
      strokeWeight: outlineWeight,
      strokeColor: "#000000",
      zIndex: 0,
      fillColor:
        "hsl(" + 0 + "," + 0 + "%," + 0 + "%)",
      fillOpacity: 0.1,
      visible: true
    };


  })


}





function clear_locations(that:any){

  try {
    that.all_cities_markers.forEach(marker => {
      marker.setMap(null);
    });
  } catch (err) {
    console.log(err);
  }

}


// Allegheny Township, PA


function get_color(zillow_variable:number, that){

  var low = [61, 100, 50]; // color of smallest datum
  var high = [0, 100, 50]; // color of largest datum


  var color = [];



  if ((that.zillowMax_city - that.zillowMin_city) == 0){

    color[0] = 30;
    color[1] = 100;
    color[2] = 50;

  }else{

    var delta =
    (zillow_variable - that.zillowMin_city) /
    (that.zillowMax_city - that.zillowMin_city);

    color[0] = (high[0] - low[0]) * delta + low[0];
    color[1] = 100;
    color[2] = 50;

  }

  return "hsl(" + color[0] + "," + color[1] + "%," + color[2] + "%)";


}



export function redraw_locations(data, that){

  //-----------------------
  try {
    that.all_cities_markers.forEach(marker => {
      marker.setMap(null);
    });
  } catch (err) {
    console.log("error");
    console.log(err);
  }

  that.all_cities_markers = [];

  //-----------------------

  that.all_cities = {};

  let not_empty = false;

  try{

    data["data"].forEach(element => {

      let coords = JSON.parse(element['St_AsGeoJson(LOCATION)']);

      let lat_lng_string = coords['coordinates'][1].toString() + "::" + coords['coordinates'][0].toString();

      try{
        that.all_cities[lat_lng_string].push(element);
      }catch(err){
        that.all_cities[lat_lng_string] = [];
        that.all_cities[lat_lng_string].push(element);
      }

    });



  }catch(err){
    console.log(err);
  }



  try{

    let col_name = that.active_dataset.columns[that.active_dataset.field_slider_value];


    that.zillowMin_city = Number.MAX_VALUE;
    that.zillowMax_city = Number.MIN_VALUE;



    for (var key in that.all_cities) {
      // check if the property/key is defined in the object itself, not in parent
      if (that.all_cities.hasOwnProperty(key)){


          let metros = {}

          let zillowVariable = 0;
          let namecode = '';
          let is_first_metro = true;

          // Loop through the metros.
          that.all_cities[key].forEach(element => {

            metros[element['Metro']] = [parseFloat(element[col_name]), false, ['Population', element['population']],['CityName', element['RegionName']], ['Metro', element['Metro']] ];

            if(is_first_metro){
              zillowVariable = metros[element['Metro']][0];
              metros[element['Metro']][1] = true;
              namecode = element['namecode'];
              is_first_metro = false;

            }

          });


          if ((zillowVariable != -1000000000)){

            not_empty = true;

            if (zillowVariable < that.zillowMin_city) {
              that.zillowMin_city = zillowVariable;
            }
            if (zillowVariable > that.zillowMax_city) {
              that.zillowMax_city = zillowVariable;
            }

          }


          let icon_size = 10;

          let more_that_one_metro = false;
          if (Object.keys(metros).length > 1){
            icon_size = 15;
            more_that_one_metro = true;
          }


          if ((zillowVariable != -1000000000)){


            var city_icon = {
              path: that.gmapservice.google.maps.SymbolPath.CIRCLE,
              scale: icon_size,
              fillColor: get_color(zillowVariable, that),
              fillOpacity: 0.6,
              strokeWeight: 0.4
            }

            let coords = key.split('::')

            let myLatLng = {
              lat: parseFloat(coords[0]),
              lng: parseFloat(coords[1])
            };


            let marker = new that.gmapservice.google.maps.Marker({
              position: myLatLng,
              map: that.gmapservice.gmap,
              icon: city_icon,
              metros: metros,
              zillowVariable: zillowVariable,
              namecode: namecode,
              more_that_one_metro: more_that_one_metro,
              lat_lng_string: key
            });

            that.all_cities_markers.push(marker);



            if(key == that.current_lat_lng_string){
              console.log(key);
              that.infowindow_city.open(that.gmapservice.gmap , marker);

              that.infowindow_city.setContent(marker.zillowVariable.toString());

              let iconp = marker['icon'];

              iconp['strokeWeight'] = 2;

              marker.setIcon(iconp);

            }




            marker.addListener('click', () => {

              //console.log(that.active_dataset);

              $(".detailed_info_content").html('');

              that.infowindow_city.open(that.gmapservice.gmap , marker);

              that.infowindow_city.setContent(marker.zillowVariable.toString());

              //console.log(marker);

              that.current_lat_lng_string = marker.lat_lng_string;

              //that.active_dataset['Current_RegionName'] = e.feature.getProperty("RegionName");

              try{

                let iconp = that.current_city_marker['icon'];

                iconp['strokeWeight'] = 0.4;

                that.current_city_marker.setIcon(iconp);

              }catch(err){}




              let icon = marker['icon'];

              icon['strokeWeight'] = 2;

              marker.setIcon(icon);

              that.current_city_marker = marker;

              that.several_metros = []

              let first = true;
              for (var key in marker.metros) {
                if (marker.metros.hasOwnProperty(key)){
                  that.several_metros.push([key, marker.metros[key]]);
                  first = false;
                }
              }


              that.set_more_than_one_metro({'flag': true, 'data': that.several_metros});

            });



          }



      // END OF if (that.all_cities.hasOwnProperty(key))
      }


    // END OF for (var key in that.all_cities)
    }



    if (!not_empty){

      document.getElementById("zillow-min").textContent = "min";
      document.getElementById("zillow-max").textContent = "max";
    }else{
      update_legend(that);
    }



  }catch(err){
    console.log(err);
  }

  // try{

  //   if (that.current_city_marker){

  //     that.infowindow_city = new that.gmapservice.google.maps.InfoWindow({
  //       map: that.gmapservice.gmap,
  //     });
  //     console.log(that.gmapservice);
  //     console.log(that.current_city_marker);

  //     this.infowindow_city.close();
  //     that.infowindow_city.open(that.gmapservice.gmap , that.current_city_marker);
  //     that.infowindow_city.setContent(that.current_city_marker.zillowVariable.toString());

  //   }

  // }catch(err){
  //   console.log(err);
  // }


}



//========================================
// http://34.192.117.11/assets/images/building.png


export function draw_city_based_dataset(data:any, that:any){



  //this.zip_based_dataset = data;
  that.active_dataset.city_based_dataset = data;

  if(data["data"].length > 0){

    $("#toggle_dataset").prop("checked", true);

    that.gmapservice.cityLayer.forEach(feature => {
      that.gmapservice.cityLayer.remove(feature);
    });


    try {

      that.gmapservice.cityLayer.addGeoJson(data["geojson"], {
        idPropertyName: "namecode"
      });
    } catch (err) {
      $("#toggle_dataset").prop("checked", false);
      return;
    }

    redraw_locations(data, that);



  }





}



  export function toggle_dataset(that:any){


    if ($("#toggle_dataset").prop("checked")){

      try {

        that.gmapservice.cityLayer.forEach(feature => {
          that.gmapservice.cityLayer.remove(feature);
        });

        try {
          that.gmapservice.cityLayer.addGeoJson(that.active_dataset.city_based_dataset["geojson"], {
            idPropertyName: "RegionName"
          });
        } catch (err) {
          $("#toggle_dataset").prop("checked", false);
          return;
        }


        draw_city_based_dataset(that.active_dataset.city_based_dataset, that);


      } catch (err) {
        $("#toggle_dataset").prop("checked", false);
        return;
      }

    } else {

      clear_locations(that);

      that.gmapservice.cityLayer.forEach(feature => {
        that.gmapservice.cityLayer.remove(feature);
      });

    }



  }









export function activate_citybased_dataset(that:any){


  if (that.active_dataset.city_based_dataset){
    $("#toggle_dataset").prop("checked", true);

    that.gmapservice.cityLayer.forEach(feature => {
      that.gmapservice.cityLayer.remove(feature);
    });

    try {
      that.gmapservice.cityLayer.addGeoJson(that.active_dataset.city_based_dataset["geojson"], {
        idPropertyName: "RegionName"
      });
    } catch (err) {
      $("#toggle_dataset").prop("checked", false);
      return;
    }

    draw_city_based_dataset(that.active_dataset.city_based_dataset, that);


  }else{
    $("#toggle_dataset").prop("checked", false);

    that.gmapservice.cityLayer.forEach(feature => {
      that.gmapservice.cityLayer.remove(feature);
    });
  }

}


function update_legend(that:any) {
  // update and display the legend
  document.getElementById(
    "zillow-min"
  ).textContent = that.zillowMin_city.toLocaleString();
  document.getElementById(
    "zillow-max"
  ).textContent = that.zillowMax_city.toLocaleString();

  $(".progress").hide();
}



export function update_the_color_of_marker(e:any, that){


  let scale = 10;

  if(that.current_city_marker.more_that_one_metro){
    scale = 15;
  }

  that.current_city_marker.setIcon({
    path: that.gmapservice.google.maps.SymbolPath.CIRCLE,
    scale: scale,
    fillColor: get_color(e[1][0], that),
    fillOpacity: 0.6,
    strokeWeight: 2
  })

that.current_city_marker.zillowVariable = e[1][0];



}




// function mouseInToCityRegion(e, that){

// }

// function mouseOutOfCityRegion(e, that){

// }


function onClickOnCityRegion(e, that){

  that.gmapservice.set_morethanone_metro_event.emit({'flag': false, 'data': []});

  let area_namecode = e.feature.getProperty("namecode");

  that.all_cities_markers.forEach(element => {
    if (area_namecode == element['namecode']){

      if(!element['oriScale']){
        element['oriScale'] = element['icon']['scale'];
        element['icon']['scale'] = 25;
        element.setIcon(element['icon']);
        e.feature.setProperty("state", "hover");


        let html = "<b><b> NAMELSAD10: </b></b> + &nbsp;" + e.feature.getProperty("NAMELSAD10") + '<br>';

        html += "<b><b> Metro: </b></b> + &nbsp;" + e.feature.getProperty("Metro") + '<br>';
        html += "<b><b> Population: </b></b> + &nbsp;" + e.feature.getProperty("Population") + '<br>';
        html += "<b><b> ZIP: </b></b> + &nbsp;" + e.feature.getProperty("ZIP") + '<br>';

        $(".detailed_info_content").html(html);



      }else{
        element['icon']['scale'] = element['oriScale'];
        element.setIcon(element['icon']);
        delete element['oriScale'];
        e.feature.setProperty("state", "normal");
        $(".detailed_info_content").html('');
      }


    }
  });

}
