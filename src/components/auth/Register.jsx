import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService/AuthService";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Digite um email válido")
    .required("O email é obrigatório"),
  password: Yup.string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .required("A senha é obrigatória"),
});

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await registerUser(values.email, values.password);
        navigate("/verify-email");
      } catch (error) {
        setErrors({ general: "Erro ao registrar. Tente novamente." });
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 bg-[#1a1a1a] shadow-lg rounded-lg">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Logo da Empresa" className="w-24 h-24 mb-4" />
          <h1 className="text-3xl font-bold text-white">Crie sua Conta</h1>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-300">Registrar</h2>
        {formik.errors.general && <p className="text-red-500 text-center mb-4">{formik.errors.general}</p>}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              placeholder="Digite seu email"
              className="w-full px-4 py-2 border border-gray-700 bg-[#181d316e] text-white rounded-md focus:outline-none focus:border-[#41b9dd] hover:border-[#41b9dd] transition-colors duration-200"
              autoComplete="email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
              placeholder="Digite sua senha"
              className="w-full px-4 py-2 border border-gray-700 bg-[#181d316e] text-white rounded-md focus:outline-none focus:border-[#41b9dd] hover:border-[#41b9dd] transition-colors duration-200"
              autoComplete="new-password"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#605f5f] text-white font-semibold rounded-lg hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#605f5f] transition"
            disabled={formik.isSubmitting}
          >
            Registrar
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300 text-sm">
          Já tem uma conta? {" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
