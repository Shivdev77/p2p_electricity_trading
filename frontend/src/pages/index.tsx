import ApplicationShell from "@/layouts/ApplicationShell";
import { NextPageWithLayout } from "./_app";
import Head from "next/head";
import { Button, Checkbox, PasswordInput, TextInput } from "@mantine/core";
import { useForm, isEmail } from "@mantine/form";
import Link from "next/link";
import useStore from "@/store/store";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

const Home: NextPageWithLayout = () => {
  const setUser = useStore((state) => state.setUser);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      keepLoggedIn: false,
    },

    validate: {
      email: isEmail("Invalid email"),
    },
  });

  const handleLogin = (values: any) => {
    notifications.show({
      id: "login",
      loading: true,
      title: "Logging into your account",
      message: "Hold on while we log you into your account",
      autoClose: false,
      withCloseButton: false,
    });
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        username: values.email,
        password: values.password,
        keepLoggedIn: values.keepLoggedIn,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.status !== 200) throw response;
        return response.json();
      })
      .then((userDetails) => {
        notifications.update({
          id: "login",
          color: "teal",
          title: "Logged in",
          message: "Logged in to your account",
          icon: <IconCheck size="1rem" />,
          autoClose: 5000,
        });
        setUser(userDetails);
      })
      .catch((err) => {
        console.error(err);
        notifications.update({
          id: "login",
          color: "red",
          title: "Error",
          message: "Check your username and password",
          icon: <IconX size="1rem" />,
          autoClose: 5000,
        });
      });
  };

  return (
    <main className="h-full">
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex justify-center items-center h-full">
        <div
          className="bg-white p-0 sm:p-4 rounded w-full shadow-xl border border-solid border-gray-200"
          style={{ maxWidth: 400 }}
        >
          <h1 className="text-center">Login</h1>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.onSubmit((values) => handleLogin(values))}
          >
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps("email")}
            />

            <PasswordInput
              placeholder="Password"
              label="Password"
              withAsterisk
              {...form.getInputProps("password")}
            />

            <Checkbox
              label="Keep me logged in"
              size="sm"
              {...form.getInputProps("keepLoggedIn")}
            />

            <Button type="submit" className="text-center mt-2">
              Submit
            </Button>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/create-account/" className="m-0">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

Home.getLayout = function getLayout(page) {
  return <ApplicationShell>{page}</ApplicationShell>;
};

export default Home;
