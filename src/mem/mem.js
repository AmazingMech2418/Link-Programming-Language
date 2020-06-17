mem_local = new String();
window.devKey = "test";
window.chars = "`1234567890-=qwertyuiop[]\\asdfghjkl;'\nzxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>? ";
function genCharset() {
  var chars_list = window.chars.split('');
  window.charset = "";
  while (window.charset.length < chars_list.length) {
    var index = Math.floor(Math.random() * chars_list.length);
    window.charset = window.charset + chars_list[index];
    chars_list[index] = '';
  }
}
// Saves memory data using Vigenere cipher and custom character set

function saveMem(winObj) {
  genCharset();
  var _mem = JSON.stringify(winObj);
  var mem_local = _mem/*"";
  for (var i = 0; i < _mem.length; i++) {
    if (window.charset.indexOf(_mem[i]) != -1) {
      mem_local = mem_local + window.charset[(window.charset.indexOf(_mem[i]) + window.charset.indexOf(window.devKey[i % window.devKey.length])) % window.charset.length];
      //console.log(window.charset[(window.charset.indexOf(_mem[i])+window.charset.indexOf(window.devKey[i%window.devKey.length]))%window.charset.length]);
      //console.log(mem_local[i]);
    }
  }*/
  return mem_local;
}

function loadMem(memData) {
  var _mem = memData;
  var mem_local = _mem/*"";
  for (i in _mem) {
    if (window.charset.indexOf(_mem[i]) != -1) {
      mem_local = mem_local + window.charset[(window.charset.indexOf(_mem[i]) - window.charset.indexOf(window.devKey[i % window.devKey.length]) + window.charset.length) % window.charset.length];
      //console.log(mem_local[i]);
    }
  }*/
  //console.log(mem_local);
  mem_local = JSON.parse(mem_local);
  return mem_local;
}