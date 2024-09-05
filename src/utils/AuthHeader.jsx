import authBaseQuery from "../../utils/authBaseQuery";

const AuthHeader = async () => {
  const headers = new Headers();
  await authBaseQuery({
    url: "",
    method: "HEAD",
    headers,
  });
  return headers;
};
