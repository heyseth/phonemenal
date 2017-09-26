function loadAudio() {
    AA = new Audio('phonemes/AA.mp3');
    AA.onended = playNextPhoneme;

    AE = new Audio('phonemes/AE.mp3');
    AE.onended = playNextPhoneme;

    AH = new Audio('phonemes/AH.mp3');
    AH.onended = playNextPhoneme;

    AO = new Audio('phonemes/AO.mp3');
    AO.onended = playNextPhoneme;

    AW = new Audio('phonemes/AW.mp3');
    AW.onended = playNextPhoneme;

    AY = new Audio('phonemes/AY.mp3');
    AY.onended = playNextPhoneme;

    B = new Audio('phonemes/B.mp3');
    B.onended = playNextPhoneme;

    C = new Audio('phonemes/C.mp3');
    C.onended = playNextPhoneme;

    CH = new Audio('phonemes/CH.mp3');
    CH.onended = playNextPhoneme;

    D = new Audio('phonemes/D.mp3');
    D.onended = playNextPhoneme;

    DH = new Audio('phonemes/DH.mp3');
    DH.onended = playNextPhoneme;

    EH = new Audio('phonemes/EH.mp3');
    EH.onended = playNextPhoneme;

    ER = new Audio('phonemes/ER.mp3');
    ER.onended = playNextPhoneme;

    EY = new Audio('phonemes/EY.mp3');
    EY.onended = playNextPhoneme;

    F = new Audio('phonemes/F.mp3');
    F.onended = playNextPhoneme;

    G = new Audio('phonemes/G.mp3');
    G.onended = playNextPhoneme;

    HH = new Audio('phonemes/HH.mp3');
    HH.onended = playNextPhoneme;

    IH = new Audio('phonemes/IH.mp3');
    IH.onended = playNextPhoneme;

    IY = new Audio('phonemes/IY.mp3');
    IY.onended = playNextPhoneme;

    JH = new Audio('phonemes/JH.mp3');
    JH.onended = playNextPhoneme;

    K = new Audio('phonemes/K.mp3');
    K.onended = playNextPhoneme;

    L = new Audio('phonemes/L.mp3');
    L.onended = playNextPhoneme;

    M = new Audio('phonemes/M.mp3');
    M.onended = playNextPhoneme;

    N = new Audio('phonemes/N.mp3');
    N.onended = playNextPhoneme;

    NG = new Audio('phonemes/NG.mp3');
    NG.onended = playNextPhoneme;

    OW = new Audio('phonemes/OW.mp3');
    OW.onended = playNextPhoneme;

    OY = new Audio('phonemes/OY.mp3');
    OY.onended = playNextPhoneme;

    P = new Audio('phonemes/P.mp3');
    P.onended = playNextPhoneme;

    R = new Audio('phonemes/R.mp3');
    R.onended = playNextPhoneme;

    S = new Audio('phonemes/S.mp3');
    S.onended = playNextPhoneme;

    SH = new Audio('phonemes/SH.mp3');
    SH.onended = playNextPhoneme;

    T = new Audio('phonemes/T.mp3');
    T.onended = playNextPhoneme;

    TH = new Audio('phonemes/TH.mp3');
    TH.onended = playNextPhoneme;

    UH = new Audio('phonemes/UH.mp3');
    UH.onended = playNextPhoneme;

    UW = new Audio('phonemes/UW.mp3');
    UW.onended = playNextPhoneme;

    V = new Audio('phonemes/V.mp3');
    V.onended = playNextPhoneme;

    W = new Audio('phonemes/W.mp3');
    W.onended = playNextPhoneme;

    Y = new Audio('phonemes/Y.mp3');
    Y.onended = playNextPhoneme;

    Z = new Audio('phonemes/Z.mp3');
    Z.onended = playNextPhoneme;

    ZH = new Audio('phonemes/ZH.mp3');
    ZH.onended = playNextPhoneme;
}

loadAudio();

var pronounceButtonDisabled = true;
var readButtonDisabled = true;

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
        window[phonemeList[i]].play();
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