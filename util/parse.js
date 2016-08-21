function checkLogRegex(str) {
    var re1 = '((?:http|https)(?::\\/{2}[\\w]+)(?:[\\/|\\.]?)(?:[^\\s"]*))'; // HTTP URL 1
    var re2 = '(\\s+)'; // White Space 1
    var re3 = '(\\d+)'; // Integer Number 1
    var re4 = '(\\s+)'; // White Space 2
    var re5 = '(\\d+)'; // Integer Number 2

    var p = new RegExp(re1 + re2 + re3 + re4 + re5, ["i"]);
    var m = p.exec(str);
    if (m != null) {
        return true;
    }
}