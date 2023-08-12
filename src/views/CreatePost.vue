<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { firebaseConfig, db } from '../Firebase/firebaseInit';
import { collection, addDoc } from 'firebase/firestore';

const router = useRouter()
const isSubmitting = ref(false);
const title = ref('')
const content = ref('')
const selectedImage = ref(null);
const selectedImageBase64 = ref('');

const handleImageUpload = (event) => {
  selectedImage.value = event.target.files[0];
  if (selectedImage.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImageBase64.value = e.target.result;
    };
    reader.readAsDataURL(selectedImage.value);
  }
};

const createPost = async () => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('content', content.value);
    formData.append('image', selectedImage.value);

    const postsCollection = collection(db, 'blogpost');
    const newPostRef = await addDoc(postsCollection, {
      title: title.value,
      content: content.value,
      image: selectedImageBase64.value
    });

    title.value = '';
    content.value = '';
    selectedImage.value = null;
    console.log('Post created with ID:', newPostRef.id);
    isSubmitting.value = false;
    router.push('/');
  } catch (error) {
    isSubmitting.value = false;
    console.error('Error creating post:', error);
  }
};
</script>
<template>
  <section class="post-wrap">
    <h2>Create New Post</h2>
    <form @submit.prevent="createPost" class="post-form">
      <div class="form-fields">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="title" required>
      </div>
      <div class="form-fields">
        <label for="content">Content:</label>
        <textarea id="content" v-model="content" required></textarea>
      </div>
      <div class="form-fields">
        <label for="image">Featured Image:</label>
        <input type="file" id="image" @change="handleImageUpload" accept="image/*">
        <small>less than 2mb of file allowed</small>
      </div>
      <button type="submit" :disabled="isSubmitting">
        <span v-if="isSubmitting">
          <span class="material-icons">autorenew</span> Creating...
        </span>
        <span v-else>Create Post</span>
      </button>
    </form>
  </section>
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
.material-icons {
    font-size: 18px;
    vertical-align: middle;
    margin-right: 5px;
}

.post-form {
  display: flex;
  flex-direction: column;
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
  border: 0.0625rem solid #ccc;
  border-radius: 0.25rem;
}

.form-fields textarea {
  resize: vertical;
  height: 10rem;
}

button[type="submit"] {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.625rem 0.9375rem;
  cursor: pointer;
  max-width: 15rem;
  width: 100%;
  margin: 0 auto;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.error-message {
  color: #d9534f;
  font-size: 0.875rem;
  margin-top: 0.3125rem;
}
</style>
