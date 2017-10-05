window.onload = function() {
    var urlParams = {};
    location.search.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) {
            urlParams[$1] = $3;
        }
    );

    if (Object.keys(urlParams).indexOf("word") !== -1) {
        preserveURL = true;
        document.getElementById("word").value = urlParams.word;
        getPhonemes();
        if (Object.keys(urlParams).indexOf("autoplay") !== -1 && urlParams.autoplay) {
            readPhonemes();
        }
    }
}

function loadAudio() {
    window.phonemeSamples = {};

    phonemeSamples.AA = new Audio('phonemes/AA.mp3');
    phonemeSamples.AE = new Audio('phonemes/AE.mp3');
    phonemeSamples.AH = new Audio('phonemes/AH.mp3');
    phonemeSamples.AO = new Audio('phonemes/AO.mp3');
    phonemeSamples.AW = new Audio('phonemes/AW.mp3');
    phonemeSamples.AY = new Audio('phonemes/AY.mp3');
    phonemeSamples.B = new Audio('phonemes/B.mp3');
    phonemeSamples.C = new Audio('phonemes/C.mp3');
    phonemeSamples.CH = new Audio('phonemes/CH.mp3');
    phonemeSamples.D = new Audio('phonemes/D.mp3');
    phonemeSamples.DH = new Audio('phonemes/DH.mp3');
    phonemeSamples.EH = new Audio('phonemes/EH.mp3');
    phonemeSamples.ER = new Audio('phonemes/ER.mp3');
    phonemeSamples.EY = new Audio('phonemes/EY.mp3');
    phonemeSamples.F = new Audio('phonemes/F.mp3');
    phonemeSamples.G = new Audio('phonemes/G.mp3');
    phonemeSamples.HH = new Audio('phonemes/HH.mp3');
    phonemeSamples.IH = new Audio('phonemes/IH.mp3');
    phonemeSamples.IY = new Audio('phonemes/IY.mp3');
    phonemeSamples.JH = new Audio('phonemes/JH.mp3');
    phonemeSamples.K = new Audio('phonemes/K.mp3');
    phonemeSamples.L = new Audio('phonemes/L.mp3');
    phonemeSamples.M = new Audio('phonemes/M.mp3');
    phonemeSamples.N = new Audio('phonemes/N.mp3');
    phonemeSamples.NG = new Audio('phonemes/NG.mp3');
    phonemeSamples.OW = new Audio('phonemes/OW.mp3');
    phonemeSamples.OY = new Audio('phonemes/OY.mp3');
    phonemeSamples.P = new Audio('phonemes/P.mp3');
    phonemeSamples.R = new Audio('phonemes/R.mp3');
    phonemeSamples.S = new Audio('phonemes/S.mp3');
    phonemeSamples.SH = new Audio('phonemes/SH.mp3');
    phonemeSamples.T = new Audio('phonemes/T.mp3');
    phonemeSamples.TH = new Audio('phonemes/TH.mp3');
    phonemeSamples.UH = new Audio('phonemes/UH.mp3');
    phonemeSamples.UW = new Audio('phonemes/UW.mp3');
    phonemeSamples.V = new Audio('phonemes/V.mp3');
    phonemeSamples.W = new Audio('phonemes/W.mp3');
    phonemeSamples.Y = new Audio('phonemes/Y.mp3');
    phonemeSamples.Z = new Audio('phonemes/Z.mp3');
    phonemeSamples.ZH = new Audio('phonemes/ZH.mp3');

    Object.keys(phonemeSamples).forEach(function(key) {
        phonemeSamples[key].onended = playNextPhoneme;
    });
}

loadAudio();

var pronounceButtonDisabled = true;
var readButtonDisabled = true;
var preserveURL = false;

function updateButton() {
    if (pronounceButtonDisabled) {
        pronounceButtonDisabled = false;
        document.getElementById("pronounceButton").className = "fakeInput noselect";
        document.getElementById("pronounceButton").style.cursor = "pointer";
    }
    if (document.getElementById("word").value === "") {
        pronounceButtonDisabled = true;
        document.getElementById("pronounceButton").className = "fakeInput noselect disabled";
        document.getElementById("pronounceButton").style.cursor = "auto";
    }
}

function oneWord(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    return (charCode > 96 && charCode < 123);
}

function getPhonemes() {
    if (!preserveURL) {
        window.history.replaceState(null, null, '?word=' + document.getElementById("word").value);
    }
    preserveURL = false;
    document.getElementById("word").value = document.getElementById("word").value.replace(/[^a-z]/gi, '').toLowerCase();

    word = document.getElementById("word").value;
    if (readButtonDisabled) {
        readButtonDisabled = false;
        document.getElementById("readButton").className = "fakeInput noselect";
        document.getElementById("readButton").style.cursor = "pointer";
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.datamuse.com/words?sp=" + word + "&md=r", false);
    xhr.send();

    if (xhr.response !== "[]" && (JSON.parse(xhr.response)[0].word === word)) {
        initPhonemes(JSON.parse(xhr.response)[0].tags[0].substring(5));
    } else {
        initPhonemes(convert(word));
        document.getElementById("pronunciation").innerHTML += "?"
    }
}

function readPhonemes() {
    i = 0;
    playNextPhoneme();
}

function playNextPhoneme() {
    if (i < phonemeList.length) {
        phonemeSamples[phonemeList[i]].play();
        document.getElementsByClassName("phonemeParts")[i].style.color = "#FF4081";
    }
    if (i > 0) {
        document.getElementsByClassName("phonemeParts")[i - 1].style.color = "rgb(84, 84, 84)";
    }
    i++;
}

function initPhonemes(phonemeString) {
    phonemeList = phonemeString.trim().replace(/[^a-z ]/gi, '').replace(/ /g, '-').replace(/(-)\1/g, '-').split("-");
    output = "";
    for (var i = 0; i < phonemeList.length; i++) {
        output += "<span class='phonemeParts'>" + phonemeList[i] + "</span>"
        if (i < phonemeList.length - 1) {
            output += "-";
        }
    }
    document.getElementById("pronunciation").innerHTML = output;
}