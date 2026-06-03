import { useNavigate } from 'react-router-dom';
function Register() {
 const navigate = useNavigate();

    function handlesubmission(e){
       
  e.preventDefault()

var firstname = e.target.firstname.value
var lastname = e.target.lastname.value
var email = e.target.email.value
var password = e.target.password.value

      var data =  {
        firstname,
        lastname,
        email,
        password
      }

  try {
 fetch('http://localhost:4000/register', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    }).then(res => res.json()).then(result => {
       if (result.success) {
      alert("User registered successfully!");
      navigate('/login');
    } else {
      alert(result.message || "Registration failed.");
    }
  })
}catch (err) {      
    alert("Something went wrong. Please try again.");
    console.error(err);
  
    
    }
  }
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card p-4 shadow">
            <h3 className="text-center mb-4">Register</h3>

            <form onSubmit={handlesubmission}>
              <div className="mb-3">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter first name"
                  name ="firstname"
                  required
                />
              </div>

              <div className="mb-3">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter last name"
                  name ="lastname"
                  required
                />
              </div>

              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  name ="email"
                  required
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  name ="password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register
