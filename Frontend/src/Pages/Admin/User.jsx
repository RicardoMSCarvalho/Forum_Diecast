import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { delet, get } from "../../services/Endpoint";
import toast from "react-hot-toast";

export default function User() {
  const [Users, setUsers] = useState([]);
  const [loadedata, setLoadedata] = useState(false);

  const handleDelete = async (userID) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmed) {
      try {
        const response = await delet(`/dashboard/delete/${userID}`);
        const data = response.data;

        if (data.success) {
          toast.success(data.message);
          setLoadedata(!loadedata);
        } else {
          toast.error("Failed to delete the user.");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  useEffect(() => {
    const getuser = async () => {
      try {
        const response = await get("/dashboard/users");
        const data = response.data;
        setUsers(data.Users);
      } catch (error) {
        console.log(error.message);
      }
    };
    getuser();
  }, [loadedata]);
  return (
    <div className="container ">
      <h1 className=" text-white mb-4">Users</h1>
      <div className="table-responsive">
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {Users &&
              Users.map((user, index) => (
                <tr key={user.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
