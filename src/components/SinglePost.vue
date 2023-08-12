<template>
  <div class="post-details">
      <h2>{{ post.title }}</h2>
      <img :src="post.image" alt="Post Image" class="post-image" />
      <p>{{ post.content }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../Firebase/firebaseInit';
import { doc, getDoc } from 'firebase/firestore';
import { useRoute } from 'vue-router';

const route = useRoute();
const postId = route.params.postId;
// console.log('postId:', postId);

const post = ref({ title: '', content: '' });

onMounted(async () => {
  try {
      const postDoc = await getDoc(doc(db, 'blogpost', postId));
      // console.log('postDoc:', postDoc.exists() ? postDoc.data() : 'Not found');
      if (postDoc.exists()) {
          post.value = postDoc.data();
      }
  } catch (error) {
      console.error('Error fetching post:', error);
  }
});
</script>
<style scoped>
  .post-details{
    max-width: 55rem;
    width: 100%;
    margin: 5rem auto;
    text-align: center;
    padding: 1rem .7rem;
  }
  img{
    max-width: 20rem;
    width: 100%;
  }
  .post-details h2{
    margin-bottom: 1rem;
    font-size: 1.8rem;
  }
  .post-details p{
    line-height: 1.3;
    margin: 1rem 0;

  }
</style>
