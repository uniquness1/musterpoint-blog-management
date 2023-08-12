<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../Firebase/firebaseInit';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const showDeleteConfirmation = ref(false);
const postToDelete = ref(null);
const posts = ref([]);
const viewMode = ref('grid');
const setView = (mode) => {
    viewMode.value = mode;
};
// const isHovered = ref(false);

const showActions = (post) => {
    post.hovered = true;
};

const hideActions = (post) => {
    post.hovered = false;
};
onMounted(async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'blogpost'));
        const blogPost = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            commentsCount: 0,
        }));

        blogPost.forEach(post => {
            // console.log(post.id);
            post.hovered = false;
        });

        posts.value = blogPost;
        await Promise.all(posts.value.map(async post => {
            const commentsSnapshot = await getDocs(collection(db, `blogpost/${post.id}/comments`));
            post.commentsCount = commentsSnapshot.size;
        }));
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
});

const getExcerpt = (content) => {
    const words = content.split(' ').slice(0, 18);
    return words.join(' ') + '...';
};

const confirmDelete = (postId) => {
    showDeleteConfirmation.value = true;
    postToDelete.value = postId;
};

const deletePost = async (postId) => {
    try {
        await deleteDoc(doc(db, 'blogpost', postId))
        posts.value = posts.value.filter(post => post.id !== postId);
        // console.log(`Post with ID ${postId} deleted`);
    } catch (error) {
        console.error('Error deleting post:', error);
    }
};
const deleteConfirmed = async (postId) => {
    try {
        await deletePost(postId);
        showDeleteConfirmation.value = false;
        postToDelete.value = null;
    } catch (error) {
        console.error('Error deleting post:', error);
    }
};

const cancelDelete = () => {
    showDeleteConfirmation.value = false;
    postToDelete.value = null;
};
</script>

<template>
    <div class="container">
        <h2>Latest Posts</h2>
        <div class="view-toggle">
            <button @click="setView('grid')" :class="{ active: viewMode === 'grid' }">
                <span class="material-icons">view_module</span>
            </button>
            <button @click="setView('list')" :class="{ active: viewMode === 'list' }">
                <span class="material-icons">view_list</span>
            </button>
        </div>
        <div v-if="viewMode === 'grid'" class="post-grid">
            <div v-for="post in posts" :key="post.id" class="post-item" @mouseover="showActions(post)"
                @mouseout="hideActions(post)">
                <div class="content-wrap">
                    <img :src="post.image" alt="Post Image" class="post-image" />
                    <h3>{{ post.title }}</h3>
                    <p>{{ getExcerpt(post.content) }}
                        <router-link class="link" :to="`/post/${post.id}`">Read More</router-link>
                    </p>
                </div>
                <div class="post-comments">
                    <span class="material-icons">comment</span>
                    {{ post.commentsCount }} {{ post.commentsCount === 1 ? 'Comment' : 'Comments' }}
                </div>
                <div class="post-actions" :class="{ 'visible': post.hovered  }" v-if="post">
                    <router-link class="link" :to="`/post/edit/${post.id}`">
                        <span class="material-icons">edit</span>
                    </router-link>
                    <button @click="confirmDelete(post.id)">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
        </div>
        <ul v-else-if="viewMode === 'list'" class="post-list">
            <li v-for="post in posts" :key="post.id" class="post-item" @mouseover="showActions(post)"
                @mouseout="hideActions(post)">
                <img :src="post.image" alt="Post Image" class="post-image" />
                <h3>{{ post.title }}</h3>
                <p>{{ getExcerpt(post.content) }}
                    <router-link class="link" :to="`/post/${post.id}`">Read More</router-link>
                </p>
                <div class="post-comments">
                    <span class="material-icons">comment</span>
                    {{ post.commentsCount }} {{ post.commentsCount === 1 ? 'Comment' : 'Comments' }}
                </div>
                <div class="post-actions" :class="{ 'visible': post.hovered  }" v-if="post">
                    <router-link class="link" :to="`/post/edit/${post.id}`">
                        <span class="material-icons">edit</span>
                    </router-link>
                    <button @click="confirmDelete(post.id)">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </li>
        </ul>

        <div v-if="showDeleteConfirmation" class="delete-popup">
            <div class="popup-content">
                <p>Are you sure you want to delete this post?</p>
                <button @click="deleteConfirmed(postToDelete)">Yes</button>
                <button @click="cancelDelete">No</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.container h2 {
    margin-top: 2rem;
}

.post-comments {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 1rem;
}

.view-toggle {
    margin-bottom: 10px;
    position: absolute;
    top: 10%;
    right: 5%;
}

.view-toggle button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    margin-right: 10px;
    cursor: pointer;
}

.view-toggle button.active {
    font-weight: bold;
}

.view-toggle button span {
    font-size: 24px;
}

.post-list {
    list-style-type: none;
}

.post-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
}

.post-image {
    max-width: 100%;
    height: auto;
    margin-top: 10px;
}

.post-item {
    margin-top: 3rem;
    max-width: 20rem;
    width: 100%;
    border: 1px solid var(--dark);
    border-radius: .5rem;
    max-height: max-content;
    padding: 0 1rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
}

.post-item h3 {
    padding-bottom: 1rem;
    color: var(--dark);
    text-align: center;
    font-size: 1.2rem;
}

.post-item p {
    /* text-align: center; */
    color: var(--dark-alt);
    margin-bottom: 1rem;
}

.post-item .link {
    text-decoration: none;
    color: var(--primary);
    transition: .2s linear;
}

.post-item .link:hover {
    color: var(--grey);
}

.post-image {
    border-bottom: 1px solid var(--dark);
    padding-bottom: 2rem;
    height: 10rem;
    transition: 0.3s linear;
}

.post-image:hover {
    transform: scaleX(1.1);
}

.post-item .post-actions button {
    color: red;
    border: none;
    transition: .2s linear;
    cursor: pointer;
    background: transparent;
}

/* .post-item .post-actions button:hover {
    color: var(--dark-alt); */
/* } */

.delete-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.popup-content {
    background-color: var(--light);
    border-radius: 0.5rem;
    padding: 1rem;
    text-align: center;
}

.popup-content button {
    margin: 0.5rem;
    padding: 0.25rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    background: transparent;
    transition: background-color 0.2s ease;
}

.popup-content button:hover {
    background-color: var(--primary);
    color: var(--light);
}

.post-actions {
    opacity: 0;
    transition: opacity 0.3s linear;
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: .2rem 0;
}

.post-actions.visible {
    opacity: 1;
}
@media(max-width: 800px){
    .post-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
}
}
</style>
  