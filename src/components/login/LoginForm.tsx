import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { environment } from "../../environment/environment";

interface LoginFormInput {
  email: string;
  password: string;
}

function LoginForm() {
  const [loggedIn, setLoggedIn] = useState(false);

  const [msg, setMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>();
  const onSubmit: SubmitHandler<LoginFormInput> = (data) => {
    axios
      .post(environment.basepath + "auth/login", data)
      .then((response) => {
        //login success
        console.log(response.data);
        secureLocalStorage.setItem("accessToken", response.data.accessToken);
        secureLocalStorage.setItem("user_id", response.data.user.id);
        secureLocalStorage.setItem("user_type", response.data.user.user_type);
        secureLocalStorage.setItem("email", response.data.user.email);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        setLoggedIn(true);
      })
      .catch((error) => {
        console.log(error);
        setMsg("Invalid login");
      });
  };

  return (
    <section
      className="contact-area pt-110 pb-110"
      style={{
        backgroundImage:
          "linear-gradient(0deg, rgb(0 0 0 / 53%), transparent), url(img/bg/breadcrumb_bg.jpg)",
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
                <h5 className="sub-title text-white">Login</h5>
                <h2 className="title text-white">
                  Fill Your Credential<span>.</span>
                </h2>
                <div className="error-input"> {msg}</div>
              </div>
              <div className="contact-wrap-content">
                <form
                  className="contact-form"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="form-grp">
                    <label htmlFor="email" className="text-white">
                      Email <span>*</span>
                    </label>
                    <input
                      type="text"
                      id="email"
                      placeholder="Enter your email"
                      {...register("email", {
                        required: true,
                        pattern: {
                          value:
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Please enter a valid email",
                        },
                      })}
                    />
                    {errors.email && (
                      <span className="error-input">
                        This field is required. Enter valid email
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
                      placeholder="Enter your password"
                      {...register("password", {
                        required: true,
                        maxLength: 20,
                      })}
                    />
                    {errors.password && (
                      <span className="error-input">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="form-grp checkbox-grp flex-column">
                    <div className="d-flex align-items-center form-check">
                      <input
                        className="mt-0 me-2 form-check-input"
                        type="checkbox"
                        id="remember_me"
                      />
                      <label
                        htmlFor="remember_me"
                        className="text-white form-check-label"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-white mt-1">
                      Dont have account &nbsp;
                      <a
                        href="/#/register"
                        style={{
                          color: "#f04336",
                          textDecoration: "underline",
                        }}
                      >
                        Register Here
                      </a>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn rounded-btn w-100 justify-content-center"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;
