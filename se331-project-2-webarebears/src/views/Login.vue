<template>
  <div class="row pt-20">
    <div class="col-md-6 offset-md-3">
      <h3 class="text-center mb-4 mt-10">Login</h3>
      <hr />
      <form>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="text" class="form-control" placeholder="Email" />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" placeholder="Password" />
        </div>
        <div class="my-3">
          <button
            @click="submitComment"
            class="px-4 py-2 bg-customRed text-white rounded hover:bg-customOrange"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
h3 {
  font-weight: bold;
  color: #343a40;
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  text-align: left;
  color: #495057;
  margin-bottom: 0.5rem; /* Add space below the label */
  display: block; /* Make sure the label is on top of the input */
  margin-left: 30%;
}

.form-control {
  width: 500px;
  padding: 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
@media (max-width: 430px) {
  .form-label {
    margin-left: 8%;
  }
  .form-control{
    max-width: 80%;
  }
}

hr {
  margin: 1rem auto;
  width: 40%;
}
</style>
