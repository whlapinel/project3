"use strict";

const submitBtn = document.querySelector('button[type="submit"]');
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



submitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  if (document.querySelector("form").reportValidity()) {
    submitPost();
  }
});

async function submitPost() {
    const id = await getNextID();
    const post = createPost(id);
    await sendPost(post);
}

async function getNextID() {
  // get posts, map to array of property 'id'
  const posts = await getPosts();
  const postIDs = await posts.map((post) => post.id);
  let nextID = Math.max(...postIDs) + 1;
  return nextID;

  async function getPosts() {
    let url = `http://localhost:3000/posts`;
    try {
      const response = await fetch(url);
      const posts = await response.json();
      return posts;
    } catch (err) {
      console.log(err.message);    
      notifyError(err);
      console.log("ah crap.");
    }
  }
}

async function sendPost(post) {
  const response = await fetch("http://localhost:3000/posts");
  try {
    const response = await fetch("http://localhost:3000/posts", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(post)
    });
    const result = await response.json();
    console.log("Success:", result);
    location.assign('./index.html');
  } catch (error) {
    console.log(error.message);
    console.log("ah crap.");
  }
}

function createPost(id) {
  const title = document.getElementById("title").value;
  document.getElementById("title").value = "";
  const author = document.getElementById("author").value;
  document.getElementById("author").value = "";
  const date = new Date().toString();
  const profile = "images/default.jpeg";
  const content = document.getElementById("content").value;
  document.getElementById("content").value = "";
  const post = {
    id,
    title,
    author,
    date,
    profile,
    content
  };
  return post;
}
