import type { Metadata } from "next";
import { getSpecialties } from "../../../../data/pro/categories";
import { JoinForm } from "../../../components/pro/JoinForm";

export const metadata: Metadata = {
  title: "Join as a Professional | GetServiHub Pro",
  description: "Apply to join GetServiHub Pro's verified network of professionals in San Diego.",
};

export default async function JoinPage() {
  const specialties = await getSpecialties();
  return <JoinForm specialties={specialties} />;
}
