const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (!error) {
    return fallback;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return "Request timed out. If this is your first request, the server may be waking up — wait a moment and try again.";
  }

  if (error.message && !error.response) {
    return error.message;
  }

  if (error.code === "ERR_NETWORK" || !error.response) {
    return "Cannot reach the server. Confirm VITE_API_URL on Vercel points to your Render URL and redeploy.";
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
};

export default getErrorMessage;
