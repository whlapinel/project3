"use strict";

// event listener for articles-wrapper
// document.querySelector(".close-btn").addEventListener("click", hideModal);

const id = 1; // FIXME needs to assign value based on URL query
const notificationBar = document.querySelector('.notification');
const notificationContainer =document.querySelector('.notification-container');
const notificationCloseBtn = document.querySelector('button.close');

notificationContainer.addEventListener('click', (event) => {
    if (event.target.closest('button.close') !== null) {
        event.currentTarget.classList.add('hidden');
    }
});

function notifyError(err) {
    notificationContainer.classList.remove('hidden');
    notificationBar.textContent = err.message;
}


displayDetails();

async function displayDetails() {
  const post = await getPostObject();
  createModal(post);
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

function createModal(post) {
  // create modal elements
  // grab article-wrapper element
  const articleWrapper = document.querySelector(".wrapper");

  // create modal title h2 and append to article wrapper
  const modalArticleTitle = document.createElement("h2");
  articleWrapper.appendChild(modalArticleTitle);

  // create modal article-header div
  const modalArticleHeader = document.createElement("div");
  modalArticleHeader.classList.add("article-header");
  articleWrapper.appendChild(modalArticleHeader);

  // create img element avatar, assign post.profile, and append to article header
  const modalAvatar = document.createElement("img");
  modalAvatar.classList.add("avatar");
  modalAvatar.setAttribute("alt", "profile picture");
  modalArticleHeader.appendChild(modalAvatar);

  // create author date div, assign post.author and post.date, and append to article header
  const modalAuthorDate = document.createElement("div");
  modalArticleHeader.appendChild(modalAuthorDate);

  const btnContainer = createBtnContainer(post);
  modalArticleHeader.appendChild(btnContainer);

  function createBtnContainer(post) {
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");
    const editBtn = document.createElement("a");
    editBtn.href = `./edit.html?id=${post.id}`;
    editBtn.classList.add("btn");
    editBtn.classList.add("edit-btn");
    btnContainer.appendChild(editBtn);
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid");
    editIcon.classList.add("fa-pen");
    editBtn.appendChild(editIcon);
    const delBtn = document.createElement("button");
    delBtn.classList.add("btn");
    delBtn.classList.add("del-btn");
    delBtn.dataset.id = post.id;
    delBtn.addEventListener("click", deletePost);
    btnContainer.appendChild(delBtn);
    const delIcon = document.createElement("i");
    delIcon.classList.add("fa-solid");
    delIcon.classList.add("fa-trash-can");
    delBtn.appendChild(delIcon);
    return btnContainer;
  }

  // create article body p element, assign post.content
  const modalArticleBody = document.createElement("p");
  articleWrapper.appendChild(modalArticleBody);

  modalArticleTitle.textContent = post.title;
  modalAvatar.src = post.profile;
  modalAuthorDate.textContent = `${post.author} · 
        ${new Date(Date.parse(post.date)).toDateString()}`;
  modalArticleBody.textContent = post.content;
}

async function deletePost(event) {
  const id = event.currentTarget.dataset.id;
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
    location.assign("./index.html");
  } catch (err) {
    console.log(err.message);
    console.log("ah crap.");
  }
}
