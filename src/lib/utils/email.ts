const getEmailUrl = () => {
  const base64 = "bWFpbHRvOmhlbGxvQG1hcnZpbnZyLmNo";
  return atob(base64);
};

export { getEmailUrl };