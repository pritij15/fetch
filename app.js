let cl = console.log;

const  postsContainer = document.getElementById("postsContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const loader = document.getElementById("loader");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

let baseUrl = `https://crud-posts-557f2-default-rtdb.asia-southeast1.firebasedatabase.app`;

let postUrl = `${baseUrl}/posts.json`

let createUrl = (id) =>{
    return `${baseUrl}/posts/${id}.json`;
}

const objToArr = (nestedObj) =>{
    let postArr = [];
    for(const key in nestedObj){
        let obj = nestedObj[key];
        obj.id = key;
        postArr.push(obj)
    }
    return postArr;
}

const onEdit = (ele) =>{
    cl(ele) 
    let editId = ele.closest(".card").id;
    //cl(editId)
    localStorage.setItem("editId", editId);
    //let editUrl = `${baseUrl}/posts/${editId}.json`;
    let editUrl = createUrl(editId)

    let confiObj = {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'Accept' : 'application/json',
            //'Authorization' : 'Bearer Token LocalStorage'

        }

    }
    fetch(editUrl, confiObj)
    .then(res =>{
        cl(res)
        return res.json()
    })
    .then(data =>{
        cl(data)
        updateBtn.classList.remove("d-none");
        submitBtn.classList.add("d-none");
        titleControl.value = data.title;
        bodyControl.value = data.body;
        userIdControl.value = data.userId;
    })
    .catch(err =>{
        cl(err)
    })

}
const createPostCards = (post) =>{
    let card = document.createElement("div");
        card.className = "card mb-4";
        card.id = post.id;
        card.innerHTML = `
                            <div class="card-header">
                                <h2 class="m-0">
                                    ${post.title}
                                </h2>

                            </div>
                            <div class="card-body">
                                <p class="m-0">
                                    ${post.body}
                                </p>

                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button class="btn btn-primary" type="button" onClick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger" type="button" onClick="onDelete(this)">Delete</button>
                            </div>
                                 `
    postsContainer.append(card)                             

}

const onDelete = (ele) =>{
    cl(ele)
    let deleteId = ele.closest(".card").id;
    let deleteUrl = `${baseUrl}/posts/${deleteId}.json`;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });  


    fetch(deleteUrl, {
        method : "DELETE",
        headers : {
            'content-type' : 'application/json',
            'Accept' : 'application/json',
            //'Authorization' : 'Bearer Token LocalStorage'
            }
         })
    .then(res =>{
        return res.json()
    })
    .then(res =>{
        cl(res)
        let deleteCard = document.getElementById(deleteId)
        deleteCard.remove()
    })
    .catch(err =>{
        cl(err)
    })

}
const templatingOfCards = (arr) =>{
    postsContainer.innerHTML = ``;
    arr.forEach(post =>{
        createPostCards(post)

    })
}

fetch(postUrl)
 .then(res =>{
    cl(res)
   return res.json()

 })
.then(data =>{
    cl(data) 
    let postArr = objToArr(data)
    templatingOfCards(postArr)
    Swal.fire({
        title: "Good job!",
        text: "All posts are fetched successfully!",
        icon: "success"
      });

})
.catch(err => cl(err))

const onPostSubmit = (eve)=>{
    eve.preventDefault();
    let newPost = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value

    }
    cl(newPost);

    fetch(postUrl, {
        method : "POST",
        body : JSON.stringify(newPost),
         headers : {
             'content-type' : 'application/json',
             'Accept' : 'application/json',
             //'Authorization' : 'Bearer Token LocalStorage'

         }
    })
    .then(res =>{
       return res.json()
    })
    .then(data =>{
        cl(data)
        newPost.id = data.name;
       createPostCards(newPost)
       Swal.fire({
        title: "Good job!",
        text: "New post is created successfully!",
        icon: "success"
      });

    })
    .catch(err =>{
        cl(err)
    })
    .finally(() =>{
        eve.target.reset()
        //postForm.reset()
    })
}

const onPostUpdate = () =>{
    let updateId = localStorage.getItem("editId")
    let updatedObj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value
    }
    cl(updatedObj)

    //let updateUrl = `${baseUrl}/posts/${updateId}.json`;
    let updateUrl = createUrl(updateId);
    fetch(updateUrl,{
        method : "PATCH",
        body : JSON.stringify(updatedObj)
    })
    .then(res =>{
        return res.json()
       
    })
  
    .then(data =>{
        let card = [...document.getElementById(updateId).children];
        card[0].innerHTML = `<h2 class="m-0">${data.title}</h2>`;
        card[1].innerHTML = `<p class="m-0">${data.body}</p>`;
        Swal.fire({
            title: "Good job!",
            text: "Post is updated successfully!",
            icon: "success"
          });
    })
    .catch(cl)
    .finally(()=>{
        postForm.reset();
        updateBtn.classList.add("d-none");
        submitBtn.classList.remove("d-none");
    })
}

postForm.addEventListener("submit", onPostSubmit);
updateBtn.addEventListener("click", onPostUpdate);