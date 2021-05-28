<template class ="login-body">

<!-- <section class="login">
 <form class="login-form">
  <h2 class="login-title">Login</h2>
  <div class="info">
   <p>{{ alert.message }}</p> 
  </div>
  <input class= "login-input" type="text" name = "userCNP" placeholder="Enter CNP" />
 
  <button class="login-button" v-on:click="login()">Log in</button>
 </form>
</section> -->
<!-- <div id="app"> -->

      <div class="login-page">
      <div class="container-fluid">
         <div class="row-lg">
            <div class="col-lg-4 col-md-8 col-sm-6">
               <div class="card" v-bind:class="{ error: emptyFields }">
                  <h1 class = "login-title">Register</h1>
                  <form class="form-group" v-on:submit="registerVoter">
                     <!-- <input  v-model="userCNP"  type="text" class="form-control" placeholder="CNP" required>
                     <input type="submit" class="btn btn-primary" v-on:click="login()"> -->
                     <input type="text" v-model="registerData.voterId" class="form-control" placeholder="Enter Personal ID" required>
                    <br>
                    <input type="text" v-model="registerData.registrarId" class="form-control" placeholder="Enter Registrar ID" required>
                    <br>
                    <input type="text" v-model="registerData.firstName" class="form-control" placeholder="Enter first name" required>
                    <br>
                    <input type="text" v-model="registerData.lastName" class="form-control" placeholder="Enter last name" required>
                    <br>
                    <input type="submit" class="btn btn-primary" value="Register">
                  </form>
                  <vue-instant-loading-spinner id='loader' ref="Spinner"></vue-instant-loading-spinner>
               </div>
            </div>
         </div>

      </div>
   </div>

<!-- </div> -->

</template>

<script>
    import PostsService from "@/services/apiService";
    import VueInstantLoadingSpinner from "vue-instant-loading-spinner/src/components/VueInstantLoadingSpinner.vue";
    export default {
        name: 'Register',
        data() {
            return {
                registerData: {},
                emptyFields: false
        
         }
		},
         components: {
             VueInstantLoadingSpinner
        },
        methods: {
                async registerVoter() {

                if(this.registerData.voterId || this.registerData.registrarId || this.registerData.firstName || this.registerData.lastName === "" ){
                   this.emptyFields = true;
                }

                await this.runSpinner();
                const apiResponse = await PostsService.registerVoter(
                    this.registerData.voterId,
                    this.registerData.registrarId,
                    this.registerData.firstName,
                    this.registerData.lastName
                );

                console.log(apiResponse);
                if(!(apiResponse.data.includes("Error"))){
                    this.$emit("authenticated", true);
                   this.$router.replace({ name: "CastBallot" });
                }
                // apiResponse.then(
                //     () => { this.$router.replace({ name: "Home" }); }
                // );
                await this.hideSpinner();
            },
             async runSpinner() {
                this.$refs.Spinner.show();
                },
            async hideSpinner() {
                this.$refs.Spinner.hide();
            }
        }
    }
</script>

<style>
.card {
   padding: 20px;
}

.form-control{
      margin-bottom: 20px;
   }


.login-page{
   justify-content: center;
   align-items: center;
   display: flex;
   padding-top: 100px;
   padding-left:550px
   /* height: 100vh; */
}
   .fade-enter,
   .fade-leave-to {
      opacity: 0;
   }
   
   .login-title {
      margin-bottom: 1.5rem;
   }


.error {
   animation-name: errorShake;
   animation-duration: 0.3s;
}

@keyframes errorShake {
   0% {
      transform: translateX(-25px);
   }
   25% {
      transform: translateX(25px);
   }
   50% {
      transform: translateX(-25px);
   }
   75% {
      transform: translateX(25px);
   }
   100% {
      transform: translateX(0);
   }
}


</style>