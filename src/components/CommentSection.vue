<template>
  <div class="post-details">
    <h3>Add a Comment</h3>
    <form @submit.prevent="addComment">
      <div class="form-fields">
        <textarea v-model="newCommentText"></textarea>
      </div>
      <button type="submit" :disabled="isSubmitting">
        <span v-if="isSubmitting">
          <span class="material-icons">autorenew</span> updating...
        </span>
        <span v-else>Post Comment</span>
      </button>
    </form>
    <h3 class="heading">Previous Comments</h3>
    <ul>
      <li v-for="comment in comments" :key="comment.id">{{ comment.text }}</li>
    </ul>


  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../Firebase/firebaseInit';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const isSubmitting = ref(false);
const props = defineProps({
  postId: String // Pass postId from parent component
});

const comments = ref([]);
const newCommentText = ref('');

onMounted(async () => {
  try {
    const commentsSnapshot = await getDocs(collection(db, `blogpost/${props.postId}/comments`));
    comments.value = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
});

const addComment = async () => {
  isSubmitting.value = true;
  try {
    const commentData = {
      text: newCommentText.value,
      timestamp: new Date()
    };
    await addDoc(collection(db, `blogpost/${props.postId}/comments`), commentData);
    newCommentText.value = '';
    const commentsSnapshot = await getDocs(collection(db, `blogpost/${props.postId}/comments`));
    comments.value = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    isSubmitting.value = false;
  } catch (error) {
    isSubmitting.value = false;
    console.error('Error adding comment:', error);
  }
};
</script>
<style scoped>
.post-details {
  max-width: 55rem;
  width: 100%;
  margin: 5rem auto;
  text-align: center;
}

.form-fields textarea {
  width: 100%;
  padding: 0.5rem;
  border: 0.0625rem solid #ccc;
  border-radius: 0.25rem;
  margin: 1rem 0;
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

form {
  margin-bottom: 2rem;
}

.heading {
  margin-bottom: 1rem;
}

ul li {
  list-style: none;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--grey);
}
</style>