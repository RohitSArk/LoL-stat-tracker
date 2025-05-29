var API_key = "RGAPI-cce3b4aa-b1d9-44b7-a536-4eb9e9932181";
var summoner_name = "";
var newSumName = "";
var tagLine = "";
let puuid = "";
var server_url = "";
const Regions = ['br1.api.riotgames.com', 
    'eun1.api.riotgames.com', 
    'euw1.api.riotgames.com', 
    'jp1.api.riotgames.com', 
    'kr.api.riotgames.com', 
    'la1.api.riotgames.com', 
    'la2.api.riotgames.com', 
    'na1.api.riotgames.com', 
    'oc1.api.riotgames.com', 
    'tr1.api.riotgames.com', 
    'ru.api.riotgames.com', 
    'ph2.api.riotgames.com', 
    'sg2.api.riotgames.com', 
    'th2.api.riotgames.com', 
    'tw2.api.riotgames.com', 
    'vn2.api.riotgames.com'];


    const Spells = ['Clense', ' ', 'Exhaust', 'Flash', 'Ghost', 'Heal', ' ', ' ',' ', 'Smite','Teleport', ' ', 'Ignite',' ', ' ', ' ', ' ', ' ', ' ', 'Barrier']

    function chooseRegion(){
        RegionNumber = document.getElementById("choose_region").value;
        server_url = Regions[RegionNumber];
    }
    function Search_summoner(){
        chooseRegion();
        getSummonerInfo();
    }

