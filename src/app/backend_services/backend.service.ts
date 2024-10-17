export class fetchData {  
    gameSearchRequest(searchText:string,searchLimit:string) {
        var raw = `search \"${searchText}\";fields *;limit ${searchLimit};`; //LIMIT UP TO 500, KEPT AT 20 FOR TESTING
        var queryDb = fetch("https://7a79n1jwgk.execute-api.us-west-2.amazonaws.com/production/v4/games",{
                method: "POST",
                headers: {
                    "x-api-key": "RJVvCArmgo4UcmCeoR3EaRnjgNLN8j19NocN1dd9",
                },
                body: raw,
            }).then(response => {
                var textRes = response.json();
                // console.log(textRes);
                return textRes;
            }).catch(err => {
                alert(err);
                return err;
            });
        return queryDb;
    }

    queryTable(refTable:string,queryID:number,field:string) {
        var raw = `fields ${field}; where id = ${queryID};`;
        var queryDb = fetch(`https://7a79n1jwgk.execute-api.us-west-2.amazonaws.com/production/v4/${refTable}`,{
                method: "POST",
                headers: {
                    "x-api-key": "RJVvCArmgo4UcmCeoR3EaRnjgNLN8j19NocN1dd9",
                },
                body: raw,
            }).then(response => {
                var textRes = response.json();
                // console.log(textRes);
                return textRes;
            }).catch(err => {
                alert(err);
                return err;
            });
        return queryDb;
    }
    // async readGameInfo(refTable:string,unnid:number,searchText:string){
    //     //SEARCH TEXT WILL BE USED TO FILTER THROUGH THE TABLES BEING VIEWED (GENRES, PLATFORMS, . . . )
    //     if (refTable == "genres") {
    //         await this.queryTable(refTable,unnid,"name")
    //     }
    //     return "working";
    // }

}