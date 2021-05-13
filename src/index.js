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


//HEADER 
function createHeader() {
    let headerEl = document.createElement(`header`)
    headerEl.setAttribute("class", "main-header")
    // headerEl.classList.add(`main-header`)
    
    let wrapperEl = document.createElement(`div`)
    wrapperEl.setAttribute("class", "header wrapper")
    // wrapperEl.classList.add(`wrapper`)

    headerEl.append(wrapperEl)
    rootEl.append(headerEl) //rootEl is in the HTML file
}

//MAIN 
function createMain() {
    let mainEl = document.createElement("main")
    mainEl.setAttribute("class", "wrapper")
    // mainEl.classList.add(`wrapper`) - this didn't work

    let createPostSection = document.createElement("section")
    createPostSection.setAttribute("class", "create-post-section")
    // postSectionEl.classList.add(`create-post-section`) - this didn't work

    //FORM
// function createPostForm() {
    let newPostForm = document.createElement("form")
    newPostForm.getAttribute("id", "create-post-form")
    newPostForm.getAttribute("autocomplete", "off")
    newPostForm.addEventListener("submit", function(e) { 
      e.preventDefault()
      fetch(`http://localhost:3000/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "title": titleInput.value,
          "content": textareaEl.value,
          "image": {
            "src": imgInput.value,
          } //image
        }) //body
      }) //fetch
      .then(function(response) {
        if (response.ok) {
          let postImgEl = document.createElement("div")
          postImgEl.setAttribute("class", "post--image")

          let imgEl = document.createElement("img")
          imgEl.setAttribute("src", post.image.src)
          imgEl.setAttribute("alt", post.image.alt)

          postImgEl.append(imgEl)

          // POST CONTENT SECTION
          let postContentEl = document.createElement("div")
          postContentEl.setAttribute("class", "post--content")

          let h2El = document.createElement("h2")
          h2El.innerText = post.title

          let pEl = document.createElement("p")
          pEl.innerText = post.content

          postContentEl.append(h2El, pEl)

          formEl.reset()
        } //if response.ok
      }) //.then
   })
    
    let createPosth2 = document.createElement("h2")
    createPosth2.innerText = "Create a post"
    //img
    let imgLabel = document.createElement("label")
    imgLabel.getAttribute("for", "image")
    imgLabel.innerText = "Image"
    
    let imgInput = document.createElement("input")
    imgInput.getAttribute("id", "image")
    imgInput.getAttribute("name", "image")
    imgInput.getAttribute("type", "text")
    //title
    let postTitleLabel = document.createElement("label")
    postTitleLabel.getAttribute("for", "title")
    postTitleLabel.innerText = "Title"
    
    let titleInput = document.createElement("input")
    titleInput.getAttribute("id", "title")
    titleInput.getAttribute("name", "title")
    titleInput.getAttribute("type", "text")
    //content
    let textareaLabel = document.createElement(`label`)
    textareaLabel.getAttribute(`for`, `content`)
    textareaLabel.innerText = "Content"

    let textareaEl = document.createElement(`textarea`)
    textareaEl.getAttribute(`id`, `content`)
    textareaEl.getAttribute(`name`, `content`)
    textareaEl.getAttribute(`rows`, `2`)
    textareaEl.getAttribute(`columns`, `30`)
    //action btn
    let actionBtnDiv = document.createElement(`div`)
    actionBtnDiv.getAttribute(`class`, `action-btns`)
    
    let previewBtn = document.createElement(`button`)
    previewBtn.getAttribute(`id`, `preview-btn`)
    previewBtn.getAttribute(`type`, `button`)
    previewBtn.innerText = "Preview"
    
    let submitBtn = document.createElement(`button`)
    submitBtn.getAttribute(`type`, `submit`)
    submitBtn.innerText = "Post"
    
   

    // createPostForm()
    actionBtnDiv.append(previewBtn, submitBtn)
    newPostForm.append(
      createPosth2, 
      imgLabel, 
      imgInput, 
      postTitleLabel, 
      titleInput, 
      textareaLabel, 
      textareaEl, 
      actionBtnDiv
      )
    createPostSection.append(newPostForm)
    
    const feedSectionEl = createFeedSection()
    
    // u[ here at .append createPostLabel missing
    mainEl.append(createPostSection, feedSectionEl)
    rootEl.append(mainEl)
  }

//create Feeds inside MAIN
function createFeedSection() {
  let feedSectionEl = document.createElement("section")
  feedSectionEl.setAttribute("class", "feed")

  let ulEl = document.createElement("ul")
  ulEl.setAttribute("class", "stack")

  //fetch GET
    fetch("http://localhost:3000/posts")
    .then(function (response) {
      return response.json()  //posts from json are transformed into obj-js
    })
    .then(function (posts) {
      for (const post of posts) { 
        let liEl = createPost(post) 
        ulEl.append(liEl)        
      }
    })
    
  feedSectionEl.append(ulEl)     //here bc it now has the posts
  
  return feedSectionEl          // return feedSectionEl to access it later
}

//CREATE ONE POST
function createPost(post) {
  let liEl = document.createElement("li")
  liEl.setAttribute("class", "post")

  console.log("users:", users)

  let user = users.find(function (user) {
    return user.id === post.userId
  })

  let chipEl = createUserChip(user)

  //IMAGE SECTION
  let postImgEl = document.createElement("div")
  postImgEl.setAttribute("class", "post--image")

  let imgEl = document.createElement("img")
  imgEl.setAttribute("src", post.image.src)
  imgEl.setAttribute("alt", post.image.alt)

  postImgEl.append(imgEl)

  // POST CONTENT SECTION
  let postContentEl = document.createElement("div")
  postContentEl.setAttribute("class", "post--content")

  let h2El = document.createElement("h2")
  h2El.innerText = post.title

  let pEl = document.createElement("p")
  pEl.innerText = post.content

  postContentEl.append(h2El, pEl)

  // POST COMMENTS SECTION
  let postCommentsEl = document.createElement("div")
  postCommentsEl.setAttribute("class", "post--comments")

  let h3El = document.createElement("h3")
  h3El.innerText = "Comments"

  postCommentsEl.append(h3El)
  
  //single comment starts here - with for loop
  for (let comment of post.comments) {
    let user = users.find(function (user) {  //reviewed w/ Nico and MDN
    return user.id === comment.userId
  })

  let commentEl = document.createElement("div")
  commentEl.setAttribute("class", "post--comment")

  let avatarEl = document.createElement("div")
  avatarEl.setAttribute("class", "avatar-small")

  let commentImgEl = document.createElement("img")
  commentImgEl.setAttribute("src", user.avatar)
  commentImgEl.setAttribute("alt", user.username)

  avatarEl.append(commentImgEl)

  let commentTextEl = document.createElement("p")
  commentTextEl.innerText = comment.content

  commentEl.append(avatarEl, commentTextEl)
  postCommentsEl.append(commentEl)
  //single comment ends here
}

// CREATE COMMENT FORM SECTION
  let formEl = document.createElement("form")
  formEl.setAttribute("id", "create-comment-form")
  formEl.setAttribute("autocomplete", "off")

  let commentLabelEl = document.createElement("label")
  commentLabelEl.setAttribute("for", "comment")
  commentLabelEl.innerText = "Add comment"

  let commentInputEl = document.createElement("input")
  commentInputEl.setAttribute("id", "comment")
  commentInputEl.setAttribute("name", "comment")
  commentInputEl.setAttribute("type", "text")

  let submitBtn = document.createElement("button")
  submitBtn.setAttribute("type", "submit")
  submitBtn.innerText = "Comment"

  formEl.append(commentLabelEl, commentInputEl, submitBtn)

  liEl.append(chipEl, postImgEl, postContentEl, postCommentsEl, formEl)

  return liEl
}

//
function createUserChip(user) {
  let chipEl = document.createElement("div")
  chipEl.setAttribute("class", "chip")

  let avatarEl = document.createElement("div")
  avatarEl.setAttribute("class", "avatar-small")

  let imgEl = document.createElement("img")
  imgEl.setAttribute("src", user.avatar)
  imgEl.setAttribute("alt", user.username)

  avatarEl.append(imgEl)

  let nameEl = document.createElement("span")
  nameEl.innerText = user.username

  chipEl.append(avatarEl, nameEl)

  return chipEl
}

function createUserChips(users) {
  for (let user of users) {
    let chipEl = createUserChip(user)
    let wrapperEl = document.querySelector(".header.wrapper")
    wrapperEl.append(chipEl)
  }
}

function getUsers() {
  fetch("http://localhost:3000/users")
    .then(function (response) {
      return response.json()
    })
    .then(function (usersFromServer) {
      users = usersFromServer
      createUserChips(users)
    })
}

createHeader()
getUsers()
createMain()
