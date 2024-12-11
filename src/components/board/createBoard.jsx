import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiClient from "../../api/apiClient";

const CreateBoard = ({ onBoardCreated }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const formik = useFormik({
    initialValues: {
      boardName: "",
    },
    validationSchema: Yup.object({
      boardName: Yup.string().trim().required("Board name is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setErrorMessage("");
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
        if (error.response && error.response.status === 400) {
          setErrorMessage(
            error.response.data.message || "Board name already exists."
          );
        } else {
          setErrorMessage("Failed to create board. Please try again.");
        }
      } finally {
        setLoading(false);
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
        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}
      </div>
      <button
        type="submit"
        className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        Create Board
      </button>
    </form>
  );
};

export default CreateBoard;
