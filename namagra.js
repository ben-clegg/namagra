var app = new Vue({
  el: '#app',
  data: {
    input: 'namagra',
    results: [
      { text : 'test1'},
      { text : 'test2'}
    ]
  },
  methods: {
    findSolutions: function () {
      // Reset results
      this.results = [];

      
    }
  }
})
