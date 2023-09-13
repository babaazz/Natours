import axios from "axios";

//Update data or password
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "data"
        ? "http://127.0.0.1:3500/api/v1/users/updateMe"
        : "http://127.0.0.1:3500/api/v1/users/updatePassword";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });
    if (res.data.status === "Success") {
      alert("Data updated succesfully");
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};
