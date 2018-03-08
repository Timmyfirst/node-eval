
function start() {
  var decompte = 3;
  var timer = setInterval(function( ){
     console.log(decompte)
     decompte--;
     if (decompte === 0) {
        clearInterval(timer);
        window.location.href = '/end';
     }
  }, 1000);

}
