import { getUserByUsername } from "@/services/user";
import ProfileView from "./profile-view";

interface UserPageProps {
  params: { username: string };
}

export default async function UserPage({ params }: UserPageProps) {
  const profile = await getUserByUsername(params.username);

  return <ProfileView profile={profile} />;
}
