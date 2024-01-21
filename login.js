import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const app = {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      url: "https://vue3-course-api.hexschool.io/v2",
      path: "product-api",
    };
  },
  methods: {
    login() {
      axios
        .post(`${this.url}/admin/signin`, this.user)
        .then((res) => {
          console.log(res.data);
          const { token, expired } = res.data;
          console.log(token);
          document.cookie = `myToken=${token}; expires=${new Date(expired)};`;
          location.href = "productList.html";
        })
        .catch((err) => {
          alert(err.data.message);
          this.user.username = "";
          this.user.password = "";
        });
    },
  },
};

createApp(app).mount("#app");
