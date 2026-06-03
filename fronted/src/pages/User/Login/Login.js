function Login() {
  function handlelogin(e) {
    e.preventDefault();

    var email = e.target.email.value;
    var password = e.target.password.value;

    var logindata = {
      email,
      password,
    };

    fetch("http://localhost:4000/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logindata),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem('token',data.token)
        console.log(data);
      });
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card p-4 shadow">
            <h3 className="text-center mb-4">login</h3>

            <form onSubmit={handlelogin}>
              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  name="email"
                  required
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  name="password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
