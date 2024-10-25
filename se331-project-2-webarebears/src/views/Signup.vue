<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <h3 class="text-center mb-4 mt-10">Signup</h3>
      <hr />
      <form>
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" placeholder="Name" />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="password" class="form-control" placeholder="Email" />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" placeholder="Password" />
        </div>
        <div class="form-group">
          <label class="form-label">Confirm Password</label>
          <input type="password" class="form-control" placeholder="Confirm Password" />
        </div>
        <div class="my-3">
          <button type="submit" class="btn btn-primary w-100">Signup</button>
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
  margin-left: 150px;
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

.btn-primary {
  background-color: white; /* Keep background color white */
  border-color: #007bff; /* Keep the border color blue */
  color: #343a40; /* Use gray-800 for text color */
}

.btn-primary:hover {
  background-color: #e0e0e0; /* Optional: Light gray on hover for feedback */
  border-color: #004085; /* Keep hover border color */
  color: #28a745; /* Change text color to green-500 on hover */
}

hr {
  margin: 1rem 0;
}
</style>
