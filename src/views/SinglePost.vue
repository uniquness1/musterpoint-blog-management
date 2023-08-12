<template>
    <div>
        <SinglePost />
        <CommentSection :postId="postId"/>
    </div>
</template>
<script setup>
import SinglePost from '../components/SinglePost.vue';
import CommentSection from '../components/CommentSection.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const postId = route.params.postId;
</script>
<style></style>
