"use client";
import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
const RegisterPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [values, setValues] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    pendingVerification: false,
    code: "",
  });
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    try {
      console.log(
        {
          first_name: values.firstName,
          last_name: values.lastName,
          email_address: values.email,
          password: values.password
        }
      )
      await signUp.create({
        first_name: values.firstName,
        last_name: values.lastName,
        email_address: values.email,
        password: values.password
      });
      console.log(
        {
          first_name: values.firstName,
          last_name: values.lastName,
          email_address: values.email,
          password: values.password
        }
      )
      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      // Change UI
      setValues({ ...values, pendingVerification: true });
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleChange = ({ target: { name, value } }) => {
    setValues({ ...values, [name]: value });
  }
  const onPressVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: values.code,
      });
      console.log("er", completeSignUp);
      if (completeSignUp.status !== 'complete') {
        /*  investigate the response, to see if there was an error
          or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push('/');
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <div className="border p-5 rounded" style={{ width: "500px" }}>
      <h1 className="text-2xl mb-4">Register</h1>
      {
        !values.pendingVerification && (
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="firstName"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                First Name
              </label>
              <input type="text"
                name="firstName"
                id='firstName'
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg
                  focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                required={true}
              />
            </div>
            <div>
              <label htmlFor="lastName"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Last Name
              </label>
              <input type="text"
                name="lastName"
                id='lastName'
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg
                  focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                required={true}
              />
            </div>
            <div>
              <label htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Email Address
              </label>
              <input type="email"
                name="email"
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg
                  focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                required={true}
              />
            </div>
            <div>
              <label htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input type="password"
                name="password"
                id='password'
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg
                  focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                required={true}
              />
            </div>

            <button type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 
                font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Create an account
            </button>
          </form>
        )
      }
      {
        values.pendingVerification && (
          <div>
            <form className="space-y-4 md:space-y-6" onSubmit={onPressVerify}>
              <input type="text"
                value={values.code}
                name="code"
                id='code'
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg
                    focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Enter Verfication Code..."
                required={true}
              />
              <button type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 
                      font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Verify Email
              </button>
            </form>
          </div>
        )
      }
    </div>
  )
}
export default RegisterPage;