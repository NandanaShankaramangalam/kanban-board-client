export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return token ? true : false;
};

export const getSelectedBoardInfo = () => {
  const boardInfo = JSON.parse(localStorage.getItem("selectedBoard"));
  return boardInfo;
};
