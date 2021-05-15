// repo:boolean-uk-instagram
// Ignore the preview feature in the example, we've replaced that feature with an adding likes feature instead (this is not shown in any of the templates so you'll have to add the HTML and style it as you see fit).

// Deliverables
// - A user can select the user they want to post or comment as
// - From the create a post section, a user can:
//     - Enter a post's image URL
//     - Enter a post's title
//     - Enter a post's content
//     - Create a post and view it in the feed
// - From the feed section, a user can:
//     - View a post and the owner of the post
//     - View a posts' comments and the owner of the comments
//     - Add a comment to a post
//   - Add a like to a post

// Instructions
// - DONE -Download the .zip file from https://codesandbox.io/s/js-instagram-exercise-starter-template-6vfoj
// - DONE -Run your json-server with json-server --watch db/db.json --routes db/routes.json --static .; notice --static . this is an alternative to using Live Server, you'll be able to view your app on http://localhost:3000/
// - DONE -Create a fetch function to get data
// - i/p  -Create render functions to show data
// - Use event listeners and fetch to create and update data on the server

// Tips
// - In this exercise focus on practicing Javascript and fetch requests, take your time.
// - Keep track of the currentUser in a global variable so that you have access to their id in all your functions.
// - Think about conditional rendering when creating the preview feature.

//FETCH (GET) data from SERVER


let rootEl = document.querySelector(`#root`)
console.log(`rootEl:`, rootEl)

//global variables
let currentUser  // - Keep track of the currentUser in a global variable so that you have access to their id in all your functions.
let posts = []
let users = []



fetchUsers().then(function(fetchedUsers) {
  users = fetchedUsers //here I have the users in js-data (obj)
  fetchPosts().then(function(fetchedPosts) {
    posts = fetchedPosts //here I have the posts in js-data (obj)
    //at this point I have both users and posts available
    createHeader()
    createUserChipsAndAppendToWrapper()
    createMain()
  })
})

function fetchUsers() {
  return fetch("http://localhost:3000/users") //get users as json-data from server
  .then(function (response) {
    return response.json() //trasform json-data into js-data (obj)
  })
}

function fetchPosts() {
  return fetch("http://localhost:3000/posts")
  .then(function(response) {
    return response.json()
  })
}

//this f is a creates and appends
function createHeader() { 
  const headerEl = document.createElement("header");
  headerEl.setAttribute("class", "main-header");

  const headerWrapper = document.createElement("div");
  headerWrapper.setAttribute("class", "header wrapper");

  headerEl.append(headerWrapper);
  rootEl.append(headerEl);
}

//this f creates and append
//needs f createFeedSection
function createMain() {
  const mainEl = document.createElement("main");
  mainEl.setAttribute("class", "wrapper");

  const postSectionEl = createNewPost()
  const feedSectionEl = createFeedSection();

  mainEl.append(postSectionEl, feedSectionEl);
  rootEl.append(mainEl);
}

//input chip img 
//action create a form for a new post
//action post it in the Feed Section
//output
function createNewPost() {
  const postSectionEl = document.createElement("section");
  postSectionEl.setAttribute("class", "create-post-section");

  const createPostForm = document.createElement("form")
  createPostForm.setAttribute("id", "create-post-form")
  createPostForm.setAttribute("autocomplete", "off")
  const formTitle = document.createElement("h2")
  formTitle.innerText = "Create a post"
  //IMAGE NEW POST
  const ImgLabel = document.createElement("label")
  ImgLabel.setAttribute("for", "image")
  ImgLabel.innerText = "Image"
  const ImgInput = document.createElement("input")
  ImgInput.setAttribute("id", "image")
  ImgInput.setAttribute("name", "image")
  ImgInput.setAttribute("type", "text")
  // TITLE NEW POST
  const titleLabel = document.createElement("label")
  titleLabel.setAttribute("for", "title")
  titleLabel.innerText = "Title"
  const titleInput = document.createElement("input")
  titleInput.setAttribute("id", "title")
  titleInput.setAttribute("name", "title")
  titleInput.setAttribute("type", "text")
  //CONTENT NEW POST
  const contentLabel = document.createElement("label")
  contentLabel.setAttribute("for", "content")
  contentLabel.innerText = "Content"
  const contentTextarea = document.createElement("textarea")
  contentTextarea.setAttribute("id", "content")
  contentTextarea.setAttribute("name", "content")
  contentTextarea.setAttribute("rows", "2")
  contentTextarea.setAttribute("columns", "30")
  //ACTION BUTTONS
  const actionBtnsDiv = document.createElement("div")
  actionBtnsDiv.setAttribute("class", "action-btns")
  const previewBtn = document.createElement("button")
  previewBtn.setAttribute("id", "preview-btn")
  previewBtn.setAttribute("type", "button")
  previewBtn.innerText = "Preview"
  const submitBtn = document.createElement("button")
  submitBtn.setAttribute("type", "submit")
  submitBtn.innerText = "Post"


  postSectionEl.append(createPostForm)
  createPostForm.append(
    formTitle, 
    ImgLabel,
    ImgInput,
    titleLabel,
    titleInput,
    contentTextarea,
    actionBtnsDiv)
  actionBtnsDiv.append(previewBtn, submitBtn)

  return postSectionEl
}

