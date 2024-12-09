import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiClient from "../../api/apiClient";

const CreateBoard = ({ onBoardCreated }) => {
  const formik = useFormik({
    initialValues: {
      boardName: "",
    },
    validationSchema: Yup.object({
      boardName: Yup.string().trim().required("Board name is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await apiClient.post(
          `${process.env.REACT_APP_BASE_URL}/api/board`,
          {
            name: values.boardName,
          }
        );
        onBoardCreated(response.data);
        resetForm();
      } catch (error) {
        console.error("Error creating board:", error);
        alert("Failed to create board");
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex items-center justify-center space-x-4 mt-4"
    >
      <div className="flex flex-col">
        <input
          type="text"
          name="boardName"
          placeholder="Enter board name"
          value={formik.values.boardName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="border rounded p-2"
        />
        {formik.touched.boardName && formik.errors.boardName ? (
          <div className="text-red-500 text-sm">{formik.errors.boardName}</div>
        ) : null}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Board
      </button>
    </form>
  );
};

export default CreateBoard;
