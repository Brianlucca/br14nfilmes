import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService/AuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Message } from 'rsuite';

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
  const [apiError, setApiError] = useState(null);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      try {
        await registerUser(values.email, values.password);
        navigate("/verify-email");
      } catch (error) {
        setApiError(`Erro ao registrar. Verifique os dados ou tente novamente mais tarde. Se o problema persistir, contate: contatobr14nfilmes@gmail.com`);
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-gray-300 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-[#1c1c1c] shadow-2xl rounded-xl overflow-hidden">
        
        <div className="hidden md:flex md:w-1/2 p-8 sm:p-12 flex-col items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#111111] relative">
          <img 
            src="/logo.png" 
            alt="Logo br14nfilmes" 
            className="w-40 h-40 mb-6 rounded-full shadow-lg" 
          />
          <h2 className="text-3xl font-bold text-white mb-3 text-center">br14nfilmes</h2>
          <p className="text-gray-400 text-center text-sm">
            Junte-se à nossa comunidade! <br /> Comente, avalie e organize suas sessões de filmes e séries.
          </p>
          <div className="absolute bottom-4 left-4 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} br14nfilmes
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-[#1a1a1a]">
          <div className="flex flex-col items-center mb-6 md:hidden">
            <img src="/logo.png" alt="Logo br14nfilmes" className="w-20 h-20 mb-3" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">Crie Sua Conta</h1>
          <h2 className="text-lg sm:text-xl font-semibold mb-6 text-center text-gray-400">É rápido e fácil!</h2>

          {apiError && (
            <Message type="error" closable className="mb-4 !bg-red-700 !text-white">
               {apiError}
            </Message>
          )}
          {/* Mantido para erros gerais do Formik, caso use setErrors({general: ...}) no futuro */}
          {formik.errors.general && ( 
             <Message type="error" closable className="mb-4 !bg-red-700 !text-white">
                {formik.errors.general}
             </Message>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...formik.getFieldProps("email")}
                placeholder="seuemail@exemplo.com"
                className={`w-full px-4 py-2.5 border bg-[#2d2d2d] text-white rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${formik.touched.email && formik.errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-[#605f5f]'}`}
                autoComplete="email"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                {...formik.getFieldProps("password")}
                placeholder="Crie uma senha (mín. 8 caracteres)"
                className={`w-full px-4 py-2.5 border bg-[#2d2d2d] text-white rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${formik.touched.password && formik.errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-[#605f5f]'}`}
                autoComplete="new-password"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-2.5 px-4 bg-[#505050] text-white font-semibold rounded-lg hover:bg-[#454545] focus:outline-none focus:ring-2 focus:ring-[#5a5a5a] focus:ring-opacity-75 transition-colors duration-200 disabled:opacity-50"
            >
              {formik.isSubmitting ? 'Registrando...' : 'Registrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Já tem uma conta?{" "}
            <Link to="/login" className="font-medium text-[#41b9dd] hover:text-[#63c9e7] hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
