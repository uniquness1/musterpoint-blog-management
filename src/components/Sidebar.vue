<script setup>
import { ref } from 'vue'
import logo from '../assets/images/LogoBlog.png'
const isOpened = ref(localStorage.getItem("isOpened") === "true")
const ToggleSidebar = () => {
    isOpened.value = !isOpened.value
    localStorage.setItem("isOpened", isOpened.value)
}
</script>

<template>
    <aside class="sidebar" :class="`${isOpened ? 'isOpened' : ''}`">
        <div class="logo">
            <img :src="logo" alt="blog logo" />
        </div>

        <nav class="menu">
            <router-link to="/" class="button">
                <i class="material-icons">home</i>
                <p class="text">Home</p>
            </router-link>
            <router-link to="/post/create" class="button">
                <i class="material-icons">publish</i>
                <p class="text">Create Post</p>
            </router-link>
        </nav>

        <div class="menu-toggle-wrap">
            <button class="menu-toggle" @click="ToggleSidebar">
                <i class="material-icons">keyboard_double_arrow_right</i>
            </button>
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4rem;
    background-color: var(--dark);
    color: var(--light);
    width: calc(2rem + 38px);
    overflow: hidden;
    min-height: 100vh;
    padding: 1rem;
    transition: 0.2s ease-in-out;
}

.sidebar .flex {
    flex: 1 1 0%;
}

.sidebar .logo {
    margin-bottom: 1rem;
}

.sidebar .logo img {
    width: 2.5rem;
    height: 3rem;
}

.sidebar .menu-toggle-wrap {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 1rem;
    position: relative;
    top: 0;
    transition: 0.2s ease-in-out;
}

.sidebar .menu-toggle {
    transition: 0.2s ease-in-out;
}

.sidebar .menu-toggle .material-icons {
    font-size: 2rem;
    color: var(--light);
    transition: 0.2s ease-out;
}

.sidebar .menu-toggle:hover .material-icons {
    color: var(--primary);
    transform: translateX(0.5rem);
}

.sidebar .button .text {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

.sidebar .menu {
    margin: 0 -1rem;
}

.sidebar .menu .button {
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: 0.2s ease-in-out;
    padding: 0.5rem 1rem;
}

.sidebar .menu .button .material-icons {
    font-size: 2rem;
    color: var(--light);
    transition: 0.2s ease-in-out;
}

.sidebar .menu .button .text {
    color: var(--light);
    transition: 0.2s ease-in-out;
}

.sidebar .menu .button:hover {
    background-color: var(--dark-alt);
}

.sidebar .menu .button:hover .material-icons,
.sidebar .menu .button:hover .text {
    color: var(--primary);
}

.sidebar .menu .button.router-link-exact-active {
    background-color: var(--dark-alt);
    border-right: 5px solid var(--primary);
}

.sidebar .menu .button.router-link-exact-active .material-icons,
.sidebar .menu .button.router-link-exact-active .text {
    color: var(--primary);
}

.sidebar.isOpened {
    width: var(--sidebar-width);
}

.sidebar.isOpened .menu-toggle-wrap {
    top: -3rem;
}

.sidebar.isOpened .menu-toggle {
    transform: rotate(-180deg);
}

.sidebar.isOpened .button .text {
    opacity: 1;
}

.sidebar.isOpened .button .material-icons {
    margin-right: 1rem;
}
button {
    cursor: pointer;
    appearance: none;
    border: none;
    outline: none;
    background: none;
}
/* @media (max-width: 1024px) {
    .sidebar {
        position: absolute;
        z-index: 99;
    }
} */
@media (max-width :767px){
.sidebar {
    flex-direction: row;
    justify-content: center;
    background-color: var(--dark);
    color: var(--light);
    width: 100%;
    overflow: hidden;
    min-height: 5vh;
    padding: 1rem;
    transition: 0.2s ease-in-out;
    position: fixed;
    bottom: 0;
    left: 0;
}
.logo{
    display: none;
}
.sidebar .menu {
    display: flex;
}
.menu-toggle{
    display: none;
}
}
</style>