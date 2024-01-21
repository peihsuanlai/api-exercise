import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const app = {
  data() {
    return {
      products: [],
      temp: {},
      url: "https://vue3-course-api.hexschool.io/v2",
      path: "product-api",
    };
  },
  methods: {
    getProducts() {
      axios
        .get(`${this.url}/api/${this.path}/admin/products`)
        .then((res) => {
          //console.log(res.data.products);
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    showProduct(id) {
      axios
        .get(`${this.url}/api/${this.path}/product/${id}`)
        .then((res) => {
          this.temp = res.data.product;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    check() {
      axios
        .post(`${this.url}/api/user/check`)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
          location.href = "index.html";
        });
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    //console.log(token);
    axios.defaults.headers.common["Authorization"] = token;
    this.check();
  },
};
createApp(app).mount("#app");
