export const signupReq = (
  email = "test@test.com",
  password = "test_password"
) => {
  return new Request("http://localhost:3000/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const signinReq = (
  email = "test@test.com",
  password = "test_password"
) => {
  return new Request("http://localhost:3000/api/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const signoutReq = () => {
  return new Request("http://localhost:3000/api/signout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
