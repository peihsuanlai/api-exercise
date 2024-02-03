import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
let productModal = null;
let deleteModal = null;
let url = "https://vue3-course-api.hexschool.io/v2";
let path = "product-api";
const app = createApp({
  data() {
    return {
      products: [], 
      tempProduct: {
        imagesUrl: [],
      },
      url: "https://vue3-course-api.hexschool.io/v2",
      path: "product-api",
      isNew: null,
      pagination:{}
    };
  },
  methods: {
    getProducts(page=1) {
      axios
        .get(`${url}/api/${path}/admin/products?page=${page}`)
        .then((res) => {
          //console.log(res);
          const {products, pagination}=res.data;
          this.products = products;
          this.pagination = pagination;
        })
        .catch((err) => {
          alert(err.data.message);
          location.href = "index.html";
        });
    },
    openModal(isNew, item) {
      if (isNew == "new") {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew == "edit") {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew == "delete") {
        this.tempProduct = { ...item };
        deleteModal.show();
      }
    },

    check() {
      axios
        .post(`${url}/api/user/check`)
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
    axios.defaults.headers.common["Authorization"] = token;
    this.check();
  },
});

app.component("pagination",{
  props:["pages"],
  template:"#pagination",
  methods:{
    switchPage(page){
      this.$emit("switchPage",page);
    }
  }
})

app.component("productModal", {
  props: ["product", "isNew"],
  template: "#productModal",
  methods: {
    updateData() {
      let apiUrl = `${url}/api/${path}/admin/product/${this.product.id}`;
      let http = "put";
      if (this.isNew) {
        apiUrl = `${url}/api/${path}/admin/product`;
        http = "post";
      }
      axios[http](apiUrl, { data: this.product })
        .then((res) => {
          //console.log(res.config.data);
          alert(res.data.message);
          productModal.hide();
          this.$emit("update");
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
        .post(`${url}/api/${path}/admin/upload`, formData)
        .then((res) => {
          this.product.imageUrl = res.data.imageUrl;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    createImages() {
      this.product.imagesUrl = [];
    },
  },
  mounted() {
    productModal = new bootstrap.Modal(this.$refs.productModal);
  },
});

app.component("deleteModal",{
  props: ["product", "isNew"],
  template: "#delProductModal",
  methods:{
    deleteData() {
      axios
        .delete(
          `${url}/api/${path}/admin/product/${this.product.id}`
        )
        .then((res) => {
          alert(res.data.message);
          deleteModal.hide();
          this.$emit("update");
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
  mounted(){
    deleteModal = new bootstrap.Modal(this.$refs.delProductModal);
  }
})

app.mount("#app");
