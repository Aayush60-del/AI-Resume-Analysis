import API from "../api/axios";

export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await API.post(
    "/resume/upload",
    formData
  );

  return response.data;
};

export const getHistory = async () => {
  const response = await API.get("/resume/history");

  return response.data;
};

export const allResume = async () =>
{
  const response = await API.get("/resume/all");
  return response.data;

}

export const getSingleAnalysis = async (id)=>
{
  const response = await API.get(`/resume/analysis/${id}`);
  return response.data;
}

export const deleteResume = async (id) =>
{
  const response = await API.delete(`/resume/delete/${id}`);
  return response.data;
}


