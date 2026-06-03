function ProfilePreference() {
  function checktoken() {
    var token = localStorage.getItem("token");
  fetch("http://localhost:4000/test", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }
  return (
    <>
      <h1>user Cocnfedential page</h1>
      <button className="btn btn-success" onClick={checktoken}>
        fetch record
      </button>
    </>
  );
}
export default ProfilePreference;
