import axios from "axios";
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3500/api/v1/users/signIn",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "Success") {
      window.setTimeout(() => {
        location.assign("/");
      }, 100);
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3500/api/v1/users/logout",
    });
    if (res.data.status === "Success") {
      location.reload(true);
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};
