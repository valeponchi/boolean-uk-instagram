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
let currentUser = null  // - Keep track of the currentUser in a global variable so that you have access to their id in all your functions.
let posts = []
let users = []

// input: none
// action: get users from server
// output: Promise<users>
// dependencies: none
function fetchUsers() {
  //method: GET
  return fetch("http://localhost:3000/users") //get users as json-data from server
  .then(function (response) {
    return response.json() //trasform json-data into js-data (obj)
  })
}

// input: nothing
// action: getPostsFromServer
// output: Promise<posts array>
function fetchPosts() {
  return fetch("http://localhost:3000/posts")
  .then(function(response) {
    return response.json()
  })
}

fetchUsers().then(function(fetchedUsers) {
  users = fetchedUsers //here I have the users in js-data (obj)
  fetchPosts().then(function(fetchedPosts) {
    posts = fetchedPosts //here I have the posts in js-data (obj)
    //at this point I have both users and posts available so I can create:
    createHeader()
    createUserChipsAndAppendToWrapper()
    createMain()
  })
})



 // <<<<<<<<<<<<<<<<<  HEADER >>>>>>>>>>> SINGLE USER CHIP >>>>>>>>>>>>> SINGLE USER CHIP & APPEND IT TO HEADER <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// input: nothing
// action: *CREATES the header section, *APPENDS it to the page
// output: undefined
// dependencies: none
function createHeader() { 
  const headerEl = document.createElement("header");
  headerEl.setAttribute("class", "main-header");

  const headerWrapper = document.createElement("div");
  headerWrapper.setAttribute("class", "header wrapper");

  headerEl.append(headerWrapper);
  rootEl.append(headerEl);
}


