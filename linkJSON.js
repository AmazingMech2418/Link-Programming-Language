function require(url) {
  var rtrn;
  try {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          rtrn = xhr.responseText;
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);
  } catch {
    try {
      var worker = new Worker("webworker.js");
      worker.onmessage = function (event) {
        rtrn = event.data;
      };

      worker.postMessage(url);
    } catch {
      rtrn = "error";


    }

  }
  return rtrn;
}
/*
The Link language is extremely secure.
You can block function definitions to prevent override or the creation of malicious functions.
You can block requests or restrict requests to certain URLs to prevent XSS.
Using the Link Secure Memory System (LSMS), you can block variables from being edited, making them constant.
LSMS can also allow you to restrict memory management to a specific scope. 
*/

console.log("Welcome to Link, a fast, high-level programming language with low-level programming!")
let link = new Object();
link.language = { functions: { def: { code: "(function(params,mem){console.log(mem[0].getVar('deflock'));if(!(mem[0].getVar('deflock'))){mem[0].setObjPath('functions.'+params[0],{code:params[1]});} else {console.error(new Error('Cannot define function with deflock'))}})" }, require: { code: "(function(params,mem){if(!(mem[0].getVar('reqlock'))||mem[0].getVar('allow').indexOf(params[0])!=-1){let module = link.read(require(params[0])); link._readLinkBlock('start',module.program,mem);} else {console.error(new Error('Request blocked'));}})" } } };
link.read = function (code) {
  let program = JSON.parse(code);
  console.log('Compiling Link program...');
  var compiled = new Object();
  for (let i = 0; i < program.length; i++) {
    compiled[program[i].name] = program[i];
    //console.log(compiled);
  }
  let p = new Object();
  link.language = { functions: { def: { code: "(function(params,mem){console.log(mem[0].getVar('deflock'));if(!(mem[0].getVar('deflock'))){mem[0].setObjPath('functions.'+params[0],{code:params[1]});} else {console.error(new Error('Cannot define function with deflock'))}})" }, require: { code: "(function(params,mem){if(!(mem[0].getVar('reqlock'))||mem[0].getVar('allow').indexOf(params[0])!=-1){let module = link.read(require(params[0])); link._readLinkBlock('start',module.program,mem);} else {console.error(new Error('Request blocked'));}})" } } };
  p.program = compiled;
  p.languagemem = new memvm(link.language);
  p.languagemem.setVar('deflock', false);
  p.languagemem.setVar('reqlock', false);
  p.languagemem.setVar('allow', []);
  p.start = function () { link.language = { functions: { def: { code: "(function(params,mem){console.log(mem[0].getVar('deflock'));if(!(mem[0].getVar('deflock'))){mem[0].setObjPath('functions.'+params[0],{code:params[1]});} else {console.error(new Error('Cannot define function with deflock'))}})" }, require: { code: "(function(params,mem){if(!(mem[0].getVar('reqlock'))||mem[0].getVar('allow').indexOf(params[0])!=-1){let module = link.read(require(params[0])); link._readLinkBlock('start',module.program,mem);} else {console.error(new Error('Request blocked'));}})" } } };link._readLinkBlock('start', this.program, [this.languagemem]) };
  return p;
};

link._readLinkBlock = function (block, program, scopesmem) {
  console.log(block);
  let blk = program[block];
  let scopes = scopesmem;
  let scope;
  let rtrn;
  if ('func' in blk && blk.func == 'switch') {
    for (var i in blk.inputs) {
      let refscopes = scopes;
      refscopes.push(new memvm({}));
      if (blk.inputs[i] == "else") {
        rtrn = link._readLinkBlock(blk.outputs[i], program, scopes);
        break;
      } else {
        if (link._readLinkBlock(blk.inputs[i], program, refscopes)) {
          rtrn = link._readLinkBlock(blk.outputs[i], program, scopes);
          break;
        }
      }
    }
  } else {
    if (blk.scope == 'end') {
      scopes.pop();
    } else if (blk.scope == 'new') {
      scopes.push(new memvm({}));
    }
    scope = scopes[scopes.length - 1];
    //console.log(scopes);
    if ('func' in blk) {
      let func = scopesmem[0].getObjPath('functions.' + blk.func);
      let _p = blk.params;
      let p = [];

      for (let i in _p) {
        if (typeof (_p[i]) == 'object') {
          if ("ref" in _p[i]) {
            let refscopes = scopes;
            refscopes.push(new memvm({}));
            p[i] = link._readLinkBlock(_p[i].ref, program, refscopes);
          } else { p[i] = _p[i] }
        } else { p[i] = _p[i] }
      }
      //console.log(p);
      rtrn = eval(func.code)(p, scopesmem);
    }
  }
  if (blk.next != 'end') {
    return link._readLinkBlock(blk.next, program, scopes);
  } else {
    return rtrn;
  }

};