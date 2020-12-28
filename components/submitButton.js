import { Children } from "react";

const SubmitButton = ({ children, isSubmitting }) => {
  return (
    <button
      className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
      type="submit"
      disabled={isSubmitting}
    >
      {children}
    </button>
  );
};

export default SubmitButton;
