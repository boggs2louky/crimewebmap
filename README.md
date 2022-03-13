# crimewebmap
Crime Data Web Mapping Application for front end development Course 2 Code Louisville

Project is a simple web map application displaying robberies and burglaries within Jefferson County for 2021. Data was pulled from the Louisville Metro Police Dept. Libre Office and QGIS were used to clean up data and export to geojson files for consumption in the webmap.  Openlayers and Chart js were used to create web map and the bar graph for the data on burglaries and robberies. Since data was/is not updated to an source for crime statistics at the geographic level (Jefferson County, KY) I used the Interational Space Station API to pull coordinates from their server and display (a refresh is required for the coordinates to be updated.) in order to meet requirements.

Three Features used in the project are as follows:

1.) Read and parse an external file (such as JSON or CSV) into your application and display some data from that in your app.
    The Crime data 2021, the Neighborhoods, and the Police Districts layers are all geojson files. While the neighborhoods and crime data 2021 geojsons are used as vector layers within the web map. The Crime Data will allow you to view the type of crime (robbery or burglary only) that was committed at the respective point. The Neighborhoods vector layer will also allow you to select a polygon to display the neighborhood name within the Old City of Louisville. 

2.) Retrieve data from an external API and display data in your app (such as with fetch()).
    The International Space Station (lat/long coordinates) are fetched and displayed on the page. The browser will have to be refreshed in order for the coordinates to be updated.  
    Additionally, the Police Districts vector layer that was used is also being pulled from LOJIC servers, but I did not think this met the intent of the requirements, so I used the ISS as discussed above. No other data for crime at the geographic level I used was available via an API so I used the ISS (it doesn't seem to fit in well with the project but I did it anyways.)

3.) Create an array, dictionary or list, populate it with multiple values, retrieve at least one
    value, and use or display it in your application.
    Using Chart JS I created a simple bar graph that has a simple array of two values (number of robberies and the number of burglaries for 2021).  This is displayed in the bar graph on the page and if scrolled on the number for each will popup.

4.) Visualize data in a graph, chart, or other visual representation of data.
    Again, Chart JS was used, as discussed in #3, to display data in a visual bar chart for the robberies and burglaries for 2021 crime data.  

Special Instructions:

In order to use Bing Maps with the web map the user will need to create an account with microsoft in order to obtain a key. Once a key is obtained the user will need to copy and paste that key into the line 39 of the main.js file. Once that key is placed and the file is saved it will be visible once the user selects the radio button on the "BingMaps". 