//WHERE used it? - createHeader and createPost
// input: user <------- PARAMETER -----------
// action: *CREATES a user chip
// output: the chip element
// dependencies: none
function createUserChip(user) { // PARAMETER
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

// input: nothing
// action: *CREATES multiple chips & *APPENDS them to the wrapperEl in header
// output: undefined
// dependencies: createUserChip, users 
function createUserChipsAndAppendToWrapper() {
  //for loop just to create each user Chip, accessing var Users
  for (const user of users) { 
    const chipEl = createUserChip(user);  //<<--PASSING ARGUMENT TO THE f <<-- access from var `users` @beginning of the page
    
    //EVENT LISTENER ---> CLICK USER <---
    chipEl.addEventListener("click", function () {  // (1)when you click one chip (that now has its user-data, the currentUser becomes the User)
      currentUser = user;

      const currentChipEl = document.querySelector(".active"); //(2) query .active, if a user already has it (it is not null), then remove the .active class to the user that already has the class
      if (currentChipEl !== null) {
        currentChipEl.classList.remove("active");
      }

      chipEl.classList.add("active"); // (3)and give the class .active to the `clicked` user
    });

    const wrapperEl = document.querySelector(".header.wrapper"); // you can access the header-wrapper because that f is called before this one. Now you can append it to `wrapper`
    wrapperEl.append(chipEl);
  }
}


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  MAIN  <<<<<<<<<<<<<<<  CREATE NEW POST <<<<<<<<<< PREVIEW GOES HERE <<<<<<<<<<<< FEED
// input: nothing
// action: *CREATES the main section, *APPENDS it to the page
// output: undefined
// dependencies: createFeedSection
function createMain() {
  const mainEl = document.createElement("main");
  mainEl.setAttribute("class", "wrapper");

  const postSectionEl = createNewPostSection()
  //createPreview() //create previewSection <-- now you can querySelect the section where to append it <--it's created in the above f()
  const feedSectionEl = createFeedSection();

  mainEl.append(postSectionEl, feedSectionEl);
  rootEl.append(mainEl);
}

//input chip img 
//action *CREATES a form for a new post
//output newPostSectionEl
function createNewPostSection() {
  const newPostSectionEl = document.createElement("section");
  newPostSectionEl.setAttribute("class", "create-post-section");

  const createPostForm = document.createElement("form")
  createPostForm.setAttribute("id", "create-post-form")
  createPostForm.setAttribute("autocomplete", "off")
  const formTitle = document.createElement("h2")
  formTitle.innerText = "Create a post"
  //IMAGE NEW POST
  const imgLabel = document.createElement("label")
  imgLabel.setAttribute("for", "image")
  imgLabel.innerText = "Image"
  const imgInput = document.createElement("input")
  imgInput.setAttribute("id", "image")
  imgInput.setAttribute("name", "image")
  imgInput.setAttribute("type", "url") //I changed the type to URL
  imgInput.setAttribute("required", true);

  // TITLE NEW POST
  const titleLabel = document.createElement("label")
  titleLabel.setAttribute("for", "title")
  titleLabel.innerText = "Title"
  const titleInput = document.createElement("input")
  titleInput.setAttribute("id", "title")
  titleInput.setAttribute("name", "title")
  titleInput.setAttribute("type", "text")
  titleInput.setAttribute("required", true);
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

  //here goes the return of the preview-loading-state-card
  newPostSectionEl.append(createPostForm) //HERE I APPEND THE PREVIEW
  createPostForm.append(
    formTitle, 
    imgLabel,
    imgInput,
    titleLabel,
    titleInput,
    contentLabel,
    contentTextarea,
    actionBtnsDiv)
  actionBtnsDiv.append(previewBtn, submitBtn)

  return newPostSectionEl
} // createNewPostAndPreview function

//crea il preview post con i dati inventati qui sotto
//input nothing
//action create a preview image from data of new Post
//output the preview post
function createPreview() {
  let sectionToAppend = document.querySelector(".create-post-section")//this section is the same where you find newPostSection
  console.log(sectionToAppend)
  let newPost = {
    title: "A tree in blossom",
    content: "Spring is finally here... I just love the colours.",
    image: {
    src: "https://images.unsplash.com/photo-1616745309504-0cb79e9ae590?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDI0fDZzTVZqVExTa2VRfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    alt: "a tree in blossom"
    }
  }
  let previewPost = createPost(newPost)
  console.log(previewPost)
  sectionToAppend.append(previewPost)
  // return previewPost
}

//NEW FUNCTION create Preview!! ***
// function createPreview() {
//   let postSection = document.querySelector(".create-post-section")
//   const previewDiv = document.createElement("div");
//   previewDiv.setAttribute("class", "post");

//   const user = users.find(function (user) {
//     return user.id === post.userId;
//   });

//   const chipEl = createUserChip(user);

//   // POST IMAGE SECTION
//   const postImgEl = document.createElement("div");
//   postImgEl.setAttribute("class", "post--image");

//   const imgEl = document.createElement("img");
//   imgEl.setAttribute("src", post.image.src);
//   imgEl.setAttribute("alt", post.image.alt);

//   postImgEl.append(imgEl);

//   // POST CONTENT SECTION
//   const postContentEl = document.createElement("div");
//   postContentEl.setAttribute("class", "post--content");

//   const h2El = document.createElement("h2");
//   h2El.innerText = post.title;

//   const pEl = document.createElement("p");
//   pEl.innerText = post.content;

//   postContentEl.append(h2El, pEl);

//   postSection.append(chipEl, postImgEl, postContentEl);

//   return previewDiv;
// }

//this f creates using data from the server
// input: nothing
// action: creates the feed section with info from server
// output: feed section element
// dependencies: fetch, createPost, posts


// input: nothing
// action: creates the feed section with info from server
// output: feed section element
// dependencies: fetch, createPost, posts
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
// input: comment
// action: create a comment element
// output: comment element 
function createComment(comment) {
  //one comment
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
// input: post
// action: creates a post
// output: get the liEl back
// dependencies: createUserChip, users (from above (SCOPE)) 
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




