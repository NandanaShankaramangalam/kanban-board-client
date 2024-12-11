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

export const getRandomColor = () => {
  const colors = [
    "#FFCDD2", // Pastel Red
    "#D1C4E9", // Light Lavender
    "#C5CAE9", // Pastel Blue
    "#BBDEFB", // Light Sky Blue
    "#B3E5FC", // Soft Cyan
    "#B2EBF2", // Pastel Aqua
    "#B2DFDB", // Pastel Teal
    "#C8E6C9", // Light Mint Green
    "#DCEDC8", // Soft Lime Green
    "#F0F4C3", // Pale Yellow Green
    "#FFF9C4", // Soft Lemon Yellow
    "#FFECB3", // Pastel Peach
    "#FFE0B2", // Light Apricot
    "#FFCCBC", // Warm Pastel Orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
