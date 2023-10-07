// import dayjs from "dayjs";
// import i18next from "i18next";
// import relativeTime from "dayjs/plugin/relativeTime";
// import { SWRConfig, mutate } from "swr";
// import { useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { Route, Routes } from "react-router-dom";
import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  List,
  Paper,
  Snackbar,
  Stack,
  styled,
  Tabs,
  TextField,
  ThemeProvider,
  Typography,
  Zoom,
} from "@mui/material";
// import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
// import { routers } from "./_routers";
// import { getAxios } from "@/services/api";
// import { useVerge } from "@/hooks/use-verge";
// import { ReactComponent as LogoSvg } from "@/assets/image/logo.svg";
// import { BaseErrorBoundary, Notice } from "@/components/base";
// import LoginItem from "@/components/Login/Login-item";
// import LoginControl from "@/components/Login/Login-control";
// import LoginTraffic from "@/components/Login/Login-traffic";
// import UpdateButton from "@/components/Login/update-button";
// import useCustomTheme from "@/components/Login/use-custom-theme";
import getSystem from "@/utils/get-system";
// import {
//   getProfiles,
//   patchClashConfig,
//   importProfile,
//   enhanceProfiles,
//   getRuntimeLogs,
//   deleteProfile,
//   updateProfile,
// } from "@/services/cmds";
// import useFetch, { Provider } from "use-http";
// import "dayjs/locale/zh-cn";
// import { useProfiles } from "@/hooks/use-profiles";

// dayjs.extend(relativeTime);

import bgSvg from "@/assets/image/login.svg";
import { useState } from "react";
import useFetch from "use-http";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import { openWebUrl } from "@/services/cmds";
import { Tab } from "@mui/icons-material";
import { toast } from "react-toastify";
const OS = getSystem();

const reg = /^1[3-9]\d{9}$/;
const emailReg = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/;

const prefix = "@phone.com";

