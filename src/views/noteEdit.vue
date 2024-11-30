<template>
  <div class="edit-article">
    <h3>Edit Article</h3>
    <form @submit.prevent="updateArticle">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" v-model="article.title" id="title" required />
      </div>
      <div class="form-group">
        <label for="tags">Tags</label>
        <input type="text" v-model="article.tags" id="tags" />
      </div>
      <div class="form-group">
        <label for="content">Content</label>
        <rich-text-editor v-model="article.content" />
      </div>
      <button type="submit">Save Changes</button>
    </form>
  </div>
</template>
 
<script>
export default {
  props: ['articleId'],
  data() {
    return {
      article: {
        title: "",
        tags: "",
        content: "",
      },
    };
  },
  async created() {
    const { data } = await this.$http.get(`/articles/${this.articleId}`);
    this.article = data;
  },
  methods: {
    async updateArticle() {
      try {
        await this.$http.put(`/articles/${this.articleId}`, this.article);
        // Handle success
      } catch (error) {
        // Handle error
      }
    },
  },
};
</script>