//this f creates using data from the server
//needs: fetch to work with posts from server, f createPost
//returns the Feed Section
function createFeedSection() {
  const feedSectionEl = document.createElement("section");
  feedSectionEl.setAttribute("class", "feed");

  const ulEl = document.createElement("ul"); //the li of the ul are the actual post the you see on the page
  ulEl.setAttribute("class", "stack");

  for (const post of posts) { //is getting the posts from above (scope)
    // create a post element
    const postLiEl = createPost(post); //creating the element li for each post
    ulEl.append(postLiEl);
  }

  feedSectionEl.append(ulEl);
  return feedSectionEl;
}

//this f creates and append one comment getting data from users from above (scope)
//returns the comment element 
function createComment(comment) {
  const user = users.find(function (user) {
    return user.id === comment.userId;
  });

  const commentEl = document.createElement("div");
  commentEl.setAttribute("class", "post--comment");

  const avatarEl = document.createElement("div");
  avatarEl.setAttribute("class", "avatar-small");

  const commentImgEl = document.createElement("img");
  commentImgEl.setAttribute("src", user.avatar);
  commentImgEl.setAttribute("alt", user.username);

  avatarEl.append(commentImgEl);

  const commentTextEl = document.createElement("p");
  commentTextEl.innerText = comment.content;

  commentEl.append(avatarEl, commentTextEl);

  return commentEl;
}

//this f creates and appends
//needs users from above(scope) + f createUserChip 
function createPost(post) {  //can get the post data from above(scope)
  const liEl = document.createElement("li");
  liEl.setAttribute("class", "post");

  const user = users.find(function (user) {
    return user.id === post.userId;
  });

  const chipEl = createUserChip(user);

  // POST IMAGE SECTION
  const postImgEl = document.createElement("div");
  postImgEl.setAttribute("class", "post--image");

  const imgEl = document.createElement("img");
  imgEl.setAttribute("src", post.image.src);
  imgEl.setAttribute("alt", post.image.alt);

  postImgEl.append(imgEl);

  // POST CONTENT SECTION
  const postContentEl = document.createElement("div");
  postContentEl.setAttribute("class", "post--content");

  const h2El = document.createElement("h2");
  h2El.innerText = post.title;

  const pEl = document.createElement("p");
  pEl.innerText = post.content;

  postContentEl.append(h2El, pEl);

  // POST COMMENTS SECTION
  const postCommentsEl = document.createElement("div");
  postCommentsEl.setAttribute("class", "post--comments");

  const h3El = document.createElement("h3");
  h3El.innerText = "Comments";

  postCommentsEl.append(h3El);

  for (const comment of post.comments) {
    const commentEl = createComment(comment);
    postCommentsEl.append(commentEl);
  }
// CREATE COMMENT FORM SECTION
const formEl = document.createElement("form");
formEl.setAttribute("id", "create-comment-form");
formEl.setAttribute("autocomplete", "off");

const commentLabelEl = document.createElement("label");
commentLabelEl.setAttribute("for", "comment");
commentLabelEl.innerText = "Add comment";

const commentInputEl = document.createElement("input");
commentInputEl.setAttribute("id", "comment");
commentInputEl.setAttribute("name", "comment");
commentInputEl.setAttribute("type", "text");

const submitBtn = document.createElement("button");
submitBtn.setAttribute("type", "submit");
submitBtn.innerText = "Comment";

formEl.append(commentLabelEl, commentInputEl, submitBtn);

// Add a comment:

// - listen to post's comment form
formEl.addEventListener("submit", function (event) {
  // - prevent the form from refreshing the page
  event.preventDefault();

  // if there's an active user
  if (currentUser !== null) {
    // - get and store comment data
    const comment = {
      content: formEl.comment.value,
      userId: currentUser.id,
      postId: post.id
    };

    // - send that data to the server
    // Method: POST
    // URL: http://localhost:3000/comments
    // Body: comment
    fetch("http://localhost:3000/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(comment)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (newCommentFromServer) {
        // - display the comment on the page
        // - find the user this comment belongs to
        // - create and append the comment
        const commentEl = createCommentElement(newCommentFromServer);
        postCommentsEl.append(commentEl);
        formEl.reset();
      });
  } else {
    // no user is active...
    alert("Please select a user first");
  }
});

liEl.append(chipEl, postImgEl, postContentEl, postCommentsEl, formEl);

return liEl;
}

//this f creates a single user chip - it goes in the header and in the post
//return the chip element
function createUserChip(user) {
  const chipEl = document.createElement("div");
  chipEl.setAttribute("class", "chip");

  const avatarEl = document.createElement("div");
  avatarEl.setAttribute("class", "avatar-small");

  const imgEl = document.createElement("img");
  imgEl.setAttribute("src", user.avatar);
  imgEl.setAttribute("alt", user.username);

  avatarEl.append(imgEl);

  const nameEl = document.createElement("span");
  nameEl.innerText = user.username;

  chipEl.append(avatarEl, nameEl);

  return chipEl;
}

//this f creates and append
//needs f createUserChip + users from above (scope)
function createUserChipsAndAppendToWrapper() {
  for (const user of users) {
    const chipEl = createUserChip(user);

    chipEl.addEventListener("click", function () {
      currentUser = user;

      const currentChipEl = document.querySelector(".active");
      if (currentChipEl !== null) {
        currentChipEl.classList.remove("active");
      }

      chipEl.classList.add("active");
    });

    const wrapperEl = document.querySelector(".header.wrapper");
    wrapperEl.append(chipEl);
  }
}
