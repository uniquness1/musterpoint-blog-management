<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../Firebase/firebaseInit';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRoute } from 'vue-router';
import router from '../router';

const route = useRoute();
const isSubmitting = ref(false);
const postId = route.params.postId;
const editedPost = ref({ title: '', content: '' });

onMounted(async () => {
    try {
        const postDoc = await getDoc(doc(db, 'blogpost', postId));
        if (postDoc.exists()) {
            editedPost.value = postDoc.data();
        }
    } catch (error) {
        console.error('Error fetching post:', error);
    }
});

const updatePost = async () => {
    isSubmitting.value = true;
    try {
        await updateDoc(doc(db, 'blogpost', postId), editedPost.value);
        console.log('Post updated:', postId);
        isSubmitting.value = true;
        router.push('/')
    } catch (error) {
        isSubmitting.value = true;
        console.error('Error updating post:', error);
    }
};
</script>

<template>
    <div class="post-wrap">
        <h2>Edit Post</h2>
        <form @submit.prevent="updatePost">
            <div class="form-fields">
                <label for="title">Title:</label>
                <input type="text" v-model="editedPost.title" required>
            </div>
            <div class="form-fields">
                <label for="content">Content:</label>
                <textarea v-model="editedPost.content" required></textarea>
            </div>
            <button type="submit" :disabled="isSubmitting">
                <span v-if="isSubmitting">
                    <span class="material-icons">autorenew</span> updating...
                </span>
                <span v-else>Update Post</span>
            </button>
        </form>
    </div>
</template>

<style scoped>
.post-wrap {
    max-width: 50rem;
    margin: 5rem auto;
    padding: 1.25rem;
    border: 0.0625rem solid #ccc;
    border-radius: 0.3125rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
}

.form-fields {
    margin-bottom: 0.8125rem;
}

.form-fields:first-child {
    margin-top: 0.8125rem;
}

.form-fields label {
    font-weight: bold;
}

.form-fields input,
.form-fields textarea {
    width: 100%;
    padding: 0.5rem;
    border: 0.0625rem solid var(--grey-alt);
    border-radius: 0.25rem;
}

.form-fields textarea {
    resize: vertical;
    height: 10rem;
}

button[type="submit"] {
    background-color: var(--dark);
    color: var(--light);
    border: none;
    border-radius: 0.25rem;
    padding: 0.625rem 0.9375rem;
    cursor: pointer;
    max-width: 15rem;
    width: 100%;
    margin: 0 auto;
}

button[type="submit"]:hover {
    background-color: var(--dark-alt);
}
</style>