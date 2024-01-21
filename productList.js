import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const app = {
  data() {
    return {
      products: [],
      tempProduct: {},
      url: "https://vue3-course-api.hexschool.io/v2",
      path: "product-api",
      isNew: null,
      modal1: {},
      modal2: {},
    };
  },
  methods: {
    getProducts() {
      axios
        .get(`${this.url}/api/${this.path}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    openModal(modalName, isNew, item) {
      if (modalName == "productModal") {
        if (isNew) {
          this.tempProduct = {};
        } else {
          this.tempProduct = { ...item };
        }
        this.isNew = isNew;
        this.modal1.show();
      } else if (modalName == "deleteModal") {
        this.modal2.show();
      }
    },
    hideModal(modalName) {
      if (modalName == "productModal") {
        this.modal1.hide();
      } else if (modalName == "deleteModal") {
        this.modal2.hide();
      }
    },
    updateData(item) {
      this.tempProduct = item;
      console.log(this.isNew);
      let url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
      let http = "put";
      if (this.isNew) {
        url = `${this.url}/api/${this.path}/admin/product`;
        http = "post";
      }
      axios[http](url, { data: this.tempProduct })
        .then((res) => {
          this.hideModal("productModal");
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
        });

      // if (this.isNew) {
      //   axios
      //     .post(`${this.url}/api/${this.path}/admin/product`, this.tempProduct)
      //     .then((res) => {
      //       console.log(res);
      //       this.hideModal("productModal");
      //       this.getProducts();

      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       alert(err.data.message);
      //     });
      // } else {
      //   axios
      //     .put(
      //       `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`,
      //       this.tempProduct
      //     )
      //     .then((res) => {
      //       console.log(res);
      //       this.hideModal("productModal");
      //       this.getProducts();

      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       alert(err.data);
      //     });
      // }
    },
    deleteData(item){
      this.tempProduct=item;
      axios
        .delete(`${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`)
        .then((res) => {
          this.hideModel("deleteModal");
          this.getProducts;

        })
        .catch((err) => {
          alert(err.data.message);
        });

    },
    uploadFile() {
      const uploadedFile = this.$refs.fileInput.files[0];
      const formData = new FormData();
      formData.append("file-to-upload", uploadedFile);
      axios
        .post(`${this.url}/api/${this.path}/admin/upload`,formData)
        .then((res) => {
          this.tempProduct.imageUrl = res.data.imageUrl;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    createImages(){
      this.tempProduct.imagesUrl=[];
    },
    check() {
      axios
        .post(`${this.url}/api/user/check`)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
          location.href = "/";
        });
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.check();
    this.modal1 = new bootstrap.Modal(this.$refs.productModal);
    this.modal2 = new bootstrap.Modal(this.$refs.delProductModal);
  },
};
createApp(app).mount("#app");
