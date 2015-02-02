var toggleSignUpPage = function(){
  var e = document.getElementById('signUpPage');
  var k = document.getElementById('logInPage');
  k.style.display = 'none';
  if(e.style.display == 'block'){
    e.style.display = 'none';
  } else {
    e.style.display = 'block';
  }
}

var toggleLogInPage = function(){
  var e = document.getElementById('logInPage');
  if(e.style.display == 'block'){
    e.style.display = 'none';
  } else {
    e.style.display = 'block';
  }
}

// var goHome = function(){
//   redirectTo: '/'
// };
// var userPostItem = function(){
//   alert('Post Item!!!')
// }

// var userLogOut = function(){
//   alert('Loging Out User')
// }

// var expertAcceptRequest = function(){
//   alert('Request Accepted!')
// }

// var expertLogOut = function(){
//   alert('Loging Out Expert')
// }

