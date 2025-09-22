import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignupPage() {
  const [firebaseError, setFirebaseError] = useState("");
  const navigate = useNavigate();

  // Validation schema
  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSignup = async (values, { setSubmitting }) => {
    setFirebaseError("");
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      navigate("/log"); // Redirect after successful signup
    } catch (err) {
      setFirebaseError(err.message.replace("Firebase:", "").trim());
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-fit items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Sign Up
        </h2>

        {firebaseError && (
          <p className="mb-4 text-sm text-red-500 text-center">
            {firebaseError}
          </p>
        )}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
