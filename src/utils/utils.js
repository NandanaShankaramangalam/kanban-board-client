export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return token ? true : false;
};

export const getSelectedBoardInfo = () => {
  const boardInfo = JSON.parse(localStorage.getItem("selectedBoard"));
  return boardInfo;
};

export const Spinner = () => {
  return (
    <div className="flex justify-center items-center mt-20">
      <div className="border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
    </div>
  );
};
