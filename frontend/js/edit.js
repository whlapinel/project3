"use strict";

const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");
const submitBtn = document.querySelector('button[type="submit"]');
const notificationBar = document.querySelector(".notification");
const notificationContainer = document.querySelector(".notification-container");
const notificationCloseBtn = document.querySelector("button.close");
let revisedContent;
let revisedTitle;

notificationContainer.addEventListener("click", (event) => {
  if (event.target.closest("button.close") !== null) {
    event.currentTarget.classList.add("hidden");
  }
});

function notifyError(err) {
  notificationContainer.classList.remove("hidden");
  notificationBar.textContent = err.message;
}

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (document.querySelector("form").reportValidity()) {
    sendRevisedPost(revisedTitle, revisedContent);
  }
});

titleInput.addEventListener("input", (event) => {
  event.preventDefault();
  revisedTitle = titleInput.value;
});

contentInput.addEventListener("input", (event) => {
  event.preventDefault();
  revisedContent = contentInput.value;
});

displayEditForm();

async function displayEditForm() {
  const post = await getPostObject();
  populateForm(post);
}

async function getPostObject() {
  let url = `http://localhost:3000/posts${window.location.search}`;
  try {
    const response = await fetch(url);
    const json = await response.json();
    const post = json[0];
    return post;
  } catch (err) {
    console.log(err.message);
    notifyError(err);
  }
}

function populateForm(post) {
  titleInput.setAttribute("value", post.title);
  contentInput.textContent = post.content;
}

async function sendRevisedPost(revisedTitle, revisedContent) {
  let post = await getPostObject();
  post.title = revisedTitle;
  post.content = revisedContent;
  post.date = new Date().toString();
  await sendPost(post);
  location.assign("./index.html");

  async function deletePost(post) {
    const id = post.id;
    const url = `http://localhost:3000/posts/${id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log(response);
      const result = await response.json();
      console.log("Success:", result);
    } catch (err) {
      console.log(err.message);
      console.log("ah crap.");
    }
  }

  async function sendPost(post) {
    try {
      const response = await fetch(`http://localhost:3000/posts/${post.id}`, {
        method: "PUT", // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(post)
      });
      const result = await response.json();
      console.log("Success:", result);
      //   location.assign("./index.html");
    } catch (error) {
      console.log(error.message);
      console.log("ah crap.");
    }
  }
}
