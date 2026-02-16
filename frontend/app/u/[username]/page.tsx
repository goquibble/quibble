import type { Metadata } from "next";
import { getUserByUsername } from "@/services/user";
import ProfileView from "./profile-view";

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getUserByUsername(username);

  return {
    title: `u/${profile.username}`,
    description: `Check out u/${profile.username}'s profile on Quibble`,
    openGraph: {
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  const profile = await getUserByUsername(username);

  return <ProfileView profile={profile} />;
}
