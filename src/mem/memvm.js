/*function memvm(mem) {
  let _mem = {}
  for (attr in mem) {
    _mem[attr] = { lock: true, content: mem[attr] };
  }
  let mem_storage = saveMem(_mem);
  console.log(mem_storage);
  this.setVar = function (_var, val, lock = false) {
    //console.log(mem_storage);

    //if (!(_mem_storage[_var]["lock"])) {
    var _mem_storage = loadMem(mem_storage);
    if (Object.entries(_mem_storage).length != 0) {
      if (_var in _mem_storage) {
        if (_mem_storage[_var].lock) {
          console.error(new Error("Cannot set locked variable"));
          return undefined;
        }
        //console.log("passed through 2")
      }
      //console.log("pased through 1")
    } else { }
_mem_storage[_var] = { lock: lock, content: val };
mem_storage = saveMem(_mem_storage);
//}
}
this.getVar = function (_var) {
let variable = loadMem(mem_storage)[_var];
//if(!variable.lock) {
return variable.content;
//}
}
  this.setObjPath = function (path, val) {
    var _mem_storage = loadMem(mem_storage);
    var _path = path.split('.');
    var currentPath = val

    for (var i = _path.length - 1; i >= 0; i--) {
      var obj = _mem_storage;
      for (var j = 0; j < i; j++) {

        if (typeof (obj[_path[j]]) != 'object') {
          obj[_path[j]] = new Object();
          console.warn(new Error("A variable in the path is not an object and was converted to one, removing all original data."))
        }

        obj = obj[_path[j]];
      }


      obj[_path[i]] = currentPath;
      currentPath = obj;
    }


    mem_storage = saveMem(_mem_storage);
  }

  this.getObjPath = function (path) {
    var _mem_storage = loadMem(mem_storage);
    var _path = path.split('.');
    var obj = _mem_storage;

    for (var j = 0; j < _path.length; j++) {
      obj = obj[_path[j]];
    }

    return obj;
    //mem_storage = saveMem(_mem_storage);
  }


}*/



function memvm(mem) {
  let mem_storage = saveMem(mem);
  let locked_paths = [];
  this.setVar = function (_var, val, locked) {
    if(locked_paths.indexOf(_var)!=-1) {
      console.error(new Error("Variable locked"));
      return undefined;
    }
    var _mem_storage = loadMem(mem_storage);
    _mem_storage[_var] = val;
    mem_storage = saveMem(_mem_storage);
    if(locked) {
      locked_paths.push(_var);
    }
  }
  this.getVar = function (_var) {
    return loadMem(mem_storage)[_var];
  }
  this.setObjPath = function (path, val) {
    var _mem_storage = loadMem(mem_storage);
    var _path = path.split('.');
    var currentPath = val

    for (var i = _path.length - 1; i >= 0; i--) {
      var obj = _mem_storage;
      for (var j = 0; j < i; j++) {

        if (typeof (obj[_path[j]]) != 'object') {
          obj[_path[j]] = new Object();
          console.warn(new Error("A variable in the path is not an object and was converted to one, removing all original data."))
        }

        obj = obj[_path[j]];
      }


      obj[_path[i]] = currentPath;
      currentPath = obj;
    }


    mem_storage = saveMem(_mem_storage);
  }

  this.getObjPath = function (path) {
    var _mem_storage = loadMem(mem_storage);
    var _path = path.split('.');
    var obj = _mem_storage;

    for (var j = 0; j < _path.length; j++) {
      obj = obj[_path[j]];
    }

    return obj;
    //mem_storage = saveMem(_mem_storage);
  }

}

