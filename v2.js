var rowSplit = '\n';
var colSplit = ';';
    
(function (){
    "use strict";
    const prefix = '_sync_';
    document.querySelectorAll('[data-sync]').forEach(function(e){
        var e = e;
        e.value = localStorage.getItem(prefix + e.id) || '';
        e.addEventListener('keyup', function(){
            localStorage.setItem(prefix + e.id, e.value);
        });
    })
})();

(function (){
    "use strict";
    var parseNotation = function(s){
        var s = s.replace(/([A-Z])([A-Z]+)([a-z]?)/g, function(match,p1,p2,p3){
            return p1 + p2.toLowerCase() + p3.toUpperCase();
        });
        return s.split(/(?=[A-Z])|[_\-\ ]/).map(s => s.toLowerCase());
    }
    var ucFirst = function(s){
        return s.substring(0, 1).toUpperCase() + s.substring(1) ;
    }

    var modifiers = {
        ucf: s => ucFirst(s),
        lcc: s => parseNotation(s).map((s,i) => (i ? ucFirst(s) : s)).join(''),
        ucc: s => parseNotation(s).map(s => ucFirst(s)).join(''),
        sep: s => parseNotation(s).map(s => ucFirst(s)).join(' '),
        hyp: s => parseNotation(s).join('-'),
        usc: s => parseNotation(s).join('_'),
        rgx: s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    };

    var process = function(){
        var template = document.querySelector('#template').value;
        var elements = document.querySelector('#elements').value.trim().split(rowSplit);
        var out = "";
        elements.forEach(function(element){
            var subElements = element.split(colSplit);
            var ctemplate = template;
            ctemplate = ctemplate.replace(/\{\{(\d+)((\s*\|\s*(\w+))*)\}\}/gi, function(match,p1,p2){
                var modifier = p2.split('|');
                var out = (subElements[parseInt(p1)] || '').trim();
                modifier.forEach(function(m){
                    var m = m.trim();
                    if(!m.length) return;
                    out = modifiers[m] ? modifiers[m](out) : out;
                });
                return out;
            });
            out += ctemplate;		
        });
        output.innerText = out;
    }
    var timer = setTimeout(process,0);
    document.querySelectorAll('textarea').forEach(function(e){e.addEventListener('keyup', function(){
        clearTimeout(timer);
        timer = setTimeout(process,333);
    });});
})();