const Login = ({ setToken }: any) => {
  const { post, loading, response } = useFetch("/api/v1/passport/auth/login");
  const { post: register, loading: registerLoading } = useFetch(
    "api/v1/passport/auth/register"
  );
  const [selectedValue, setSelected] = useState("1");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    redPassword: "",
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (reg.test(formData.email) || emailReg.test(formData.email)) {
      if (selectedValue === "1") {
        const emailData = emailReg.test(formData.email)
          ? formData.email
          : formData.email + prefix; //formData.email

        const res = await post({ ...formData, email: emailData });
        // console.log(res, "res");
        if (res.auth_data) {
          setToken(res.auth_data);
        }
      } else {
        if (formData.redPassword !== formData.password) {
          return toast.warn("两次密码输入不一致！", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }

        const emailData = emailReg.test(formData.email)
          ? formData.email
          : formData.email + prefix; //formData.email
        register({ ...formData, email: emailData }).then((res) => {
          if (res.token) {
            toast.success("账户注册成功，请登录使用！", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setSelected("1");
          }
        });
      }
    } else {
      toast.warn("手机号码或邮箱格式不正确", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <PageLogin
      square
      elevation={0}
      className={`${OS} Login`}
      onPointerDown={(e: any) => {
        if (e.target?.dataset?.windrag) appWindow.startDragging();
      }}
      onContextMenu={(e) => {
        // only prevent it on Windows
        // if (OS === "windows") e.preventDefault();
      }}
      //   sx={[
      //     ({ palette }) => ({
      //       bgcolor: alpha(palette.background.paper, theme_blur ? 0.8 : 1),
      //     }),
      //   ]}
    >
      <div className="Login__left" data-windrag>
        <div className="the-logo" data-windrag>
          {/* <LogoSvg /> */}

          {/* {!(OS === "windows" && WIN_PORTABLE) && (
                <UpdateButton className="the-newbtn" />
              )} */}
        </div>
        <div className="the-name">一键连</div>
      </div>
      <Container
        style={{
          height: "calc(100% - 50px)",
          display: "flex",
          justifyContent: "center",
        }}
        maxWidth="sm"
      >
        <Container
          style={{
            marginTop: 100,
          }}
          maxWidth="sm"
        >
          <TabContext value={selectedValue}>
            <Zoom in={selectedValue === "1"}>
              <TabPanel value="1">
                <LoginCard>
                  <CardHeader
                    title="登录"
                    subheader={
                      <Typography component="span">
                        还没有账号？
                        <Link
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setFormData({
                              email: "",
                              password: "",
                              redPassword: "",
                            });
                            setSelected("2");

                            // openWebUrl("https://order.1clickpass.com/#/register");
                          }}
                          color="rgb(158, 119, 237)"
                          underline="hover"
                        >
                          立即注册
                        </Link>
                      </Typography>
                    }
                  ></CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent>
                      <Stack spacing={3}>
                        {/* https://gmail.com/ */}
                        <TextField
                          // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                          name="email"
                          label="手机号或邮箱"
                          // helperText="手机号码错误"
                          // error
                          value={formData.email}
                          onChange={handleInputChange}
                        />

                        <TextField
                          name="password"
                          label="密码"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          // type={showPassword ? "text" : "password"}
                          //   InputProps={{
                          //     endAdornment: (
                          //       <InputAdornment position="end">
                          //         <IconButton
                          //           // onClick={() => setShowPassword(!showPassword)}
                          //           edge="end"
                          //         >
                          //           {/* <Iconify
                          //   icon={
                          //     showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                          //   }
                          // /> */}
                          //         </IconButton>
                          //       </InputAdornment>
                          //     ),
                          //   }}
                        />

                        <LoadingButton
                          fullWidth
                          type="submit"
                          color="warning"
                          size="large"
                          variant="contained"
                          disableElevation
                          loading={loading}
                          // loadingIndicator="登录中"
                        >
                          登录
                        </LoadingButton>
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ my: 2 }}
                      >
                        <Link variant="subtitle2" underline="hover">
                          {/* Forgot password? */}
                        </Link>
                        {/* <Link
                        onClick={() => {
                          openWebUrl(
                            "https://order.1clickpass.com/#/forgetpassword"
                          );
                        }}
                        variant="subtitle2"
                        color="rgb(158, 119, 237)"
                        underline="hover"
                      >
                        忘记密码？
                      </Link> */}
                      </Stack>
                      {/* <LoadingButton
              
              size="large"
              type="submit"
              variant="contained"
              onClick={handleClick}
            >
              Login
            </LoadingButton> */}
                    </CardContent>
                  </form>
                </LoginCard>
              </TabPanel>
            </Zoom>
            <TabPanel value="2">
              <Zoom in={selectedValue === "2"}>
                <LoginCard>
                  <CardHeader
                    title="注册账户"
                    subheader={
                      <Typography component="span">
                        已经拥有账号？
                        <Link
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelected("1");
                            // openWebUrl("https://order.1clickpass.com/#/register");
                          }}
                          color="rgb(158, 119, 237)"
                          underline="hover"
                        >
                          去登录使用
                        </Link>
                      </Typography>
                    }
                  ></CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent>
                      <Stack spacing={3}>
                        {/* https://gmail.com/ */}
                        <TextField
                          // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                          name="email"
                          label="手机号或邮箱"
                          // error={!reg.test(formData.email)}
                          // helperText="请输入正确的手机号"
                          // error
                          value={formData.email}
                          onChange={handleInputChange}
                        />

                        <TextField
                          name="password"
                          label="密码"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          // type={showPassword ? "text" : "password"}
                          //   InputProps={{
                          //     endAdornment: (
                          //       <InputAdornment position="end">
                          //         <IconButton
                          //           // onClick={() => setShowPassword(!showPassword)}
                          //           edge="end"
                          //         >
                          //           {/* <Iconify
                          //   icon={
                          //     showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                          //   }
                          // /> */}
                          //         </IconButton>
                          //       </InputAdornment>
                          //     ),
                          //   }}
                        />

                        <TextField
                          name="redPassword"
                          label="确认密码"
                          type="password"
                          value={formData.redPassword}
                          onChange={handleInputChange}
                          // type={showPassword ? "text" : "password"}
                          //   InputProps={{
                          //     endAdornment: (
                          //       <InputAdornment position="end">
                          //         <IconButton
                          //           // onClick={() => setShowPassword(!showPassword)}
                          //           edge="end"
                          //         >
                          //           {/* <Iconify
                          //   icon={
                          //     showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                          //   }
                          // /> */}
                          //         </IconButton>
                          //       </InputAdornment>
                          //     ),
                          //   }}
                        />

                        <LoadingButton
                          fullWidth
                          type="submit"
                          color="info"
                          size="large"
                          variant="contained"
                          disableElevation
                          loading={registerLoading}
                          // loadingIndicator="登录中"
                        >
                          注册
                        </LoadingButton>
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ my: 2 }}
                      >
                        <Link
                          style={{
                            cursor: "pointer",
                          }}
                          variant="subtitle2"
                          underline="hover"
                        >
                          {/* Forgot password? */}
                        </Link>
                        {/* <Link
                          onClick={() => {
                            openWebUrl(
                              "https://order.1clickpass.com/#/forgetpassword"
                            );
                          }}
                          variant="subtitle2"
                          color="rgb(158, 119, 237)"
                          underline="hover"
                        >
                          忘记密码？
                        </Link> */}
                      </Stack>
                      {/* <LoadingButton
              
              size="large"
              type="submit"
              variant="contained"
              onClick={handleClick}
            >
              Login
            </LoadingButton> */}
                    </CardContent>
                  </form>
                </LoginCard>
              </Zoom>
            </TabPanel>
          </TabContext>
        </Container>
      </Container>
    </PageLogin>
  );
};

export default Login;

const PageLogin = styled(Paper)(({ theme: { palette, typography } }) => ({
  width: "100vw",
  height: "100vh",
  //   background: "rgba(16, 18, 27, 0.4) !important",
  backdropFilter: "blur(20px)",
  boxSizing: "border-box",
  backgroundImage: `url(${bgSvg})`,
  backgroundColor: "rgb(11, 15, 25)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: " center top",
  //   background-image: url(/assets/gradient-bg.svg);
  display: "flex",
  flex: " 1 1 auto",
  flexDirection: "column",

  "& .Login__left": {
    padding: "20px 100px",
    paddingBottom: "0px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
  },
  "& .the-logo": {
    width: "30px",
    height: "30px",
    backgroundSize: "100%",
    borderRadius: "5px",
    // marginTop: "100px",
  },
  "& .the-name": {
    marginLeft: "10px",
    color: "rgb(237, 242, 247)",
    fontSize: "14px",
    fontWeight: "800",
  },
  //   borderRadius: "10px",
  //   border: " 1px solid #C75DEB",
  //   backgroundColor: "#3a3375",
  //   padding: "4px 0px",
  //   width: "80px",
  //   textAlign: "center",
}));

const LoginCard = styled(Card)(({ theme: { palette, typography } }) => ({
  backgroundColor: "#111927",
  borderRadius: "20px",
  padding: "15px 20px",
  color: "#fff",
}));
