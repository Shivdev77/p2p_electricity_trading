import ApplicationShell from "@/layouts/ApplicationShell";
import { NextPageWithLayout } from "../_app";
import Head from "next/head";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm, isEmail, hasLength } from "@mantine/form";
import Link from "next/link";
import useStore from "@/store/store";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

const CreateAccount: NextPageWithLayout = () => {
  const setUser = useStore((state) => state.setUser);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      email: isEmail("Invalid email"),
      name: hasLength(
        { min: 3 },
        "Name must contain a minimum of 3 characters"
      ),
      password: hasLength(
        { min: 8 },
        "Password must contain a minimum of 8 characters"
      ),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleCreateAccount = (values: any) => {
    notifications.show({
      id: "create-account",
      loading: true,
      title: "Creating your account",
      message: "Hold on while your account is being created",
      autoClose: false,
      withCloseButton: false,
    });
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/create-account`, {
      method: "POST",
      body: JSON.stringify({
        username: values.email,
        password: values.password,
        name: values.name,
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
          id: "create-account",
          color: "teal",
          title: "Account Created",
          message: "Logged into your new account",
          icon: <IconCheck size="1rem" />,
          autoClose: 5000,
        });
        setUser(userDetails);
      })
      .catch((err) => {
        console.error(err);
        notifications.update({
          id: "create-account",
          color: "red",
          title: "Error",
          message:
            "Could not create your account right now, please try again later.",
          icon: <IconX size="1rem" />,
          autoClose: 5000,
        });
      });
  };

  return (
    <main className="h-full">
      <Head>
        <title>Create Account</title>
      </Head>
      <div className="flex justify-center items-center h-full">
        <div
          className="bg-white p-0 sm:p-4 rounded w-full shadow-xl border border-solid border-gray-200"
          style={{ maxWidth: 400 }}
        >
          <h1 className="text-center">Create Account</h1>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.onSubmit((values) => handleCreateAccount(values))}
          >
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps("email")}
            />

            <TextInput
              withAsterisk
              label="Name"
              placeholder="Your Name"
              {...form.getInputProps("name")}
            />

            <PasswordInput
              placeholder="Password"
              label="Password"
              withAsterisk
              {...form.getInputProps("password")}
            />

            <PasswordInput
              placeholder="Confirm Password"
              label="Confirm Password"
              withAsterisk
              {...form.getInputProps("confirmPassword")}
            />

            <Button type="submit" className="text-center mt-2">
              Submit
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/" className="m-0">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

CreateAccount.getLayout = function getLayout(page) {
  return <ApplicationShell>{page}</ApplicationShell>;
};

export default CreateAccount;