async function getSummonerInfo() {
    summoner_name = document.getElementById("summoner_name").value;
    newSumName = summoner_name.replace(' ', '%20');
    tagLine = document.getElementById("tagLine").value;
    var summonerNameUrl =  "/riot/account/v1/accounts/by-riot-id/" + newSumName + "/" + tagLine + "?api_key=";
    var fullSummonerName = "https://americas.api.riotgames.com" + summonerNameUrl + API_key;
    const dataSummoner = await fetch(fullSummonerName);
    const dataSummoner2 = await dataSummoner.json();   
    puuid = dataSummoner2.puuid;
    //console.log(puuid);
    var summonerNameUrl = "/lol/summoner/v4/summoners/by-puuid/" + puuid + "?api_key=";
    var fullSummonerName = "https://" + server_url + summonerNameUrl + API_key;
    //console.log(fullSummonerName);



    // Summoner's Level
    const dataSummoner_1 = await fetch(fullSummonerName);
    const dataSummoner_2 = await dataSummoner_1.json();
    var summonerLevel = dataSummoner_2.summonerLevel;
    //console.log(summonerLevel);
    document.getElementById("summonerLevel_data").innerHTML = document.getElementById("summoner_name").value+ "'s level is: " + summonerLevel;

    // Summoner's Profile Picture
    var summonerPicNumber = dataSummoner_2.profileIconId;
    var profilePicUrl = "https://ddragon.leagueoflegends.com/cdn/14.19.1/img/profileicon/"+ summonerPicNumber + ".png";
    document.getElementById("summonerProfilePicture").src = profilePicUrl;

    //Ranked
    var summoner_id = dataSummoner_2.id;
    var summoner_puuid = dataSummoner_2.puuid;
    var summonernameURl_2 = "/lol/league/v4/entries/by-summoner/"
    var ranked_summoner_url = "https://"+server_url+summonernameURl_2+summoner_id+"?api_key="+API_key
    const rankedSummoner_1 = await fetch(ranked_summoner_url);
    const rankedSummoner_Full = await rankedSummoner_1.json();
    const rankedSummoner_data = rankedSummoner_Full[0]
    var summoner_wins = rankedSummoner_data.wins;
    var summoner_losses = rankedSummoner_data.losses;
    //console.log(summoner_wins);
    //Ranked win
    document.getElementById("ranked_win").innerHTML = "W: " + summoner_wins;
    //Ranked lose
    document.getElementById("ranked_lose").innerHTML = "L: "+ summoner_losses;
    //ranked w/r
    var summoner_winratio = Math.round((summoner_wins / (summoner_losses + summoner_wins))*1000/10);
    document.getElementById("ranked_winratio").innerHTML = "Win Rate: "+ summoner_winratio + "%";
    //ranked division
    var division = rankedSummoner_data.tier+" " + rankedSummoner_data.rank;
    var lp_ranked = rankedSummoner_data.leaguePoints;
    document.getElementById("ranked_division").innerHTML = division + " " + lp_ranked + " LP";

    //function to change color based on rank
    var division_tier = rankedSummoner_data.tier;
    if(division_tier == "IRON"){
        document.getElementById("ranked_division").style.color = "gray";
    }
    else if(division_tier == "BRONZE"){
        document.getElementById("ranked_division").style.color = "brown";
    }
    else if(division_tier == "SILVER"){
        document.getElementById("ranked_division").style.color = "lightgray";
    }
    else if(division_tier == "GOLD"){
        document.getElementById("ranked_division").style.color = "yellow";
    }
    else if(division_tier == "PLATINUM"){
        document.getElementById("ranked_division").style.color = "lightgreen";
    }
    else if(division_tier == "EMERALD"){
        document.getElementById("ranked_division").style.color = "green";
    }
    else if(division_tier == "DIAMOND"){
        document.getElementById("ranked_division").style.color = "lightblue";
    }
    else if(division_tier == "MASTER"){
        document.getElementById("ranked_division").style.color = "lightpurple";
    }
    else if(division_tier == "GRANDMASTER"){
        document.getElementById("ranked_division").style.color = "lightred";
    }
    else if(division_tier == "CHALLENGER"){
        document.getElementById("ranked_division").style.color = "red";
    }



    let matchResultA = [];
    let matchTimeA = [];
    let matchChamptionA = [];
    let matchSpell1A = [];
    let matchSpell2A = [];
    let matchMainRuneA = [];
    let matchSecondRuneA = [];
    let itemsA = [];
    let blueTeamA = [];
    let redTeamA = [];
    let blueTeamChampsA = [];
    let redTeamChampsA = [];

    
    //chamption statistics
    let matches_url = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/"+summoner_puuid+"/ids?start=0&count=100&api_key="+API_key;
    let matches_fetch = await fetch(matches_url);
    let matches_data = await matches_fetch.json();
    //console.log(matches_data);

    

    let runes_url = "https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/runesReforged.json";
    let runes_fetch = await fetch(runes_url);
    var runes_data = await runes_fetch.json();
    //console.log(runes_data);
    

    let items_url = "https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/item.json";
    let items_fetch = await fetch(items_url);
    var items_data = await items_fetch.json();



    let champsStatistics = [];
    let matchStatsA = [];
    for(let l = 0; l < 50; l++){
        let match_url = "https://americas.api.riotgames.com/lol/match/v5/matches/"+matches_data[l]+"?api_key="+API_key;
        let match_fetch = await fetch(match_url);
        let currentMatch_data = await match_fetch.json();
        let participants = currentMatch_data.metadata.participants;
        let matchTime = currentMatch_data.info.gameDuration;
        let matchMinutes = Math.floor(matchTime/60);
        let matchSeconds = matchTime%60;
        let matchItems = [];
        
        let blueTeam = [];
        let redTeam = [];
        let blueTeamChamps = [];
        let redTeamChamps = [];
        


        

        for (let k = 0; k < 10; k++){
            if(k<5){
                blueTeam.push(currentMatch_data.info.participants[k].riotIdGameName);
                blueTeamChamps.push(currentMatch_data.info.participants[k].championName);
            }
            else{
                redTeam.push(currentMatch_data.info.participants[k].riotIdGameName);
                redTeamChamps.push(currentMatch_data.info.participants[k].championName);
            }
        }


        let counter = 0;
        let datasetChamp = [];
        for(let i = 0; i < 10; i++){
            if(participants[i] == summoner_puuid){
                break;
            }
            counter += 1;
        }
        //console.log("counter " + counter);
        //console.log(currentMatch_data.info.participants[counter]);
        dataChamp = currentMatch_data.info.participants[counter];

        datasetChamp.push(dataChamp.championName);
        datasetChamp.push(dataChamp.kills);
        datasetChamp.push(dataChamp.deaths);
        datasetChamp.push(dataChamp.assists);
        datasetChamp.push(dataChamp.totalMinionsKilled+dataChamp.neutralMinionsKilled);
        datasetChamp.push(dataChamp.timePlayed);

        let matchStats = dataChamp.kills + " | " + dataChamp.deaths + " | " + dataChamp.assists;
        let matchChamption = dataChamp.championName;
        let matchResult = dataChamp.win;
        if (matchResult == false){
            matchResult = "WIN"
        }
        else{
            matchResult = "LOSE"
        }
        let matchSpell1 = dataChamp.summoner1Id;
        let matchSpell2 = dataChamp.summoner2Id;

        matchItems.push(dataChamp.item0);
        matchItems.push(dataChamp.item1);
        matchItems.push(dataChamp.item2);
        matchItems.push(dataChamp.item3);
        matchItems.push(dataChamp.item4);
        matchItems.push(dataChamp.item5);
        matchItems.push(dataChamp.item6);
        
        //console.log(matchItems);

        



        matchResultA.push(matchResult);
        matchTimeA.push(matchMinutes + ":" + matchSeconds);
        matchChamptionA.push(matchChamption);
        matchSpell1A.push(matchSpell1);
        matchSpell2A.push(matchSpell2);
        matchMainRuneA.push(matchMainRune);
        matchSecondRuneA.push(matchSecondRune);
        itemsA.push(matchItems);
        blueTeamA.push(blueTeam);
        redTeamA.push(redTeam);
        blueTeamChampsA.push(blueTeamChamps);
        redTeamChampsA.push(redTeamChamps);
        var matchMainRune = ""
        for(y = 0; y < 5; y++){
            if (dataChamp.perks.styles[0].style == runes_data[y].id){
                for (i = 0; i < 4; i++){
                    if(dataChamp.perks.styles[0].selections[0].perk == runes_data[y].slots[0].runes[i].id){
                        matchMainRune = runes_data[y].slots[0].runes[i].name;
                        break;
                    }
                }
                //console.log(runes_data[y].slots[0].runes[0].name);
            }
            
        }
        for(y = 0; y < 5; y++){
            if (dataChamp.perks.styles[0].style == runes_data[y].id){
                var matchSecondRune = runes_data[y].name;
            }
        //console.log(matchMainRune, matchSecondRune);
        }

        
        if(dataChamp.win == false){
            datasetChamp.push(0);
            matchResult = "LOSE";
        }else{
            datasetChamp.push(1);
            matchResult = "WIN";
        }
        matchResultA.push(matchResult);
        datasetChamp.push(1);
        champsStatistics.push(datasetChamp);
        matchStatsA.push(matchStats);
        // 0-4 blue
        //5-9 red
        //https://ddragon.leagueoflegends.com/cdn/15.5.1/img/item/1001.png
    }   
    //console.log(champsStatistics);

    let champsStatisticsNR = [];
    let champsStatsFinal = [];
    let counter2 = 0;
    for (let y = 0; y < 50; y++){
        counter2 = 0;
        for (let z = 0; z < champsStatsFinal.length; z++){
            if(champsStatistics[y][0] == champsStatsFinal[z][0]){
                counter2 += 1;
            }
        }
        if(counter2 == 0){
            //console.log("Y");
            champsStatisticsNR = [champsStatistics[y][0],0,0,0,0,0,0,0];
            champsStatsFinal.push(champsStatisticsNR);
        }   
    }
    for (let i = 0; i < 50; i++){
        for(y = 0; y < champsStatsFinal.length; y++){
            if(champsStatistics[i][0] == champsStatsFinal[y][0]){
                for(let o = 1; o < 8; o++){
                    champsStatsFinal[y][o] += champsStatistics[i][o];
                }
            }

        }
    }
    //console.log(champsStatsFinal);
    
    let kdaChamp;
    let champStatsCode = "";
    let matchHistoryCode = "";
    let champMatchesPlayed;
    let champWinRatio;
    let champAK;
    let champAD;
    let champAS;
    let champACS;
    let champMinutes;
    for(let m = 0; m<champsStatsFinal.length; m++){

        

        champMatchesPlayed = champsStatsFinal[m][7];
        champWinRatio = (champsStatsFinal[m][6] / champMatchesPlayed*100).toFixed(2);
        kdaChamp = (champsStatsFinal[m][1]+champsStatsFinal[m][3])/champsStatsFinal[m][2];
        champAk = champsStatsFinal[m][1]/champMatchesPlayed;
        champAD = champsStatsFinal[m][2] / champMatchesPlayed;
        champAS = champsStatsFinal[m][3] / champMatchesPlayed;
        champACS = champsStatsFinal[m][4] / (champsStatsFinal[m][5]/60);
        champStatsCode += "<dic id='currentChamp'><img src='https://ddragon.leagueoflegends.com/cdn/15.10.1/img/champion/"+champsStatsFinal[m][0]+".png' width='100' height='100' id='cChampImg'><br>KDA: " + kdaChamp.toFixed(2) + "<br>"+champAk.toFixed(2)+" | "+ champAD.toFixed(2)+ " | " + champAS.toFixed(2)+ "<br>AVG CS: " + champACS.toFixed(2) + "<br>" + champWinRatio+ "%" + "<br>Matches played: " + champMatchesPlayed + "</dic id='currentChamp'>";

        //\Desktop\Random\OP.GG\Temp\img\champion\tiles

        //console.log("https://ddragon.leagueoflegends.com/cdn/15.5.1/img/item/"+itemsA[0][1]+".png'")

        matchHistoryCode +="<div id ='match'><div id = 'firstColumn'><div id='result'>"+matchResultA[m]+"</div><div id='championMatch'><img src='https://ddragon.leagueoflegends.com/cdn/15.10.1/img/champion/"+matchChamptionA[m]+".png' width ='60' height ='60'></div><div id='matchTime'>"+matchTimeA[m]+"</div></div><div id='matchSpell1'>"+"</div><div id='items'>";
        for(let i = 0; i < 7; i++){
            matchHistoryCode += "<img src= https://ddragon.leagueoflegends.com/cdn/15.5.1/img/item/"+itemsA[m][i]+".png ' width=60 height=60>";
        }
        
        matchHistoryCode += "</div><div id='matchStats'>"+matchStatsA[m]+"</div><div id='blueTeam'>";
        for (let i = 0; i < 5; i++){
            matchHistoryCode += "<img src='https://ddragon.leagueoflegends.com/cdn/15.10.1/img/champion/"+blueTeamChampsA[m][i]+".png' width=30 height=30>"+blueTeamA[m][i]+"</br>";
        }
        matchHistoryCode += "</div><div id='redTeam'>";
        for (let i = 0; i < 5; i++){
            matchHistoryCode += "<img src='https://ddragon.leagueoflegends.com/cdn/15.10.1/img/champion/"+redTeamChampsA[m][i]+".png' width=30 height=30>"+redTeamA[m][i]+"</br>";
        }
        matchHistoryCode += "</div></div>";
    }
    document.getElementById("champStats").innerHTML = champStatsCode;
    document.getElementById("matchHistory").innerHTML = matchHistoryCode;
    
}

