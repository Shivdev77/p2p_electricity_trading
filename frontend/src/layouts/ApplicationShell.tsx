import useClientLoaded from "@/hooks/useClientLoaded";
import useStore from "@/store/store";
import {
  AppShell,
  Header,
  useMantineTheme,
  Text,
  Avatar,
  Menu,
} from "@mantine/core";
import { IconLogout, IconSettings, IconTrash } from "@tabler/icons-react";

const ApplicationShell = ({ children }: any) => {
  const theme = useMantineTheme();
  // const [opened, setOpened] = useState(false);
  const user = useStore((state) => state.user);
  const logOutUser = useStore((state) => state.logOutUser);

  const handleLogOut = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(logOutUser);
  };

  const clientLoaded = useClientLoaded();

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div className="flex items-center h-full">
            {/* <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery> */}
            <div className="flex-1">
              <Text size="xl">P2P Electricity Trading</Text>
            </div>

            {clientLoaded && user && (
              <Menu shadow="md" width={200} trigger="click">
                <Menu.Target>
                  <Avatar color="blue" radius="xl" className="cursor-pointer">
                    {user.name
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")}
                  </Avatar>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>{user.name}</Menu.Label>
                  <Menu.Item icon={<IconSettings size={14} />}>
                    Settings
                  </Menu.Item>
                  <Menu.Item
                    icon={<IconLogout size={14} />}
                    onClick={handleLogOut}
                  >
                    Logout
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Label>Danger zone</Menu.Label>
                  <Menu.Item color="red" icon={<IconTrash size={14} />}>
                    Delete my account
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default ApplicationShell;
