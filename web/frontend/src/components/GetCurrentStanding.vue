<template>
  <div class="container-fluid">

    <h1 class="poll-title">Get the Current Poll Standings</h1>

    
    
    <vue-instant-loading-spinner id='loader' ref="Spinner"></vue-instant-loading-spinner>
    <div class="chart-wrapper">
      <chart :options="chartOptionsBar" class="echarts"></chart>
    </div>
  </div>
</template>

<script>
import PostsService from "@/services/apiService";
import VueInstantLoadingSpinner from "vue-instant-loading-spinner/src/components/VueInstantLoadingSpinner.vue";
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  name: "response",
  data() {
    return {
      response: null,
      chartOptionsBar: {}
    };
  },
  components: {
    VueInstantLoadingSpinner
  },
  methods: {
    async getCurrentStanding() {
      this.response = null;
      
      this.runSpinner();

      // console.log(`this.selected ${this.selected}`);
      const apiResponse = await PostsService.getCurrentStanding();
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%");
      console.log(apiResponse);
      console.log(apiResponse.data[0].Record);
      let currentStanding = [];
      for (let i = 0; i < apiResponse.data.length; i++) {
        currentStanding[i] = apiResponse.data[i].Record.count;
      }
      console.log("curStanding: ");
      console.log(currentStanding);

      this.chartOptionsBar = {
        xAxis: {
          data: [
            "Democrat",
            "Green",
            "Independent",
            "Libertarian",
            "Republican"
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            type: "bar",
            data: currentStanding
          }
        ],
        title: {
          text: "2020 ",
          x: "center",
          textStyle: {
            fontSize: 24
          }
        },
        color: ["#127ac2"],
      };
      // this.response = apiResponse.data;
      // this.renderChart(this.datacollection, this.options)
      this.hideSpinner();
    },
    async runSpinner() {
      this.$refs.Spinner.show();
    },
    async hideSpinner() {
      this.$refs.Spinner.hide();
    }
  },

  async mounted(){
    {
      this.response = null;
      

      // console.log(`this.selected ${this.selected}`);
      const apiResponse = await PostsService.getCurrentStanding();
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%");
      console.log(apiResponse);
      console.log(apiResponse.data[0].Record);
      let currentStanding = [];
      for (let i = 0; i < apiResponse.data.length; i++) {
        currentStanding[i] = apiResponse.data[i].Record.count;
      }
      console.log("curStanding: ");
      console.log(currentStanding);

      this.chartOptionsBar = {
        xAxis: {
          data: [
            "Democrat",
            "Green",
            "Independent",
            "Libertarian",
            "Republican"
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            type: "bar",
            data: currentStanding
          }
        ],
        title: {
          text: "2020 ",
          x: "center",
          textStyle: {
            fontSize: 24
          }
        },
        color: ["#127ac2"]
      };
      // this.response = apiResponse.data;
      // this.renderChart(this.datacollection, this.options)
      
    }
  }
};
</script>

<style >

.poll-title{
  display: flex;
  justify-content: center;
   padding-top: 50px;
}
.chart-wrapper {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  padding-top: 150px;
  width: 100%;
  height: 1000px;
}
.canvas{
  width: 500%;
  height: 100%;
}
.echarts {
  
  width: 500%;
  height: 100%;
}

#loader {
  position:fixed;
  padding-top: 250px;
}



</style>