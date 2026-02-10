import { getUserByUsername } from "@/services/user";
import ProfileView from "./profile-view";

interface UserPageProps {
  params: { username: string };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  const profile = await getUserByUsername(username);

  return <ProfileView profile={profile} />;
}
