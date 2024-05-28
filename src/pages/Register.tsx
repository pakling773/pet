// import RegisterForm from "../components/register/RegisterForm";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { environment } from "../environment/environment";

interface IFormInput {
  first_name: string;
  last_name: string;
  email: string;
  phone: number;
  address_1: string;
  address_2: string;
  password: string;
  confirm_password: string;
}

function Register(props) {
  const loggedIn = props.loginState;

  const [msg, setMsg] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const requestOptions = {
      firstname: data.first_name,
      lastname: data.last_name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address_1: data.address_1,
      address_2: data.address_2,
    };

    axios
      .post(environment.basepath + "auth/register", requestOptions)
      .then((response) => {
        //login success
        console.log(response.data);
        secureLocalStorage.setItem("accessToken", response.data.token);
        secureLocalStorage.setItem("user_id", response.data.user.id);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        props.AfterLogin();
      })
      .catch((error) => {
        const error_ = error.response.data.message;
        setMsg(error_.toUpperCase());
      });
  };

  return (
    <main>
      {loggedIn && <Redirect to="/" />}
      <section
        className="contact-area pt-110 pb-110"
        style={{
          backgroundImage:
            "linear-gradient(42deg, rgb(0 0 0 / 53%), transparent), url(img/slider/slider_bg01.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {loggedIn && <Redirect to="/" />}
        <div className="container">
          <div className="container-inner-wrap">
            <div className="row justify-content-center ">
              <div className="col-lg-6 col-md-8 order-2 order-lg-0">
                <div className="contact-title mb-20">
                  <h5 className="sub-title text-white">Register</h5>
                  <h2 className="title text-white">
                    Fill Your Personal Information<span>.</span>
                  </h2>
                  <div className="error-input"> {msg}</div>
                </div>
                <div className="contact-wrap-content">
                  <form
                    className="contact-form"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="row">
                      <div className="col-md-6 col-12">
                        <div className="form-grp">
                          <label htmlFor="first_name" className="text-white">
                            First name <span>*</span>
                          </label>
                          <input
                            type="text"
                            id="first_name"
                            {...register("first_name", {
                              required: true,
                              maxLength: 20,
                            })}
                            placeholder="Enter your first_name"
                          />
                          {errors.first_name && (
                            <span className="error-input">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="form-grp">
                          <label htmlFor="last_name" className="text-white">
                            Last name <span>*</span>
                          </label>
                          <input
                            type="text"
                            id="last_name"
                            {...register("last_name", {
                              required: true,
                              maxLength: 20,
                            })}
                            placeholder="Enter your last_name"
                          />
                          {errors.last_name && (
                            <span className="error-input">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 col-12">
                        <div className="form-grp">
                          <label htmlFor="email" className="text-white">
                            Email <span>*</span>
                          </label>
                          <input
                            type="text"
                            id="email"
                            {...register("email", {
                              required: true,
                              pattern: {
                                value:
                                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "Please enter a valid email",
                              },
                            })}
                            placeholder="Enter your email"
                          />
                          {errors.email && (
                            <span className="error-input">
                              Enter a valid email
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="form-grp">
                          <label htmlFor="phone" className="text-white">
                            Phone <span>*</span>
                          </label>
                          <input
                            type="text"
                            id="phone"
                            placeholder="Enter your phone"
                            {...register("phone", {
                              required: true,
                              maxLength: 20,
                            })}
                          />
                          {errors.phone && (
                            <span className="error-input">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-grp">
                      <label htmlFor="address_line_1" className="text-white">
                        Address line 1 <span>*</span>
                      </label>
                      <input
                        type="text"
                        id="address_line_1"
                        {...register("address_1", {
                          required: true,
                          maxLength: 20,
                        })}
                        placeholder="Enter your address line 1"
                      />
                      {errors.address_1 && (
                        <span className="error-input">
                          This field is required
                        </span>
                      )}
                    </div>

                    <div className="form-grp">
                      <label htmlFor="address_line_2" className="text-white">
                        Address line 2 <span>*</span>
                      </label>
                      <input
                        {...register("address_2", { required: true })}
                        type="text"
                        id="address_line_2"
                        placeholder="Enter your address line 2"
                        {...register("address_2", { required: false })}
                      />
                      {errors.address_2 && (
                        <span className="error-input">
                          This field is required
                        </span>
                      )}
                    </div>

                    <div className="form-grp">
                      <label htmlFor="password" className="text-white">
                        Password <span>*</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        {...register("password", { required: true })}
                        placeholder="Enter your password"
                      />
                      {errors.password && (
                        <span className="error-input">
                          This field is required
                        </span>
                      )}
                    </div>
                    <div className="form-grp">
                      <label htmlFor="confirm_password" className="text-white">
                        Confirm Password <span>*</span>
                      </label>
                      <input
                        type="password"
                        id="confirm_password"
                        {...register("confirm_password", {
                          required: true,
                          validate: (val: string) => {
                            if (watch("password") !== val) {
                              return "Your passwords do no match";
                            }
                          },
                        })}
                        placeholder="Enter your confirm password"
                      />
                      {errors.confirm_password && (
                        <span className="error-input">
                          This field is required and should match password
                        </span>
                      )}
                    </div>

                    <div className="form-grp">
                      <div className="text-white mt-1">
                        Already have account? &nbsp;
                        <a
                          href="/#/login"
                          style={{
                            color: "#f04336",
                            textDecoration: "underline",
                          }}
                        >
                          Login
                        </a>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn rounded-btn w-100 justify-content-center"
                    >
                      Register
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;
