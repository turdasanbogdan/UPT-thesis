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
         <div class="row-lg justify-content-center">
            <div class="col-lg-4 col-md-4 col-sm-6 ">
               <div class="card" v-bind:class="{ error: emptyFields }">
                  <h1 class = "login-title">Log In</h1>
                  <form class="form-group" v-on:submit="validateVoter">
                     <input  v-model="userCNP"  type="text" class="form-control" placeholder="CNP" required>
                     <input type="submit" class="btn btn-primary mb-4">
					 <br>
					  <p>Don't have an account? <a href="#" v-on:click="gotoRegister()">Sign up here</a></p>
                  </form>
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
        name: 'Login',
        data: function() {
         return  {
           
             userCNP: "",
			 emptyFields: false
        
         }
		},
		components: {
             VueInstantLoadingSpinner
        },
        methods: {

			async validateVoter() {
			//await this.runSpinner();

			 if(this.userCNP === "") {
				 this.emptyFields = true;
				console.log("smth went wrong at log in");
				
				//await this.hideSpinner();
			} else {
				const apiResponse = await PostsService.validateVoter(
				this.userCNP
				);
				console.log("apiResponse");
				console.log(apiResponse.data);

				if (apiResponse.data.error) {
				// console.log(apiResponse);
				console.log(apiResponse.data.error);
				// this.loginReponse = apiResponse.data.error;
				} else {
				this.$emit("authenticated", true);
				this.$router.replace({ name: "CastBallot" });
				}

				console.log(apiResponse);
				//his.loginReponse = apiResponse;
				// this.$router.push('castBallot')
				//await this.hideSpinner();
			}
			},
			async runSpinner() {
			this.$refs.Spinner.show();
			},
			async hideSpinner() {
			this.$refs.Spinner.hide();
			},
            login() {
                if(this.userCNP === ""){
                    
					 this.emptyFields = true;
					 console.log("smth went wrong at log in");
                }else{
					console.log("merge, idk");
					console.log(this.userCNP);
					 this.$emit("authenticated", true);
                     this.$router.replace({ name: "CastBallot" });
                }
            },
			gotoRegister() {
				this.$router.replace({ name: "register" });
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
   padding-top: 200px;
   padding-left:750px
   /* height: 100vh; */
}
/* .container{
	   align-items: center;
   display: flex;
   height: 100%;
   width: 100%;
} */
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