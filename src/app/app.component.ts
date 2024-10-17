import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fetchData } from './backend_services/backend.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [fetchData],
})

export class AppComponent {
  constructor(private fetchData: fetchData
  ) {}
  title = 'game_explorer';
  
  gamesList:Array<Object> = [];
  genreNumberList:Array<number> = [];
  noResultsToShow = false;

  async searchGames(searchText:string,searchLimit:string) {
    this.noResultsToShow = false;
    if (searchLimit == "") {
      searchLimit = "10";
      alert("Search limit set to 10 results.");
    }
    if (searchText == "") {
      alert("Please enter game name to search.");
      return [];
    } else {
      let gamesData = [];
      let gamesInfo:Array<Object> = [];
      var gamesInfoObj: {[k: string]: any} = {};
      var gameURLs: {[k: string]: any} = {};
      alert("Search Initiated")
      await this.fetchData.gameSearchRequest(searchText,searchLimit).then(data => {{
        // console.log(data)
        gamesData.push(data)
        var first_release_date;
        for (let i=0;i<data.length;i++){
          var currentGame = data[i];
          first_release_date = new Date(currentGame["first_release_date"] * 1000).toLocaleDateString('en-ZA');
          // this.getGamesDetails("genres",currentGame["genres"])
          // .then(genreArray => {
          //   console.log(genreArray)
          // });

          // console.log("Game ID: ",currentGame["id"],
          //   "\nTitle: ",currentGame["name"],
          //   "\nRelease date: ",first_release_date,
          //   "\nGenres: ",currentGame["genres"],
          //   "\nPlatforms: ",currentGame["platforms"],
          //   "\nCover Id: ",currentGame["cover"],
          //   "\nBrief Summary: ",currentGame["summary"])
          if(currentGame["id"] == undefined || currentGame["name"] == undefined || currentGame["genres"] == undefined || currentGame["genres"].length ==0 || currentGame["platforms"] == undefined || currentGame["platforms"].length == 0 || currentGame["cover"] == undefined || currentGame["summary"] == undefined){ 
            break;
          } else {
          }
          let extractedGameDetails = {
            title:currentGame["name"],
            id:currentGame["id"],
            release_date:first_release_date,
            genres:currentGame["genres"],
            genreString:"",
            platforms:currentGame["platforms"],
            platformString:"",
            cover_id:currentGame["cover"],
            cover_url:"",
            summary:currentGame["summary"],
          };
          // GENRES
          if (currentGame["genres"] != undefined || currentGame["genres"].length != 0) {
            // console.log("WE ARE IN")
              this.getGamesDetails("genres",currentGame["genres"]).then(genreArray => {
                extractedGameDetails.genreString = genreArray.join(", ");
                // console.log("GENRES: ",genreArray)
              });
          };
          if (currentGame["platforms"] != undefined || currentGame["platforms"].length != 0) {
              this.getGamesDetails("platforms",currentGame["platforms"]).then(platformArray => {
                extractedGameDetails.platformString = platformArray.join(", ");
                // console.log("PLATFORMS: ",platformArray)
              });
          };

          // SMALL COVER URL
          this.getCoverArt(extractedGameDetails.cover_id)
          .then(url => {
            extractedGameDetails.cover_url = url;
            // console.log(url);
          });
          console.log(extractedGameDetails);
          gamesInfo.push(extractedGameDetails)
          
        }        
        // console.log(gamesData)
        // var gameOne = data[0];
        // console.log("Name: ",gameOne["name"],"\nID: ",gameOne["id"])
        // console.log(this.fetchData.readGameInfo("genres",gameOne["genres"][0],"name"))
      }
      
      // for (let i=0;i<data.length;i++){
      //   this.fetchData.queryTable("genres",data[i]["genres"],"name").then(response=>{
      //     console.log(`ID for ${data[i]["name"]}: `,data[i]["id"],"\n",response[0]["name"]);
      //     this.genreList = {[data[i]["id"]]:response[0]["name"]};
      //   })
      // }
      // console.log(this.genreList);
    })
      this.gamesList = gamesInfo;
      // console.log(gamesInfo)
      alert("Search Complete")
      if (gamesInfo.length == 0) {
        this.noResultsToShow = true;
      }
      return gamesInfo;
    }
  }
  async getGamesDetails(table:string, arrayOfIds:Array<number>) {
    let returnString:Array<String> = [];
    let genreIndex=0;
    for (let i=0;i<arrayOfIds.length;i++){
      // console.log(arrayOfIds[i])
      await this.fetchData.queryTable(`${table}`,arrayOfIds[genreIndex],"name")
      .then(genre=>{
        returnString.push(genre[0]["name"]);
      })
    }
    // while (genreIndex<arrayOfIds.length){
    //   await this.fetchData.queryTable(`${table}`,arrayOfIds[genreIndex],"name")
    //   .then(genre=>{
    //     // console.log(genre[0]["name"])
        
    //     returnString.push(genre[0]["name"]);
    //   })
    //   genreIndex++
    // }
    // console.log(returnString[0]);
    return returnString;
  }

  async getCoverArt(unid:any) {
    let url = "";
    await this.fetchData.queryTable("covers",unid,"url").then(coverUrl => {
      // console.log("Cover URL: ",coverUrl[0]["url"]);
      url = coverUrl[0]["url"];
    });
    return url;
  }

}
