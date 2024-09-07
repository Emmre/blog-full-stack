const sendResponse = (res, status, description, data = null) => {
  const response = {
    status,
    description,
  };

  if (data !== null) {
    response.data = data;
  }

  res.status(status).json(response);
};

const cleanData = (data) => {
  return data;
};

module.exports = { cleanData, sendResponse };
