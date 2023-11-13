"use strict";

const MAX_LENGTH = 50; //maximum length of the blog content shown on the page, i.e., if the blog content is longer, truncate it.
const PAGE_LIMIT = 12; //number of blogs per page
const filterVal = "";
const articlesWrapper = document.querySelector(".articles-wrapper");
const paginationContainer = document.querySelector(".pagination-container");
let searchKey = "";
let currentPage = 1;
const posts = getPosts();

articlesWrapper.addEventListener("click", displayDetails);
paginationContainer.addEventListener("click", switchPage);

const notificationBar = document.querySelector(".notification");
const notificationContainer = document.querySelector(".notification-container");
const notificationCloseBtn = document.querySelector("button.close");
notificationContainer.addEventListener("click", (event) => {
  console.log(event.target);
  if (event.target.closest("button.close") !== null) {
    event.currentTarget.classList.add("hidden");
  }
});
function notifyError(err) {
  notificationContainer.classList.remove("hidden");
  notificationBar.textContent = err.message;
}

const searchInput = document.querySelector('input[type="search"]');
console.log(searchInput);
searchInput.addEventListener("change", filterPosts);

async function filterPosts() {
  currentPage = 1;
  searchKey = searchInput.value;
  await getPosts();
}

function displayDetails(e) {
  const selectedCard = e.target.closest(".card");
  // verify user clicked on descendant element of card
  if (selectedCard !== null) {
    location.assign(`./details.html?id=${selectedCard.dataset.id}`);
  }
}

async function getPosts() {
  console.log(
    `getting posts... searchKey: ${searchKey}; currentPage: ${currentPage}`
  );
  while (paginationContainer.hasChildNodes()) {
    paginationContainer.removeChild(paginationContainer.firstChild);
    console.log(`removing child nodes from pagination container`);
  }
  while (articlesWrapper.hasChildNodes()) {
    articlesWrapper.removeChild(articlesWrapper.firstChild);
    console.log(`removing child nodes from articles wrapper container`);
  }
  let url;
  try {
    if (searchKey !== "") {
      console.log(`search key is not empty string`);
      url = `http://localhost:3000/posts?q=${searchKey}&_page=${currentPage}&_limit=${PAGE_LIMIT}&_sort=date&_order=desc`;
    } else {
      console.log(`search key is empty string`);
      url = `http://localhost:3000/posts?_page=${currentPage}&_limit=${PAGE_LIMIT}&_sort=date&_order=desc`;
    }
    const posts = await fetch(url);
    const totalPosts = posts.headers.get("x-total-count");
    console.log(totalPosts);
    console.log(`creating pagination buttons...`);
    for (let page = 1; page < totalPosts / PAGE_LIMIT + 1; ++page) {
      const pageBtn = document.createElement("button");
      pageBtn.classList.add("page-btn");
      console.log(`page: ${page}; currentPage: ${currentPage}.`);
      if (page === Number(currentPage)) {
        console.log(`making page: ${page} active`);
        pageBtn.classList.add("active");
      }
      pageBtn.textContent = page;
      paginationContainer.appendChild(pageBtn);
    }
    const json = await posts.json();
    console.log(json);
    json.forEach((post) => {
      const card = createCard(post);
      articlesWrapper.appendChild(card);
    });
  } catch (err) {
    console.log(err.message);
    notifyError(err);
    console.log("ah crap.");
  }
}

async function switchPage(e) {
  const clickedBtn = e.target.closest(".page-btn");
  console.log(clickedBtn);
  if (clickedBtn !== null) {
    currentPage = Number(e.target.textContent);
  }
  await getPosts();
}
function createCard(post) {
  const card = createCardElement(post);
  const cardHeader = createCardHeader();
  card.appendChild(cardHeader);
  const avatar = createAvatar(post);
  cardHeader.appendChild(avatar);
  const authorDate = createAuthorDate(post);
  cardHeader.appendChild(authorDate);
  const cardBody = createCardBody();
  card.appendChild(cardBody);
  const titleHeader = createTitleHeader(post);
  cardBody.appendChild(titleHeader);
  const content = createContentElement(post);
  cardBody.appendChild(content);
  return card;
  
  function createCardElement(post) {
    const card = document.createElement("article");
    card.classList.add("card");
    card.setAttribute("data-id", post.id);
    return card;
  }
  function createCardHeader() {
    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");
    return cardHeader;
  }
  function createAvatar(post) {
    const avatar = document.createElement("img");
    avatar.srcset = post.profile;
    avatar.setAttribute("alt", "profile picture");
    avatar.classList.add("avatar");
    return avatar;
  }
  function createAuthorDate(post) {
    const authorDate = document.createElement("div");
    authorDate.textContent = `${post.author} · ${new Date(
      Date.parse(post.date)
    ).toDateString()}`;
    return authorDate;
  }
  function createCardBody() {
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    return cardBody;
  }
  function createTitleHeader(post) {
    const titleHeader = document.createElement("h3");
    titleHeader.textContent = post.title;
    return titleHeader;
  }
  function createContentElement(post) {
    const content = document.createElement("p");
    if (post.content.length > MAX_LENGTH) {
      content.textContent = `${post.content.substring(0, MAX_LENGTH)}...`;
    } else {
      content.textContent = post.content;
    }
    return content;
  }
}
