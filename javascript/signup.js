// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAuKFPymNnGYcBwCzbDvLiky_jEx21IHi8",
  authDomain: "southeatslogin.firebaseapp.com",
  projectId: "southeatslogin",
  storageBucket: "southeatslogin.appspot.com",
  messagingSenderId: "582873503422",
  appId: "1:582873503422:web:69f4d628e0769bc4a4f0ef"
};

firebase.initializeApp(firebaseConfig);

// Initialize Firebase Auth and Database
const auth = firebase.auth();
const database = firebase.database();

function register() {
  // Get all inputs
  var newemail = document.getElementById('newemail').value;
  var setpassword = document.getElementById('setpassword').value;
  var setpostal = document.getElementById('setpostal').value;
  var setstreet = document.getElementById('setstreet').value;
  var setblock = document.getElementById('setblock').value;
  var setunit = document.getElementById('setunit').value;
  var setphonenumber = document.getElementById('setnumber').value;
  var setname = document.getElementById('setname').value;

  // Validate input fields
  if (!validate_newemail(newemail) || !validate_newpassword(setpassword)) {
    alert('Email or password is not valid');
    return; // Don't continue running code if validation fails
  }
  if (!validate_setpostal(setpostal) || !validate_setstreet(setstreet) || 
      !validate_setblock(setblock) || !validate_setunit(setunit) || 
      !validate_setnumber(setphonenumber) || !validate_setname(setname)) {
    alert('One or more fields have not been entered correctly');
    return; // Don't continue running code if validation fails
  }

  // Move on with Auth
  auth.createUserWithEmailAndPassword(newemail, setpassword)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser;

      // Add this user to Firebase Database
      var database_ref = database.ref();

      // Create User Data
      var user_data = {
        newemail: newemail,
        setpostal: setpostal,
        setstreet: setstreet,
        setblock: setblock,
        setunit: setunit,
        setphonenumber: setphonenumber,
        setname: setname,
        last_login: Date.now()
      };

      database_ref.child('users/' + user.uid).set(user_data);

      // Redirect to index.html after successful signup
      window.location.href = 'index.html';
    })
    .catch(function(error) {
      // Firebase will use this to alert its errors
      var error_message = error.message;
      alert(error_message);
    });
}

function validate_newemail(newemail) {
  var expression = /^[^@]+@\w+(\.\w+)+\w$/;
  // Email is good
  return expression.test(newemail);
}

function validate_newpassword(newpassword) {
  return newpassword.length >= 6;
}

function validate_setpostal(setpostal) {
  // Postal code should be exactly 6 digits
  return /^\d{6}$/.test(setpostal);
}

function validate_setstreet(setstreet) {
  // Street should not be empty
  return setstreet.trim() !== '';
}

function validate_setblock(setblock) {
  // Block should be exactly 4 digits
  return /^\d{4}$/.test(setblock);
}

function validate_setunit(setunit) {
  // Unit should not be empty
  return setunit.trim() !== '';
}

function validate_setnumber(setphonenumber) {
  // Phone number should be exactly 8 digits
  return /^\d{8}$/.test(setphonenumber);
}

function validate_setname(setname) {
  // Name should not be empty
  return setname.trim() !== '';
}
