import { initializeApp } from "firebase/app";

import {
  getDocs,
  addDoc,
  updateDoc,
  getFirestore,
  collection,
  doc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC" + "xOxV--X-Sx-yxnak0V0" + "3hTrqzUmupl5I",
  authDomain: "autofill-59946.firebaseapp.com",
  projectId: "autofill-59946",
  storageBucket: "autofill-5994" + "6.appspot.com",
  messagingSenderId: "9081361" + "21251",
  appId: "1:908136121251:web:98971af11" + "3c1a5759f9016",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

//colref
const colRef = collection(db, "users");

//get collection data

async function getAllUsers() {
  try {
    const snapshot = await getDocs(colRef);
    const users = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    //console.log(users, "returning users");
    return users;
  } catch (error) {
    //console.log(error);
    document.querySelector(
      "#users"
    ).innerHTML = `<div class="container text-center">
    <div class="spinner-border text-center text-success" role="status">
    <span class="sr-only">Loading...</span>
  </div>
  </div>
  `;
  }
}

async function getApprovedUsers() {
  const users = await getAllUsers();
  //console.log(users);
  if (!users) return;
  return users.filter((user) => user.approved);
}

async function getPendingUsers() {
  const users = await getAllUsers();
  //console.log("users", users);
  return users.filter((user) => !user.approved);
}

////console.log("pending", getPendingUsers());
const newUser = {
  name: "John Doe",
  ip: Math.random().toString(36).substring(7),
  mpesaCode: "123456",
  approved: Math.random() < 0.5,
  trialEnded: false,
};
//addUser(newUser);
// Add new user to Firestore
export function addUser(user) {
  addDoc(colRef, user)
    .then((docRef) => {
      //console.log("New user added with ID: ", docRef.id);
      return true;
    })
    .catch((error) => {
      console.error("Error adding user: ", error);
      return false;
    });
}

async function showApproved(button) {
  button.disabled = true;
  button.innerHTML = "Revoke";

  document.querySelector(
    "#users"
  ).innerHTML = `<div class="container text-center">
  <div class="spinner-border text-center text-success" role="status">
  <span class="sr-only">Loading...</span>
</div>
</div>
`;
  const approvedUsers = await getApprovedUsers();

  //console.log("approvedUsers", approvedUsers);
  let usersLists = "";
  approvedUsers.forEach((user) => {
    const userLi = `<li class="list-group-item">
    <div class="form-check">
      <input value="${user.id}" class="form-check-input" type="checkbox" id="${user.ip}" />
      <label
        class="ml-3 form-check-label d-flex justify-content-between"
        for="${user.ip}"
      >
        <span>${user.name}</span>
        <span>${user.mpesaCode}</span>
      </label>
    </div>
  </li>`;
    usersLists += userLi;
  });
  document.querySelector("#users").innerHTML = usersLists;
  button.disabled = false;
  if (usersLists === "") {
    document.querySelector("#users").innerHTML =
      " <p class='text-primary text-center'>No approved users!</p>";
    button.disabled = true;
  }
}

async function showPending(button) {
  button.disabled = true;
  button.innerHTML = "Approve";

  document.querySelector(
    "#users"
  ).innerHTML = `<div class="container text-center">
  <div class="spinner-border text-center text-success" role="status">
  <span class="sr-only">Loading...</span>
</div>
</div>
`;

  const pendingUsers = await getPendingUsers();

  //console.log("pendingUsers", pendingUsers);
  let usersLists = "";
  pendingUsers.forEach((user) => {
    const userLi = `<li class="list-group-item">
    <div class="form-check">
      <input value="${user.id}" class="form-check-input" type="checkbox" id="${user.ip}" />
      <label
        class="ml-3 form-check-label d-flex justify-content-between"
        for="${user.ip}"
      >
        <span>${user.name}</span>
        <span>${user.mpesaCode}</span>
      </label>
    </div>
  </li>`;
    usersLists += userLi;
  });
  document.querySelector("#users").innerHTML = usersLists;
  button.disabled = false;
  if (usersLists === "") {
    document.querySelector("#users").innerHTML =
      " <p class='text-primary text-center'>No pending users!</p>";
  }
}

async function showAll(button) {
  button.disabled = true;
  button.innerHTML = "...";

  document.querySelector(
    "#users"
  ).innerHTML = `<div class="container text-center">
  <div class="spinner-border text-center text-success" role="status">
  <span class="sr-only">Loading...</span>
</div>
</div>
`;
  const allUsers = await getAllUsers();

  //console.log("allUsers", allUsers);
  let usersLists = "";
  allUsers.forEach((user) => {
    //console.log(user);
    const userLi = `<li class="list-group-item">
    <div class="form-check">
      <input value="${user.id}" class="form-check-input" type="checkbox" id="${user.ip}" />
      <label
        class="ml-3 form-check-label d-flex justify-content-between"
        for="${user.ip}}"
      >
        <span>${user.name}</span>
        <span>${user.mpesaCode}</span>
      </label>
    </div>
  </li>`;
    usersLists += userLi;
  });
  document.querySelector("#users").innerHTML = usersLists;
  if (usersLists === "") {
    document.querySelector("#users").innerHTML =
      " <p class='text-primary text-center'>No users found!</p>";
  }
}

const dropdown = document.querySelector("select.form-control");
//console.log("dropdown", dropdown);
const approveButton = document.querySelector("button.btn-success");
showPending(approveButton);
dropdown.addEventListener("change", function (event) {
  //console.log(event.target.value);
  const value = event.target.value;
  if (value === "all") {
    showAll(approveButton);
  } else if (value === "pending") {
    showPending(approveButton);
  } else if (value === "approved") {
    showApproved(approveButton);
  }
});

function approveUsers() {
  const checkedUsers = document.querySelectorAll("input:checked");
  //console.log(checkedUsers);
  checkedUsers.forEach((user) => {
    //console.log(user.value);
    updateUser(user.value, { approved: true });
  });
  showPending(approveButton);
}

function revokeUsers() {
  const checkedUsers = document.querySelectorAll("input:checked");
  //console.log(checkedUsers);
  checkedUsers.forEach((user) => {
    //console.log(user.value);
    updateUser(user.value, { approved: false });
  });
  showApproved(approveButton);
}

approveButton.addEventListener("click", function (event) {
  //console.log(event.target.innerHTML);
  const value = event.target.innerHTML;
  if (value === "Approve") {
    approveUsers();
  } else if (value === "Revoke") {
    revokeUsers();
  }
});

function updateUser(id, data) {
  updateDoc(doc(db, "users", id), data)
    .then(() => {
      console.log("Document updated!");
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
}
