<template>
  <div id="app">

        <!-- <div id="nav" v-if="authenticated">
           
        <p><router-link to="/">Home</router-link>&nbsp;          
        <router-link to="/castBallot">Cast Ballot</router-link>&nbsp; 
        <router-link to="/QueryAll">QueryAll</router-link></p>
        <router-link to="/getCurrentStanding">Get Poll Standings</router-link>&nbsp;
        </div>
         <router-view @authenticated="setAuthenticated" /> -->
         <nav class="main-nav" v-if="authenticated">
          <div class="logo">
            
          </div>
          <Burger></Burger>
          </nav>

        <Sidebar v-if="authenticated">
          <ul class="sidebar-panel-nav">
            <li><router-link to="/castBallot">Cast Ballot</router-link></li>
            <li> <router-link to="/getCurrentStanding">Current Standing</router-link></li>
            <li> <router-link to="/queryWithQueryString">Query</router-link></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </Sidebar>
        <router-view @authenticated="setAuthenticated" />
    </div>
</template>

<script>
import Burger from './components/Burger.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'App',
  data() {
    return {
      authenticated: false
    }
  },
   components: {
   Burger,
   Sidebar
 },
  mounted() {
    if(!this.authenticated) {
        this.$router.replace({ name: "login" });
        }
    },
    methods: {
        setAuthenticated(status) {
              this.authenticated = status;
        },
          logout() {
              this.authenticated = false;
          }
        }
}
</script>

<style >
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
html {
   height: 100%;
   overflow:hidden;
 }

 body {
   border: 0; margin: 0; padding: 0;
   font-family: 'Lato';
   height: 100%;
   /* background: rgb(101,31,87);
   background: linear-gradient(45deg, rgba(101,31,87,1) 0%, rgba(225,113,87,1) 48%, rgba(249,248,113,1) 100%); */
 }

 .logo {
   align-self: center;
   font-weight: bold;
   font-family: 'Lato'
 }

 .main-nav {
   background-color: #5143ee;
   display: flex;
   justify-content: space-between;
   padding: 0.5rem 0.8rem;
 }

 ul.sidebar-panel-nav {
   list-style-type: none;
 }

 ul.sidebar-panel-nav > li > a {
   color: #fff;
   text-decoration: none;
   font-size: 1.5rem;
   display: block;
   padding-bottom: 0.5em;
 }
/* .chart-wrapper {
  width: 100%;
  height: 700px;
}
.echarts {
  width: 100%;
  height: 100%;
}

#loader {
  position:fixed;
  padding-top: 250px;
}

.chart-wrapper {
  position:fixed; */
  /* padding-left:32%;
  margin-right: 4000px;
} */
</style>