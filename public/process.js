
function start() {
  var decompte = 3;
  var timer = setInterval(function( ){
     console.log(decompte)
     if (decompte === 0) {
        clearInterval(timer);
        window.location.href = '/end';
     }
     decompte--;
  }, 1000);

}
