// Krystian Niemczyk 2023 
let isPaused = true;
let isPlaying = false;
let id = 3;
let audio;
var ysa;
const data = {
    track: [
        {
            id: 0,
            name: "Dark Horse",
            author: "Katy Perry",
            thumbnail: "url(img/0.png)",
            path: 'audio/0.mp3'
        },
        {
            id: 1,
            name: "Counting Stars",
            author: "OneRepublic",
            thumbnail: "url(img/1.png)",
            path: 'audio/1.mp3'
        },
        {
            id: 2,
            name: "Let Her Go",
            author: "Passenger",
            thumbnail: "url(img/2.jpg)",
            path: 'audio/2.mp3'
        },
        {
            id: 3,
            name: "Chandelier",
            author: "Sia",
            thumbnail: "url(img/3.jpg)",
            path: 'audio/3.mp3'
        }
    ]
}


//funkcja do wyszukiwania piosenki
function search(element){
    document.getElementById("holder").innerHTML = "";
    let query = element.value.toUpperCase()
    data.track.forEach(item => {
        if(item.author.toUpperCase().includes(query) || item.name.toUpperCase().includes(query))
        {
            let div = document.createElement("div");
            let h = document.createElement('h2');
            h.innerText = item.name;
            div.classList.add('item');
            if(lightMode) div.classList.add('lightitem');
            div.innerText = item.author;
            div.append(h);
            document.getElementById("holder").append(div);
            addEventListeners();
        }
    })
}

//funkcja do pauzowania muzyki
function pause() {
    if(isPaused)
    {
        document.getElementById("iconPause").classList.remove("fa-pause");
        document.getElementById("iconPause").classList.add("fa-play");
        audio.pause();
        isPaused = false;
    }else{
        document.getElementById("iconPause").classList.remove("fa-play");
        document.getElementById("iconPause").classList.add("fa-pause");
        audio.play();
        isPaused = true;
    }
}

//funkcja dostosowujaca glosnosc muzyki
function volume(element) {
    audio.volume = element.value / 100;
    if(audio.volume < 0.7)
    {
        document.getElementById("iconVolume").classList.add("fa-volume-low")
        document.getElementById("iconVolume").classList.remove("fa-volume-high")
        document.getElementById("iconVolume").classList.remove("fa-volume-xmark")
    }
    if(audio.volume > 0.7 && audio.volume < 1){
        document.getElementById("iconVolume").classList.add("fa-volume-high")
        document.getElementById("iconVolume").classList.remove("fa-volume-low")
        document.getElementById("iconVolume").classList.remove("fa-volume-xmark")
    }
    if(audio.volume === 0)
    {
        document.getElementById("iconVolume").classList.add("fa-volume-xmark")
        document.getElementById("iconVolume").classList.remove("fa-volume-low")
        document.getElementById("iconVolume").classList.remove("fa-volume-high")
    }
}




//funkcja zmieniajaca tryb aplikacji (jasny/ciemny)
let lightMode = false;
function mode(){
    lightMode = lightMode ? false : true;
    document.body.classList.toggle("light")     
    for (let index = 0; index < document.getElementsByClassName("item").length; index++)
        document.getElementsByClassName("item")[index].classList.toggle("lightclickable")

    document.getElementById("bellow").classList.toggle("lightitem")
    document.getElementById("browsefile").classList.toggle("lightitem")
    document.getElementById("add").classList.toggle("lightitem")
}

//funkcja dodajaca wlasna muzyke do obiektu tracks
function addMusic(){
    let file = document.getElementById("inputTag").files[0]
    let blobURL = URL.createObjectURL(file);
    data.track.push({
        id: ++id,
        name: document.getElementById("titl").value,
        author: document.getElementById("auth").value,
        thumbnail: '',
        path: blobURL
    })
    document.getElementById("browsefile").style.display = "none";
    document.getElementById("inputTag").value = "";
    document.getElementById("auth").value = "";
    document.getElementById("titl").value = "";
    
}

//funkcja generująca kafelki
function generateData(){
    document.getElementById("holder").innerHTML = ""
    data.track.forEach(track =>{
        let item = document.createElement("div");
        let h = document.createElement('h2');
        h.innerText = track.name;
        item.classList.add('item');
        if(lightMode)
        {
         item.classList.add('lightitem')   
        }
        item.innerText = track.author;
        item.append(h);
        document.getElementById("holder").append(item);
    })        
}


//funkcja zmienia aktualny moment piosenki na miejsce klikniecia
function change(){
    audio.currentTime = document.getElementById("duration").value;
}

//funkcja zmienia status petli odtwarzania (wlaczona/wylaczona)
let isloop = false;
function loop(){
    isloop = isloop ? false : true;
}

//funkcja dodaje obsluge klikniecia na kady kafelek
function addEventListeners(){
    for (let index = 0; index < document.getElementsByClassName("item").length; index++) {
            document.getElementsByClassName("item")[index].addEventListener("click", () => {
            document.title = data.track[index].author + " - " + data.track[index].name;
            
            if(typeof audio == 'object')
                audio.pause();
            document.getElementById("bottom").style.display = "block";
            document.getElementById("artist").innerText = data.track[index].author
            document.getElementById("title").innerText = data.track[index].name
            document.getElementById("image").style.backgroundImage = data.track[index].thumbnail;
            audio = new Audio(data.track[index].path)
            audio.play();
            isPaused = audio.paused ? true : false;
            pause();
            audio.onloadedmetadata = () => {
            setInterval(() => {
                ysa = audio.currentTime
                document.getElementById("duration").setAttribute("max", parseInt(audio.duration))
                document.getElementById("duration").value = ysa
                if(isloop && audio.currentTime == audio.duration)
                {
                    audio.currentTime = 0;
                    audio.play();
                }        
            },500);
            }
        })
    }
}
